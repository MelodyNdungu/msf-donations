import { randomUUID } from 'crypto';
import { donationSchema } from '../validators/donationValidator.js';

// In-memory store: transactionId → donation record
const donations = new Map();

const FAILURE_REASONS = [
  'Insufficient funds',
  'Transaction declined by issuing bank',
  'Network timeout with payment provider',
  'Card verification failed',
  'Daily transaction limit reached',
];

/**
 * Simulate a payment gateway call.
 * - Random delay 1–2 seconds to mimic a real round-trip.
 * - 85% success / 15% failure to exercise both UI states.
 */
function simulatePayment() {
  const delayMs = 1000 + Math.random() * 1000;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.85) {
        resolve();
      } else {
        const reason =
          FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
        reject(new Error(reason));
      }
    }, delayMs);
  });
}

/**
 * POST /api/donations
 * Validate, simulate payment, store summary (never card data), return result.
 */
export async function createDonation(req, res, next) {
  try {
    const parsed = donationSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ success: false, errors });
    }

    const { name, email, amount, paymentMethod, mpesaNumber } = parsed.data;
    // cardDetails intentionally excluded from storage — never persist sensitive card data

    try {
      await simulatePayment();
    } catch (paymentError) {
      return res.status(402).json({
        success: false,
        message: 'Payment could not be processed',
        reason: paymentError.message,
      });
    }

    const transactionId = `MSF-${Date.now()}-${randomUUID()
      .replace(/-/g, '')
      .slice(0, 8)
      .toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const record = {
      transactionId,
      name,
      email,
      amount,
      paymentMethod,
      // Only keep phone reference for M-Pesa; no card data ever stored
      ...(paymentMethod === 'mpesa' && { mpesaNumber }),
      status: 'confirmed',
      timestamp,
    };

    donations.set(transactionId, record);

    return res.status(201).json({
      success: true,
      transactionId,
      amount,
      paymentMethod,
      timestamp,
      status: 'confirmed',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/donations/:id
 * Status check by transaction ID.
 * Returns a safe subset — no PII (email) exposed.
 */
export function getDonation(req, res) {
  const { id } = req.params;

  // Basic ID format guard
  if (!id || typeof id !== 'string' || id.length > 60) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid transaction ID format' });
  }

  const record = donations.get(id);
  if (!record) {
    return res
      .status(404)
      .json({ success: false, message: 'Donation not found' });
  }

  const { transactionId, amount, paymentMethod, status, timestamp } = record;
  return res.json({
    success: true,
    donation: { transactionId, amount, paymentMethod, status, timestamp },
  });
}
