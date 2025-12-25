const { addUser, findUserByEmail } = require('../../lib/data');
const { issueToken, setAuthCookie } = require('../../lib/auth');
const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phoneNumber, password, gender, agreement, birthdate, district, photo, bloodGroup } = req.body || {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'First name, last name, email, and password are required' });
  }
  if (!agreement) {
    return res.status(400).json({ error: 'You must accept the agreement' });
  }
  if (phoneNumber && !/^01\d{9}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Phone number must start with 01 and be 11 digits' });
  }

  const exists = await findUserByEmail(email);
  if (exists) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const passwordHash = crypto.createHash('sha256').update(String(password)).digest('hex');

  const user = {
    id: String(Date.now()),
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: String(email).toLowerCase().trim(),
    phoneNumber: String(phoneNumber).trim(),
    gender: String(gender),
    birthdate: birthdate ? String(birthdate) : null,
    district: district ? String(district) : null,
    bloodGroup: bloodGroup ? String(bloodGroup) : null,
    passwordHash,
    photo: photo || null,
    createdAt: new Date().toISOString(),
  };

  await addUser(user);

  // Optionally auto-login after signup; here we keep user on signup page
  return res.status(201).json({ message: 'User registered successfully' });
}
