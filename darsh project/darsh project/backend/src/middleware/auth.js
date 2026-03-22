import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const defaultSecret = 'expense-manager-secret';

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? defaultSecret);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

