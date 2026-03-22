import { Router } from 'express';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const ensureBudget = async userId => {
  const existing = await Budget.findOne({ user: userId });
  if (existing) return existing;
  return Budget.create({
    user: userId,
    amount: 0,
    savingsGoal: 0,
    categories: [],
  });
};

router.use(authenticate);

router.get('/summary', async (req, res) => {
  try {
    const [transactions, budget] = await Promise.all([
      Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(10).lean(),
      ensureBudget(req.user._id),
    ]);

    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

    res.json({
      income,
      expenses,
      netSavings: income - expenses,
      recentTransactions: transactions,
      budget,
    });
  } catch (error) {
    console.error('Summary error', error);
    res.status(500).json({ message: 'Unable to fetch summary' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const items = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).lean();
    res.json(items);
  } catch (error) {
    console.error('List transactions error', error);
    res.status(500).json({ message: 'Unable to fetch transactions' });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error', error);
    res.status(500).json({ message: 'Unable to create transaction' });
  }
});

router.put('/transactions/:id', async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update transaction error', error);
    res.status(500).json({ message: 'Unable to update transaction' });
  }
});

router.delete('/transactions/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete transaction error', error);
    res.status(500).json({ message: 'Unable to delete transaction' });
  }
});

router.get('/budget', async (req, res) => {
  try {
    const budget = await ensureBudget(req.user._id);
    res.json(budget);
  } catch (error) {
    console.error('Get budget error', error);
    res.status(500).json({ message: 'Unable to fetch budget' });
  }
});

router.put('/budget', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (error) {
    console.error('Update budget error', error);
    res.status(500).json({ message: 'Unable to update budget' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const { category, type, from, to } = req.query;
    const filters = { user: req.user._id };

    if (category) filters.category = category;
    if (type) filters.type = type;
    if (from || to) {
      filters.date = {};
      if (from) filters.date.$gte = new Date(from);
      if (to) filters.date.$lte = new Date(to);
    }

    const transactions = await Transaction.find(filters).sort({ date: -1 }).lean();
    res.json(transactions);
  } catch (error) {
    console.error('Reports error', error);
    res.status(500).json({ message: 'Unable to load reports' });
  }
});

export default router;

