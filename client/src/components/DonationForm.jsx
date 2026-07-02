import { useState } from 'react';
import SuccessMessage from './SuccessMessage.jsx';

// ── Validation helpers ──────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MPESA_RE = /^(07\d{8}|2547\d{8})$/;
const AMOUNT_PRESETS = [50, 100, 250];

function validateForm(form, anonymous) {
  const errors = {};

  if (!anonymous && (!form.name.trim() || form.name.trim().length < 2)) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const amt = parseFloat(form.amount);
  if (form.amount === '' || isNaN(amt) || amt < 10) {
    errors.amount = 'Minimum donation amount is KES 10.';
  }

  if (form.paymentMethod === 'mpesa') {
    if (!form.mpesaNumber || !MPESA_RE.test(form.mpesaNumber.trim())) {
      errors.mpesaNumber =
        'Enter a valid M-Pesa number: 07XXXXXXXX or 2547XXXXXXXX.';
    }
  }

  if (form.paymentMethod === 'card') {
    const rawCard = form.cardNumber.replace(/\s/g, '');
    if (!rawCard || !/^\d{13,19}$/.test(rawCard)) {
      errors.cardNumber = 'Enter a valid card number (13–19 digits).';
    }
    if (!form.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      errors.expiry = 'Enter expiry as MM/YY (e.g. 08/27).';
    }
    if (!form.cvv || !/^\d{3,4}$/.test(form.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits.';
    }
  }

  return errors;
}

// ── Component ───────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: '',
  email: '',
  amount: '',
  paymentMethod: 'mpesa',
  mpesaNumber: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

export default function DonationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [anonymous, setAnonymous] = useState(false);
  const [donationType, setDonationType] = useState('one-time');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [apiError, setApiError] = useState('');
  const [transaction, setTransaction] = useState(null);

  // ── Field change handlers ────────────────────────────────────────────────

  const clearFieldError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: '' }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Switching payment method clears all validation errors to avoid stale messages
    if (name === 'paymentMethod') {
      setErrors({});
    } else {
      clearFieldError(name);
    }
  };

  // Format card number as groups of 4 (1234 5678 9012 3456)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 19);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setForm((prev) => ({ ...prev, cardNumber: formatted }));
    clearFieldError('cardNumber');
  };

  // Auto-insert slash for expiry: "0827" → "08/27"
  const handleExpiryChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) digits = digits.slice(0, 2) + '/' + digits.slice(2);
    setForm((prev) => ({ ...prev, expiry: digits }));
    clearFieldError('expiry');
  };

  // Only allow digits in CVV
  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setForm((prev) => ({ ...prev, cvv: val }));
    clearFieldError('cvv');
  };

  const handleAmountPreset = (preset) => {
    setForm((prev) => ({ ...prev, amount: String(preset) }));
    clearFieldError('amount');
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form, anonymous);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Move focus to the first invalid field for keyboard / screen-reader users
      const firstField = Object.keys(validationErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setStatus('loading');
    setApiError('');

    const payload = {
      name: anonymous ? 'Anonymous' : form.name.trim(),
      email: form.email.trim(),
      amount: parseFloat(form.amount),
      paymentMethod: form.paymentMethod,
      donationType,
    };

    if (form.paymentMethod === 'mpesa') {
      payload.mpesaNumber = form.mpesaNumber.trim();
    } else {
      payload.cardDetails = {
        cardNumber: form.cardNumber.replace(/\s/g, ''),
        expiry: form.expiry,
        cvv: form.cvv,
      };
    }

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTransaction(data);
        setStatus('success');
      } else if (Array.isArray(data.errors)) {
        // Map server-side field errors back onto the form
        const serverErrors = {};
        data.errors.forEach(({ field, message }) => {
          serverErrors[field] = message;
        });
        setErrors(serverErrors);
        setStatus('idle');
      } else {
        setApiError(
          data.message || 'Payment could not be completed. Please try again.',
        );
        setStatus('error');
      }
    } catch {
      setApiError(
        'Network error — please check your connection and try again.',
      );
      setStatus('error');
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setAnonymous(false);
    setDonationType('one-time');
    setErrors({});
    setStatus('idle');
    setApiError('');
    setTransaction(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (status === 'success' && transaction) {
    return <SuccessMessage transaction={transaction} donationType={donationType} onDonateAgain={handleReset} />;
  }

  const isLoading = status === 'loading';

  const donateLabel =
    form.amount && !isNaN(parseFloat(form.amount))
      ? `${donationType === 'monthly' ? 'Give' : 'Donate'} KES ${parseFloat(form.amount).toLocaleString()}${
          donationType === 'monthly' ? '/mo' : ''
        }`
      : donationType === 'monthly' ? 'Give Monthly' : 'Donate';

  // Shared Tailwind class fragments
  const inputBase =
    'w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed';
  const inputNormal = `${inputBase} border-gray-300 focus:ring-red-500 focus:border-red-500`;
  const inputError = `${inputBase} border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400`;
  const inputGreen = `${inputBase} border-green-300 bg-white focus:ring-green-500 focus:border-green-500`;
  const inputBlue = `${inputBase} border-blue-300 bg-white focus:ring-blue-500 focus:border-blue-500`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border-2 border-rose-100 rounded-3xl shadow-md p-6 sm:p-8"
    >
      <h2 className="text-lg font-extrabold text-gray-900 mb-1">
        Donation Details
      </h2>
      <p className="text-gray-500 text-xs mb-4">
        Fields marked{' '}
        <span className="text-red-600 font-semibold" aria-hidden="true">
          *
        </span>{' '}
        are required.
      </p>

      <div
        className="flex rounded-2xl border-2 border-rose-100 overflow-hidden mb-5 text-sm font-semibold"
        role="group"
        aria-label="Donation frequency"
      >
        {[{ value: 'one-time', label: 'One-time' }, { value: 'monthly', label: 'Monthly' }].map(
          ({ value, label }) => (
            <button
              key={value}
              type="button"
              disabled={isLoading}
              onClick={() => setDonationType(value)}
              aria-pressed={donationType === value}
              className={`flex-1 py-2 transition-all ${
                donationType === value
                  ? 'bg-gradient-to-r from-red-600 to-rose-400 text-white shadow-inner'
                  : 'bg-white text-gray-500 hover:text-rose-600'
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>
      {donationType === 'monthly' && (
        <p className="-mt-2 mb-4 text-xs text-rose-500 font-medium">
          You will be charged every month. Cancel any time.
        </p>
      )}

      {/* ── Anonymous toggle ── */}
      <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => {
            setAnonymous(e.target.checked);
            if (e.target.checked) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          disabled={isLoading}
          className="w-4 h-4 rounded accent-rose-600 cursor-pointer"
        />
        <span className="text-sm text-gray-700 font-medium group-hover:text-rose-600 transition-colors">
          Donate anonymously
        </span>
        {anonymous && (
          <span className="text-xs text-gray-400 italic">Your name won’t be recorded</span>
        )}
      </label>

      {/* ── API / payment-failure banner ── */}
      {/* aria-live ensures screen readers announce changes to this region */}
      <div aria-live="polite" aria-atomic="true">
        {status === 'error' && apiError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700"
          >
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <strong>Payment failed:</strong> {apiError}
            </div>
          </div>
        )}
      </div>

      {/* ── Full Name ── */}
      {!anonymous && (
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name{' '}
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Jane Doe"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={errors.name ? inputError : inputNormal}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>
      )}

      {/* ── Email ── */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address{' '}
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="jane@example.com"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={errors.email ? inputError : inputNormal}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* ── Donation Amount ── */}
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Donation Amount KES{' '}
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        </label>

        <div
          className="flex flex-wrap gap-2 mb-2"
          role="group"
          aria-label="Quick amount selection"
        >
          {AMOUNT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={isLoading}
              onClick={() => handleAmountPreset(preset)}
              aria-pressed={form.amount === String(preset)}
              className={`px-4 py-1.5 rounded-full text-sm border-2 font-bold transition-all disabled:opacity-50 hover:scale-105 active:scale-95 ${
                form.amount === String(preset)
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white border-transparent shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              KES {preset}
            </button>
          ))}
        </div>

        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none text-sm"
            aria-hidden="true"
          >
            KES
          </span>
          <input
            id="amount"
            name="amount"
            type="number"
            min="10"
            step="any"
            value={form.amount}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="10"
            aria-required="true"
            aria-invalid={!!errors.amount}
            aria-describedby={
              errors.amount ? 'amount-error' : 'amount-hint'
            }
            className={`${errors.amount ? inputError : inputNormal} pl-14`}
          />
        </div>
        {!errors.amount && (
          <p id="amount-hint" className="mt-1 text-xs text-gray-500">
            Minimum KES 10
          </p>
        )}
        {errors.amount && (
          <p
            id="amount-error"
            role="alert"
            className="mt-1 text-xs text-red-600"
          >
            {errors.amount}
          </p>
        )}
      </div>

      {/* ── Payment Method ── */}
      <div className="mb-4">
        <p
          id="payment-method-label"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Payment Method{' '}
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        </p>
        <div
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-labelledby="payment-method-label"
        >
          {[
            { value: 'mpesa', label: 'M-Pesa'},
            { value: 'card', label: 'Card'},
          ].map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-2.5 border-2 rounded-xl p-3 cursor-pointer transition-all ${
                form.paymentMethod === value
                  ? 'border-rose-400 bg-rose-50 shadow-sm'
                  : 'border-gray-200 hover:border-rose-200 hover:bg-rose-50/40'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={form.paymentMethod === value}
                onChange={handleChange}
                disabled={isLoading}
                className="accent-red-600"
              />
              <span className="text-sm font-medium text-gray-800">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── M-Pesa Fields ── */}
      {form.paymentMethod === 'mpesa' && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <label
            htmlFor="mpesaNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            M-Pesa Phone Number{' '}
            <span className="text-red-600" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="mpesaNumber"
            name="mpesaNumber"
            type="tel"
            autoComplete="tel"
            value={form.mpesaNumber}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="07XXXXXXXX or 2547XXXXXXXX"
            aria-required="true"
            aria-invalid={!!errors.mpesaNumber}
            aria-describedby={
              errors.mpesaNumber ? 'mpesaNumber-error' : 'mpesaNumber-hint'
            }
            className={errors.mpesaNumber ? inputError : inputGreen}
          />
          {!errors.mpesaNumber && (
            <p id="mpesaNumber-hint" className="mt-1 text-xs text-gray-500">
              Safaricom Kenya format: 07XXXXXXXX or 2547XXXXXXXX
            </p>
          )}
          {errors.mpesaNumber && (
            <p
              id="mpesaNumber-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.mpesaNumber}
            </p>
          )}
        </div>
      )}

      {/* ── Card Fields ── */}
      {form.paymentMethod === 'card' && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          {/* Card Number */}
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Number{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={form.cardNumber}
              onChange={handleCardNumberChange}
              disabled={isLoading}
              placeholder="1234 5678 9012 3456"
              maxLength={23}
              aria-required="true"
              aria-invalid={!!errors.cardNumber}
              aria-describedby={
                errors.cardNumber ? 'cardNumber-error' : undefined
              }
              className={`${
                errors.cardNumber ? inputError : inputBlue
              } font-mono tracking-wider`}
            />
            {errors.cardNumber && (
              <p
                id="cardNumber-error"
                role="alert"
                className="mt-1 text-xs text-red-600"
              >
                {errors.cardNumber}
              </p>
            )}
          </div>

          {/* Expiry + CVV row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry{' '}
                <span className="text-red-600" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={form.expiry}
                onChange={handleExpiryChange}
                disabled={isLoading}
                placeholder="MM/YY"
                maxLength={5}
                aria-required="true"
                aria-invalid={!!errors.expiry}
                aria-describedby={errors.expiry ? 'expiry-error' : undefined}
                className={errors.expiry ? inputError : inputBlue}
              />
              {errors.expiry && (
                <p
                  id="expiry-error"
                  role="alert"
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.expiry}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CVV{' '}
                <span className="text-red-600" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="cvv"
                name="cvv"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={form.cvv}
                onChange={handleCvvChange}
                disabled={isLoading}
                placeholder="123"
                maxLength={4}
                aria-required="true"
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                className={errors.cvv ? inputError : inputBlue}
              />
              {errors.cvv && (
                <p
                  id="cvv-error"
                  role="alert"
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:from-red-800 active:to-rose-800 disabled:from-red-300 disabled:to-rose-300 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Processing…
          </>
        ) : (
          <>{donateLabel}</>
        )}
      </button>
    </form>
  );
}
