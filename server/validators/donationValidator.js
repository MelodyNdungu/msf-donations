import { z } from 'zod';

const cardDetailsSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .regex(/^\d{13,19}$/, 'Card number must be 13–19 digits (no spaces)'),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format'),
  cvv: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export const donationSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be under 100 characters'),

    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Must be a valid email address')
      .max(254, 'Email address is too long'),

    // Accept string amounts from form-encoded bodies; coerce to number
    amount: z.preprocess(
      (val) => (typeof val === 'string' ? parseFloat(val) : val),
      z
        .number({ invalid_type_error: 'Amount must be a number' })
        .positive('Amount must be positive')
        .min(10, 'Minimum donation is KES 10')
        .max(1_000_000, 'Donation amount exceeds the allowed limit'),
    ),

    paymentMethod: z.enum(['mpesa', 'card'], {
      errorMap: () => ({ message: "Payment method must be 'mpesa' or 'card'" }),
    }),

    mpesaNumber: z
      .string()
      .trim()
      .regex(
        /^(07\d{8}|2547\d{8})$/,
        'M-Pesa number must be in format 07XXXXXXXX or 2547XXXXXXXX',
      )
      .optional(),

    cardDetails: cardDetailsSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === 'mpesa' && !data.mpesaNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'M-Pesa phone number is required when using M-Pesa',
        path: ['mpesaNumber'],
      });
    }
    if (data.paymentMethod === 'card' && !data.cardDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card details are required when paying by card',
        path: ['cardDetails'],
      });
    }
  });
