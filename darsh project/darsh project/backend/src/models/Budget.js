import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    amount: { type: Number, default: 0 },
    savingsGoal: { type: Number, default: 0 },
    categories: [
      {
        name: String,
        allocated: Number,
        spent: { type: Number, default: 0 },
        color: { type: String, default: '#4f8cff' },
      },
    ],
  },
  { timestamps: true }
);

export const Budget = mongoose.model('Budget', budgetSchema);

