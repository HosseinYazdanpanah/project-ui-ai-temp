const test = require('node:test');
const assert = require('node:assert/strict');
const { AUTH_COOKIE, createSession, createTransaction, readSession, readTransaction, seal, unseal } = require('../lib/auth');
const assistant = require('../api/assistant');

const config = {
  baseUrl: 'https://project-ui-ai-temp-theta.vercel.app',
  ownerEmail: 'owner@example.com',
  sessionSecret: 'test-secret-with-more-than-thirty-two-characters',
  clientId: 'oaiapp_test',
  redirectUri: 'https://project-ui-ai-temp-theta.vercel.app/api/auth/callback',
};

function cookieValue(setCookie) {
  return setCookie.split(';')[0];
}

function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    setHeader() {},
    json(body) { this.body = body; return this; },
  };
}

test('sealed state rejects tampering and a different secret', () => {
  const sealed = seal({ value: 'private' }, config.sessionSecret);
  assert.deepEqual(unseal(sealed, config.sessionSecret), { value: 'private' });
  assert.equal(unseal(`${sealed}x`, config.sessionSecret), null);
  assert.equal(unseal(sealed, `${config.sessionSecret}wrong`), null);
});

test('OAuth transaction checks state and expiration', () => {
  const transaction = createTransaction(config);
  const parsed = unseal(transaction.cookie.split(';')[0].split('=')[1], config.sessionSecret);
  const req = { headers: { cookie: cookieValue(transaction.cookie) } };
  assert.equal(readTransaction(req, config, parsed.state)?.nonce, parsed.nonce);
  assert.equal(readTransaction(req, config, 'wrong'), null);
  const expired = seal({ ...parsed, exp: 1 }, config.sessionSecret);
  assert.equal(readTransaction({ headers: { cookie: `${AUTH_COOKIE}=${expired}` } }, config, parsed.state), null);
});

test('owner session is rejected for a different allowed email', () => {
  const cookie = cookieValue(createSession({ sub: 'subject-1', email: config.ownerEmail }, config));
  assert.equal(readSession({ headers: { cookie } }, config)?.sub, 'subject-1');
  assert.equal(readSession({ headers: { cookie } }, { ...config, ownerEmail: 'other@example.com' }), null);
});

test('assistant refuses unauthenticated requests before calling OpenAI', async () => {
  const oldEnv = { ...process.env };
  const oldFetch = global.fetch;
  Object.assign(process.env, {
    HAFS_BASE_URL: config.baseUrl, HAFS_OWNER_EMAIL: config.ownerEmail,
    HAFS_SESSION_SECRET: config.sessionSecret, OPENAI_CLIENT_ID: config.clientId,
    OPENAI_API_KEY: 'test-only-key',
  });
  global.fetch = () => { throw new Error('fetch should not be called'); };
  try {
    const res = response();
    await assistant({ method: 'POST', headers: { origin: config.baseUrl, 'content-type': 'application/json' }, body: {} }, res);
    assert.equal(res.statusCode, 403);
  } finally {
    process.env = oldEnv;
    global.fetch = oldFetch;
  }
});

test('assistant requires CSRF, validates input, and returns model text', async () => {
  const oldEnv = { ...process.env };
  const oldFetch = global.fetch;
  Object.assign(process.env, {
    HAFS_BASE_URL: config.baseUrl, HAFS_OWNER_EMAIL: config.ownerEmail,
    HAFS_SESSION_SECRET: config.sessionSecret, OPENAI_CLIENT_ID: config.clientId,
    OPENAI_API_KEY: 'test-only-key',
  });
  const cookie = cookieValue(createSession({ sub: 'subject-1', email: config.ownerEmail }, config));
  const session = readSession({ headers: { cookie } }, config);
  let called = 0;
  global.fetch = async (_url, options) => {
    called += 1;
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.equal(body.input.at(-1).role, 'user');
    return { ok: true, json: async () => ({ output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'پاسخ آزمون' }] }] }) };
  };
  const validBody = { mode: 'form', message: 'به فرم کمک کن', history: [], context: { section: 'intake', projectName: 'Project', fields: [] } };
  const headers = { cookie, origin: config.baseUrl, 'content-type': 'application/json', 'x-hafs-csrf': session.csrf };
  try {
    const forbidden = response();
    await assistant({ method: 'POST', headers: { ...headers, 'x-hafs-csrf': 'wrong' }, body: validBody }, forbidden);
    assert.equal(forbidden.statusCode, 403);
    const invalid = response();
    await assistant({ method: 'POST', headers, body: { ...validBody, message: '' } }, invalid);
    assert.equal(invalid.statusCode, 400);
    const result = response();
    await assistant({ method: 'POST', headers, body: validBody }, result);
    assert.equal(result.statusCode, 200);
    assert.equal(result.body.answer, 'پاسخ آزمون');
    assert.equal(called, 1);
  } finally {
    process.env = oldEnv;
    global.fetch = oldFetch;
  }
});
