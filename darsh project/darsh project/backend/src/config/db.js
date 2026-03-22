import mongoose from 'mongoose';

const defaultUri = 'mongodb+srv://expense_manager:Arash..aa@cluster0.wqrn8jp.mongodb.net/expense-manager?retryWrites=true&w=majority';

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI ?? defaultUri;

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB ?? 'expense-manager',
  });

  console.log('✅ Connected to MongoDB');
};

