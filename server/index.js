import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import donationRoutes from './routes/donations.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// CORS — restrict to the known client origin
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);

// Limit body size to mitigate large-payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Routes
app.use('/api/donations', donationRoutes);

// Health check
app.get('/health', (_, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// 404 fallback
app.use((_, res) =>
  res.status(404).json({ success: false, message: 'Route not found' }),
);

// Centralized error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[MSF Donations API] Running on http://localhost:${PORT}`);
});
