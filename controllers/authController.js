const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenFor = (user) => jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
const publicUser = (user) => ({ id: user._id, username: user.username, email: user.email });
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (typeof username !== 'string' || username.trim().length < 3) return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    if (typeof email !== 'string' || !validEmail(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: 'An account with that email already exists' });
    const user = await User.create({ username: username.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ success: true, token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.json({ success: true, token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
};
