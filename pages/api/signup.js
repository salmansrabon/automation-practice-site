const { addUser, findUserByEmail } = require('../../lib/data');
const { issueToken, setAuthCookie } = require('../../lib/auth');
const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phoneNumber, password, gender, agreement, birthdate, district, photo, bloodGroup } = req.body || {};

  if (!firstName || !lastName || !email || !phoneNumber || !password || !gender) {
    return res.status(400).json({ error: 'All required fields are missing' });
  }
  if (!agreement) {
    return res.status(400).json({ error: 'You must accept the agreement' });
  }

  if (!bloodGroup) {
    return res.status(400).json({ error: 'Blood group is required' });
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
