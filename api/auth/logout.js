const {
  SESSION_COOKIE, clearCookie, readSession, requireConfig,
  sendJson, validPost,
} = require('../../lib/auth');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  let config;
  try {
    config = requireConfig();
  } catch {
    return sendJson(res, 503, { error: 'Authentication unavailable' });
  }
  const session = readSession(req, config);
  if (!session || !validPost(req, config, session)) {
    return sendJson(res, 403, { error: 'Unauthorized' });
  }
  res.setHeader('Set-Cookie', clearCookie(SESSION_COOKIE));
  return sendJson(res, 200, { ok: true });
};
