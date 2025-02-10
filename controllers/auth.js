import { User } from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' });

  const userExist = await User.find({ email: { $eq: email } });
  if (userExist.length) return res.status(409).json({ success: false, message: 'Email already in use' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = new User({ name, email, password: hashedPassword });
  try {
    const newUser = await userData.save();
    res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.send('No Email or Password provided');

  const user = await User.findOne({ email: { $eq: email } });
  if (!user) return res.send(`Couldn't find user with provided email.`);
  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) return res.send(`Password didn't match`);
  const SECRET = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
  res.cookie('secret', token, { maxAge: 3600000, httpOnly: true });
  delete user.password;
  res.json({ success: true, message: 'Login successful', data: user });
}
