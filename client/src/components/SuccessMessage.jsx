export default function SuccessMessage({ transaction, donationType, onDonateAgain }) {
  const paymentLabel =
    transaction.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card';
  const frequencyLabel = donationType === 'monthly' ? 'Monthly' : 'One-time';

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm text-center"
      role="status"
      aria-live="polite"
    >
      {/* Animated checkmark */}
      <div
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        aria-hidden="true"
      >
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Thank you for your donation!
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Your generosity helps MSF teams deliver life-saving medical care where
        it is needed most.
      </p>

      {/* Transaction details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left w-full max-w-sm mx-auto mb-6">
        <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
          Transaction Confirmation
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 flex-shrink-0">Reference</dt>
            <dd className="font-mono font-semibold text-green-700 text-right break-all">
              {transaction.transactionId}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 flex-shrink-0">Amount</dt>
            <dd className="font-semibold">
              KES {Number(transaction.amount).toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 flex-shrink-0">Method</dt>
            <dd>{paymentLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 flex-shrink-0">Frequency</dt>
            <dd className="font-semibold">{frequencyLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 flex-shrink-0">Status</dt>
            <dd className="text-green-600 font-semibold capitalize">
              {transaction.status}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 flex-shrink-0">Date &amp; Time</dt>
            <dd className="text-right">
              {new Date(transaction.timestamp).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      <button
        onClick={onDonateAgain}
        className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors text-sm"
      >
        Make Another Donation
      </button>
    </div>
  );
}
