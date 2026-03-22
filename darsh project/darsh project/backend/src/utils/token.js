import jwt from 'jsonwebtoken';

const TOKEN_TTL = '7d';
const defaultSecret = 'expense-manager-secret';

export const createToken = user =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET ?? defaultSecret,
    { expiresIn: TOKEN_TTL }
  );

