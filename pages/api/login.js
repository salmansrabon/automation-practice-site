const { findUserByEmail } = require('../../lib/data');
const { issueToken, setAuthCookie } = require('../../lib/auth');
const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordHash = crypto.createHash('sha256').update(String(password)).digest('hex');
  if (user.passwordHash !== passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = issueToken(user);
  setAuthCookie(res, token);
  return res.status(200).json({ message: 'Logged in', token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
}
