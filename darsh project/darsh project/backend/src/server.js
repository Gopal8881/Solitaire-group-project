import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

const app = express();
const port = process.env.PORT ?? 5000;
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/support', supportRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => console.log(`🚀 API ready on http://localhost:${port}`));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();

