import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);

