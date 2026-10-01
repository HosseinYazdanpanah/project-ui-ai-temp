const { createTransaction, getDiscovery, noStore, requireConfig } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  noStore(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const config = requireConfig();
    const discovery = await getDiscovery();
    const transaction = createTransaction(config);
    const authorizationUrl = new URL(discovery.authorization_endpoint);
    authorizationUrl.search = new URLSearchParams(transaction.authorizationParams).toString();
    res.setHeader('Set-Cookie', transaction.cookie);
    res.redirect(302, authorizationUrl.toString());
  } catch (error) {
    console.error('HAFS sign-in start failed', { message: error.message });
    res.status(503).send('ورود با ChatGPT هنوز برای HAFS آماده نیست.');
  }
};
