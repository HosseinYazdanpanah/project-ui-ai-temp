const {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} = require('node:crypto');

const AUTH_COOKIE = '__Host-hafs-oauth';
const SESSION_COOKIE = '__Host-hafs-session';
const ISSUER = 'https://auth.openai.com';
const DISCOVERY_URL = `${ISSUER}/.well-known/openid-configuration`;
const AUTH_TTL_SECONDS = 600;
const SESSION_TTL_SECONDS = 28800;

let cachedDiscovery;
let cachedJwks;

function requireConfig() {
  const { HAFS_BASE_URL, HAFS_OWNER_EMAIL, HAFS_SESSION_SECRET, OPENAI_CLIENT_ID } = process.env;
  if (!HAFS_BASE_URL || !HAFS_OWNER_EMAIL || !HAFS_SESSION_SECRET || !OPENAI_CLIENT_ID) {
    throw new Error('HAFS authentication is not configured');
  }
  if (HAFS_SESSION_SECRET.length < 32) {
    throw new Error('HAFS_SESSION_SECRET must be at least 32 characters');
  }
  const base = new URL(HAFS_BASE_URL);
  if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash) {
    throw new Error('HAFS_BASE_URL must be an HTTPS origin');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(HAFS_OWNER_EMAIL)) {
    throw new Error('HAFS_OWNER_EMAIL must be an email address');
  }
  const authMethod = process.env.OPENAI_CLIENT_AUTH_METHOD || 'none';
  if (!['none', 'client_secret_basic'].includes(authMethod)) {
    throw new Error('Unsupported OpenAI client authentication method');
  }
  if (authMethod === 'client_secret_basic' && !process.env.OPENAI_CLIENT_SECRET) {
    throw new Error('OPENAI_CLIENT_SECRET is required for this client');
  }
  return {
    baseUrl: base.origin,
    ownerEmail: HAFS_OWNER_EMAIL.toLowerCase(),
    sessionSecret: HAFS_SESSION_SECRET,
    clientId: OPENAI_CLIENT_ID,
    authMethod,
    clientSecret: process.env.OPENAI_CLIENT_SECRET,
    redirectUri: `${base.origin}/api/auth/callback`,
  };
}

function cookieHeader(name, value, maxAge) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearCookie(name) {
  return cookieHeader(name, '', 0);
}

function getCookie(req, name) {
  const cookies = (req.headers.cookie || '').split(';');
  const match = cookies.map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

function encryptionKey(secret) {
  return createHash('sha256').update(`hafs-cookie-v1:${secret}`).digest();
}

function seal(payload, secret) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(secret), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64url');
}

function unseal(value, secret) {
  if (typeof value !== 'string' || value.length > 4096) return null;
  try {
    const data = Buffer.from(value, 'base64url');
    if (data.length < 29) return null;
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(secret), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const payload = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8'));
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}

function randomValue(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

function sameText(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function createTransaction(config) {
  const state = randomValue();
  const verifier = randomValue(64);
  const nonce = randomValue();
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const transaction = { state, verifier, nonce, exp: Math.floor(Date.now() / 1000) + AUTH_TTL_SECONDS };
  return {
    cookie: cookieHeader(AUTH_COOKIE, seal(transaction, config.sessionSecret), AUTH_TTL_SECONDS),
    authorizationParams: {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      nonce,
    },
  };
}

function readTransaction(req, config, returnedState) {
  const transaction = unseal(getCookie(req, AUTH_COOKIE), config.sessionSecret);
  if (!transaction || transaction.exp <= Math.floor(Date.now() / 1000) ||
      !sameText(transaction.state, returnedState) || typeof transaction.verifier !== 'string' ||
      typeof transaction.nonce !== 'string') {
    return null;
  }
  return transaction;
}

function createSession(identity, config) {
  const payload = {
    sub: identity.sub,
    email: identity.email.toLowerCase(),
    csrf: randomValue(),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  return cookieHeader(SESSION_COOKIE, seal(payload, config.sessionSecret), SESSION_TTL_SECONDS);
}

function readSession(req, config) {
  const session = unseal(getCookie(req, SESSION_COOKIE), config.sessionSecret);
  if (!session || !session.sub || !session.csrf || session.exp <= Math.floor(Date.now() / 1000) ||
      session.email !== config.ownerEmail) return null;
  return session;
}

function validPost(req, config, session) {
  return req.headers.origin === config.baseUrl &&
    sameText(req.headers['x-hafs-csrf'], session.csrf);
}

async function getDiscovery() {
  if (cachedDiscovery && cachedDiscovery.expires > Date.now()) return cachedDiscovery.value;
  const response = await fetch(DISCOVERY_URL, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('OpenAI discovery failed');
  const discovery = await response.json();
  if (discovery.issuer !== ISSUER) throw new Error('Unexpected OpenAI issuer');
  for (const key of ['authorization_endpoint', 'token_endpoint', 'jwks_uri']) {
    const url = new URL(discovery[key]);
    if (url.protocol !== 'https:' || url.origin !== ISSUER) throw new Error('Unexpected OpenAI endpoint');
  }
  cachedDiscovery = { value: discovery, expires: Date.now() + 3600000 };
  return discovery;
}

async function exchangeCode(code, transaction, config, discovery) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code', code, redirect_uri: config.redirectUri,
    client_id: config.clientId, code_verifier: transaction.verifier,
  });
  const headers = { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' };
  if (config.authMethod === 'client_secret_basic') {
    const encode = (value) => new URLSearchParams({ value }).toString().slice(6);
    headers.authorization = `Basic ${Buffer.from(`${encode(config.clientId)}:${encode(config.clientSecret)}`).toString('base64')}`;
  }
  const response = await fetch(discovery.token_endpoint, {
    method: 'POST', headers, body, signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error('OpenAI token exchange failed', { status: response.status, requestId: response.headers.get('x-request-id') });
    throw new Error('OpenAI token exchange failed');
  }
  const tokens = await response.json();
  if (typeof tokens.id_token !== 'string') throw new Error('OpenAI ID token missing');
  return tokens.id_token;
}

async function verifyIdentity(idToken, nonce, config, discovery) {
  const { createRemoteJWKSet, jwtVerify } = await import('jose');
  if (!cachedJwks || cachedJwks.uri !== discovery.jwks_uri) {
    cachedJwks = { uri: discovery.jwks_uri, set: createRemoteJWKSet(new URL(discovery.jwks_uri)) };
  }
  const { payload } = await jwtVerify(idToken, cachedJwks.set, {
    issuer: discovery.issuer,
    audience: config.clientId,
    requiredClaims: ['sub', 'exp', 'iat'],
    clockTolerance: 5,
  });
  if (!sameText(payload.nonce, nonce) || typeof payload.sub !== 'string' || !payload.sub) {
    throw new Error('OpenAI identity verification failed');
  }
  if (payload.email_verified !== true || typeof payload.email !== 'string' ||
      payload.email.toLowerCase() !== config.ownerEmail) {
    throw new Error('OpenAI identity is not the HAFS owner');
  }
  return payload;
}

function noStore(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function sendJson(res, status, body) {
  noStore(res);
  res.status(status).json(body);
}

module.exports = {
  AUTH_COOKIE, SESSION_COOKIE, clearCookie, createSession, createTransaction,
  exchangeCode, getDiscovery, noStore, readSession, readTransaction, requireConfig,
  sendJson, validPost, verifyIdentity,
  // Exposed for focused security tests.
  seal, unseal,
};
