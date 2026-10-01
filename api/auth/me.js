const { readSession, requireConfig, sendJson } = require('../../lib/auth');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  let config;
  try {
    config = requireConfig();
  } catch {
    return sendJson(res, 200, { available: false, authenticated: false });
  }
  const session = readSession(req, config);
  if (!session) return sendJson(res, 200, { available: true, authenticated: false });
  return sendJson(res, 200, { available: true, authenticated: true, csrfToken: session.csrf });
};
