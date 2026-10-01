const {
  AUTH_COOKIE, clearCookie, createSession, exchangeCode, getDiscovery,
  noStore, readTransaction, requireConfig, verifyIdentity,
} = require('../../lib/auth');

module.exports = async function handler(req, res) {
  noStore(res);
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Set-Cookie', clearCookie(AUTH_COOKIE));
  try {
    const config = requireConfig();
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const transaction = readTransaction(req, config, state);
    if (!transaction || req.query.error || !code || code.length > 4096) {
      return res.redirect(302, '/?assistant=signin-error');
    }
    const discovery = await getDiscovery();
    const idToken = await exchangeCode(code, transaction, config, discovery);
    const identity = await verifyIdentity(idToken, transaction.nonce, config, discovery);
    res.setHeader('Set-Cookie', [clearCookie(AUTH_COOKIE), createSession(identity, config)]);
    return res.redirect(302, '/?assistant=ready');
  } catch (error) {
    console.error('HAFS sign-in callback failed', { message: error.message });
    return res.redirect(302, '/?assistant=signin-error');
  }
};
