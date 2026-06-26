const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const SECRET = process.env.JWT_SECRET || 'dev_secret_for_practice';

function issueToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
  };
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

function getUserFromReq(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    return verifyToken(token);
  }
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token;
  if (!token) return null;
  return verifyToken(token);
}

function setAuthCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
  );
}

function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })
  );
}

module.exports = { issueToken, verifyToken, getUserFromReq, setAuthCookie, clearAuthCookie };
