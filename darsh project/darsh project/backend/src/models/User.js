import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatarColor: { type: String, default: '#277fef' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

