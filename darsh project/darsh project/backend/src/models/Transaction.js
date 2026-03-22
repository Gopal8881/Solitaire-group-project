import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);

