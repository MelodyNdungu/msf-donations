import { Link } from 'react-router-dom';

/* ── Primitives ─────────────────────────────────────────────────────────── */

function Box({ label, sublabel, h, className = '', dark = false, dashed = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-2 rounded
        ${dark ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-500'}
        ${dashed ? 'border-2 border-dashed border-gray-300 bg-white' : ''}
        ${className}`}
      style={h ? { height: h } : undefined}
    >
      {label && <span className="text-xs font-bold uppercase tracking-wide leading-tight">{label}</span>}
      {sublabel && <span className="text-xs opacity-70 mt-0.5 leading-tight">{sublabel}</span>}
    </div>
  );
}

function Lines({ count = 3, last = '60%' }) {
  return (
    <div className="space-y-1.5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-2 bg-gray-200 rounded"
          style={{ width: i === count - 1 ? last : '100%' }}
        />
      ))}
    </div>
  );
}

function InputBox({ label, required }) {
  return (
    <div className="mb-3">
      <div className="flex gap-1 items-center mb-1">
        <div className="h-2 bg-gray-300 rounded w-20" />
        {required && <div className="h-2 w-2 bg-red-300 rounded-full" />}
      </div>
      <div className="h-8 border-2 border-dashed border-gray-300 rounded-lg w-full bg-white flex items-center px-2">
        <div className="h-2 w-24 bg-gray-200 rounded" />
      </div>
      {label && <p className="text-xs text-gray-400 mt-0.5 ml-0.5">{label}</p>}
    </div>
  );
}

function Label({ children, className = '' }) {
  return (
    <p className={`text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${className}`}>
      {children}
    </p>
  );
}

function WireFrame({ title, children }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 relative">
      <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </span>
      {children}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function WireframePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ── Top nav ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-sm text-gray-400 font-mono">wireframe / msf-donations</span>
        </div>
        <div className="flex gap-3 text-xs">
          <Link to="/" className="text-rose-500 hover:text-rose-700 font-semibold transition-colors">
            ← Live portal
          </Link>
          <Link to="/docs" className="text-gray-400 hover:text-gray-600 transition-colors">
            API docs
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-10">

        <div>
          <h1 className="text-xl font-extrabold text-gray-700 mb-1">MSF Donations Portal — Wireframe</h1>
          <p className="text-xs text-gray-400">Annotated layout of all screens and components</p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SCREEN 1 — Donation form
        ══════════════════════════════════════════════════════════════ */}
        <section>
          <Label>Screen 1 — Donation form (desktop)</Label>

          <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-white">

            {/* Header */}
            <Box dark label="HEADER" sublabel="MSF cross logo · MSF Eastern Africa · tagline" h={56} className="rounded-none w-full" />

            {/* Body */}
            <div className="grid grid-cols-[1fr_240px] gap-6 p-6">

              {/* Left column */}
              <div>
                {/* Page heading */}
                <div className="mb-5">
                  <div className="h-7 bg-gray-300 rounded w-56 mb-2" />
                  <Lines count={2} last="80%" />
                </div>

                {/* Donation form card */}
                <WireFrame title="DonationForm">

                  {/* Form heading */}
                  <div className="h-5 bg-gray-200 rounded w-40 mb-1" />
                  <div className="h-2 bg-gray-100 rounded w-56 mb-4" />

                  {/* Donation type toggle */}
                  <div className="mb-4">
                    <Label>Donation frequency toggle</Label>
                    <div className="flex rounded-xl border-2 border-dashed border-gray-300 overflow-hidden h-9">
                      <div className="flex-1 bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">ONE-TIME</span>
                      </div>
                      <div className="flex-1 bg-white flex items-center justify-center">
                        <span className="text-xs text-gray-400">MONTHLY</span>
                      </div>
                    </div>
                  </div>

                  {/* Anonymous checkbox */}
                  <div className="flex items-center gap-2 mb-4 border border-dashed border-gray-200 rounded-lg p-2.5">
                    <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded flex-shrink-0" />
                    <div className="h-2.5 bg-gray-200 rounded w-32" />
                    <div className="h-2 bg-gray-100 rounded w-24 ml-1" />
                  </div>

                  {/* Name */}
                  <InputBox label="Shown only when not anonymous" required />

                  {/* Email */}
                  <InputBox label="Required" required />

                  {/* Amount */}
                  <div className="mb-3">
                    <div className="flex gap-1 items-center mb-1">
                      <div className="h-2 bg-gray-300 rounded w-28" />
                      <div className="h-2 w-2 bg-red-300 rounded-full" />
                    </div>
                    {/* Presets */}
                    <div className="flex gap-2 mb-2">
                      {['KES 50', 'KES 100', 'KES 250'].map((p) => (
                        <div key={p} className="h-7 border-2 border-dashed border-gray-300 rounded-full px-3 flex items-center">
                          <span className="text-xs text-gray-400">{p}</span>
                        </div>
                      ))}
                    </div>
                    {/* Free-input */}
                    <div className="h-8 border-2 border-dashed border-gray-300 rounded-lg w-full bg-white flex items-center px-2 gap-2">
                      <span className="text-xs font-bold text-gray-300">KES</span>
                      <div className="h-2 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="mb-3">
                    <div className="h-2 bg-gray-300 rounded w-28 mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      {['M-Pesa', 'Card'].map((m) => (
                        <div key={m} className="h-10 border-2 border-dashed border-gray-300 rounded-xl flex items-center gap-2 px-3">
                          <div className="w-3 h-3 rounded-full border-2 border-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-400">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* M-Pesa conditional field */}
                  <div className="mb-4 bg-green-50 border border-dashed border-green-300 rounded-lg p-3">
                    <Label className="text-green-400">M-Pesa section (conditional)</Label>
                    <InputBox label="07XXXXXXXX or 2547XXXXXXXX" required />
                  </div>

                  {/* Card conditional fields (collapsed indicator) */}
                  <div className="mb-4 bg-blue-50 border border-dashed border-blue-300 rounded-lg p-3">
                    <Label className="text-blue-400">Card section (conditional)</Label>
                    <InputBox label="Card number (mono, 4-group formatted)" required />
                    <div className="grid grid-cols-2 gap-2">
                      <InputBox label="MM/YY" required />
                      <InputBox label="3–4 digits" required />
                    </div>
                  </div>

                  {/* Submit button */}
                  <Box dark label="DONATE / GIVE KES {amount}" sublabel="Gradient button · full width" h={44} className="rounded-2xl w-full" />

                </WireFrame>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">

                {/* Campaign image */}
                <WireFrame title="Campaign image (sticky)">
                  <div className="bg-gray-200 rounded-xl flex flex-col items-center justify-end overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    {/* Image placeholder grid */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      <svg viewBox="0 0 100 133" className="w-full h-full opacity-20">
                        <line x1="0" y1="0" x2="100" y2="133" stroke="#888" strokeWidth="1"/>
                        <line x1="100" y1="0" x2="0" y2="133" stroke="#888" strokeWidth="1"/>
                      </svg>
                      {/* Overlay bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-700/70 px-3 py-2 rounded-b-xl">
                        <div className="h-3 bg-white/60 rounded w-36 mb-1" />
                        <div className="h-2 bg-white/30 rounded w-28" />
                      </div>
                    </div>
                  </div>
                </WireFrame>

                {/* Trust banner */}
                <WireFrame title="TrustBanner">
                  <div className="space-y-2">
                    <div className="h-2.5 bg-emerald-200 rounded w-28 mb-3" />
                    {['SSL encrypted', 'No card storage', 'PCI-DSS aware'].map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-200 rounded flex-shrink-0" />
                        <div className="h-2 bg-gray-200 rounded flex-1" />
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-1">
                      <Lines count={2} last="70%" />
                    </div>
                  </div>
                </WireFrame>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 py-3 flex flex-col items-center gap-1">
              <Lines count={1} last="240px" />
              <div className="h-2 w-24 bg-rose-200 rounded" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SCREEN 2 — Success message
        ══════════════════════════════════════════════════════════════ */}
        <section>
          <Label>Screen 2 — Success state (replaces form)</Label>

          <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-white max-w-lg">
            <Box dark label="HEADER" h={56} className="rounded-none w-full" />

            <div className="p-6">
              <WireFrame title="SuccessMessage">
                <div className="flex flex-col items-center text-center py-2">
                  {/* Check icon */}
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div className="h-5 bg-gray-300 rounded w-48 mb-2" />
                  <Lines count={2} last="70%" />

                  {/* Transaction details card */}
                  <div className="w-full mt-4 bg-green-50 border border-dashed border-green-300 rounded-lg p-3 text-left space-y-2">
                    <div className="h-2.5 bg-green-200 rounded w-36 mb-2" />
                    {['Reference', 'Amount', 'Method', 'Frequency', 'Status', 'Date & Time'].map((r) => (
                      <div key={r} className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">{r}</span>
                        <div className="h-2 bg-gray-200 rounded w-24" />
                      </div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <Box dark label="MAKE ANOTHER DONATION" h={36} className="rounded-xl w-full mt-4" />
                </div>
              </WireFrame>
            </div>

            <div className="border-t border-gray-200 py-3 flex flex-col items-center gap-1">
              <Lines count={1} last="240px" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SCREEN 3 — API Docs page
        ══════════════════════════════════════════════════════════════ */}
        <section>
          <Label>Screen 3 — API documentation page</Label>

          <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-white">
            <Box dark label="HEADER + ← BACK TO PORTAL link" h={56} className="rounded-none w-full" />

            <div className="p-6 max-w-3xl">
              <div className="h-7 bg-gray-300 rounded w-52 mb-2" />
              <div className="h-2 bg-gray-100 rounded w-48 mb-6" />

              {['POST /api/donations', 'GET /api/donations/:id', 'GET /health'].map((endpoint) => (
                <div key={endpoint} className="mb-6">
                  <div className="h-4 bg-gray-300 rounded w-56 mb-3 border-b border-gray-200 pb-4" />
                  {/* Table placeholder */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
                    <div className="bg-gray-100 h-7 flex items-center gap-4 px-3">
                      {['Field', 'Type', 'Required', 'Description'].map((h) => (
                        <div key={h} className="h-2 bg-gray-300 rounded w-14" />
                      ))}
                    </div>
                    {[1, 2, 3].map((r) => (
                      <div key={r} className="h-7 border-t border-gray-100 flex items-center gap-4 px-3">
                        {[16, 12, 10, 40].map((w, i) => (
                          <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: `${w * 4}px` }} />
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* Code block placeholder */}
                  <div className="bg-gray-800 rounded-xl p-3">
                    <Lines count={4} last="50%" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 py-3 flex justify-center">
              <Lines count={1} last="200px" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE layout note
        ══════════════════════════════════════════════════════════════ */}
        <section>
          <Label>Mobile layout (stacked)</Label>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm bg-white">
              <Box dark label="HEADER" h={48} className="rounded-none w-full" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-36" />
                <Lines count={2} last="85%" />
                <Box label="DONATION FORM" sublabel="(same fields, full width)" h={320} dashed />
              </div>
              <Box label="CAMPAIGN IMAGE" sublabel="3:4 ratio, full width" h={80} className="w-full mx-4" dashed />
              <Box label="TRUST BANNER" h={60} className="w-full mx-4 mb-4" dashed />
              <div className="border-t border-gray-200 py-2 flex justify-center">
                <Lines count={1} last="160px" />
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-3 pt-4">
              <p className="font-bold text-gray-600">Breakpoint notes</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Desktop (lg+):</strong> 2-column grid, right sidebar sticky</li>
                <li><strong>Mobile:</strong> Single column — form → image → trust banner</li>
                <li><strong>Trust banner:</strong> Compact vertical list on desktop, same on mobile</li>
                <li><strong>Image:</strong> 3:4 aspect ratio preserved at all widths</li>
                <li><strong>Form card:</strong> Rounded-3xl, rose border</li>
              </ul>
            </div>
          </div>
        </section>

      </div>

      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 bg-white">
        MSF Donations Portal — Wireframe &nbsp;·&nbsp;
        <Link to="/" className="text-rose-400 hover:text-rose-600 font-semibold">Live portal</Link>
        &nbsp;·&nbsp;
        <Link to="/docs" className="text-rose-400 hover:text-rose-600 font-semibold">API docs</Link>
      </footer>
    </div>
  );
}
