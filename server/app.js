import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import donationRoutes from './routes/donations.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use('/api/donations', donationRoutes);

app.get('/health', (_, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

app.use((_, res) =>
  res.status(404).json({ success: false, message: 'Route not found' }),
);

app.use(errorHandler);

export default app;
