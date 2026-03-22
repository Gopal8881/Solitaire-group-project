import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { createToken } from '../utils/token.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const sanitizeUser = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatarColor: user.avatarColor,
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = createToken(user);

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ message: 'Unable to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Unable to login' });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export default router;

