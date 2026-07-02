const TRUST_ITEMS = [
  {
    icon: (
      <svg
        className="w-4 h-4 text-emerald-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    text: '256-bit SSL encrypted connection',
  },
  {
    icon: (
      <svg
        className="w-4 h-4 text-emerald-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    text: 'We do not store your card details',
  },
  {
    icon: (
      <svg
        className="w-4 h-4 text-emerald-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    text: 'PCI-DSS aware processing (simulated)',
  },
];

export default function TrustBanner() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3 shadow-sm">
      <p className="text-xs font-extrabold text-emerald-600 uppercase tracking-wide mb-2.5">
        Secure donation
      </p>
      <ul className="space-y-2">
        {TRUST_ITEMS.map(({ icon, text }) => (
          <li key={text} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
            <span className="mt-0.5 flex-shrink-0">{icon}</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-xs text-gray-400 border-t border-emerald-100 pt-2.5 leading-snug">
        <strong className="text-gray-500">Demo only.</strong> No real payments
        are processed.
      </p>
    </div>
  );
}
