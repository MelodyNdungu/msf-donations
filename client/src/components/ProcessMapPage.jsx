import { Link } from 'react-router-dom';

// ── Data ─────────────────────────────────────────────────────────────────────

const PHASES = [
  { id: 0, label: 'Visit' },
  { id: 1, label: 'Configure' },
  { id: 2, label: 'Fill' },
  { id: 3, label: 'Submit' },
  { id: 4, label: 'Process' },
  { id: 5, label: 'Result' },
];

const LANES = [
  {
    id: 'donor', label: 'Donor',
    laneHeader: 'bg-rose-600 text-white',
    laneBg: 'bg-rose-50 border-rose-200',
    boxBorder: 'border-rose-300', boxText: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700 border-rose-300', dot: 'bg-rose-600',
  },
  {
    id: 'frontend', label: 'Browser / React',
    laneHeader: 'bg-sky-600 text-white',
    laneBg: 'bg-sky-50 border-sky-200',
    boxBorder: 'border-sky-300', boxText: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700 border-sky-300', dot: 'bg-sky-600',
  },
  {
    id: 'api', label: 'API Server',
    laneHeader: 'bg-amber-600 text-white',
    laneBg: 'bg-amber-50 border-amber-200',
    boxBorder: 'border-amber-300', boxText: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-600',
  },
  {
    id: 'payment', label: 'Payment Sim',
    laneHeader: 'bg-emerald-600 text-white',
    laneBg: 'bg-emerald-50 border-emerald-200',
    boxBorder: 'border-emerald-300', boxText: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-600',
  },
];

// type: 'oval' = start/end   'rect' = process   'diamond' = decision
const STEPS = {
  'donor-0':    { label: 'Open Portal', type: 'oval' },
  'donor-2':    { label: 'Fill Form', sub: 'Name · email\namount · method', type: 'rect' },
  'donor-3':    { label: 'Click Submit', type: 'rect' },
  'donor-5':    { label: 'View Result', sub: 'Confirmation\nor error', type: 'oval' },
  'frontend-1': { label: 'Render Form', sub: 'Frequency toggle\nAnon. checkbox\nAmount presets', type: 'rect' },
  'frontend-3': { label: 'Client Validate', sub: 'Name · email\namount · phone/card', type: 'diamond' },
  'frontend-4': { label: 'POST /api/donations', sub: 'Show loading spinner', type: 'rect' },
  'frontend-5': { label: 'Show UI', sub: '201 → SuccessMessage\n400 → Field errors\n402 → Error banner', type: 'rect' },
  'api-4':      { label: 'Zod Validate', sub: 'Schema check', type: 'diamond' },
  'api-5':      { label: 'Return Response', sub: '201 · 400 · 402', type: 'rect' },
  'payment-4':  { label: 'simulatePayment()', sub: '85% success · 15% fail\n1–2 s delay', type: 'diamond' },
};

const HAPPY_PATH = [
  ['Donor', 'donor', 'Opens the portal and sees the donation form.'],
  ['Frontend', 'frontend', 'Renders the form: frequency toggle (one-time / monthly), anonymous checkbox, KES amount presets.'],
  ['Donor', 'donor', 'Selects frequency, optionally enables "Donate anonymously", picks an amount (preset or custom), chooses M-Pesa or Card.'],
  ['Donor', 'donor', 'Clicks "Donate / Give KES {amount}" to submit the form.'],
  ['Frontend', 'frontend', 'Runs client-side validation. Any invalid field shows an inline error and halts submission.'],
  ['Frontend', 'frontend', 'Sends POST /api/donations with { name, email, amount, paymentMethod, donationType, mpesaNumber | cardDetails }.'],
  ['API Server', 'api', 'Zod validates the request body. Returns 400 with per-field error objects if invalid.'],
  ['Payment Sim', 'payment', 'simulatePayment() waits 1–2 s, resolves 85% of the time, rejects with a reason string 15% of the time.'],
  ['API Server', 'api', 'On payment success: generates MSF-{timestamp}-{8hex} transaction ID, stores record in memory, returns 201.'],
  ['Frontend', 'frontend', 'Receives 201 and renders SuccessMessage: transaction ID, KES amount, method, frequency, status, timestamp.'],
  ['Donor', 'donor', 'Reviews confirmation. Clicks "Make Another Donation" to fully reset the form.'],
];

const EXCEPTION_PATHS = [
  {
    code: '400',
    title: 'Validation Error',
    wrapClass: 'border-amber-200 bg-amber-50',
    badgeClass: 'bg-amber-200 text-amber-800',
    desc: 'Client validation fires first. If it passes, Zod validates server-side. Field errors are mapped back to each input with inline red messages.',
  },
  {
    code: '402',
    title: 'Payment Failure',
    wrapClass: 'border-red-200 bg-red-50',
    badgeClass: 'bg-red-200 text-red-800',
    desc: '15% simulated failure rate. Reasons: insufficient funds, bank decline, network timeout, card verification failure, or daily limit. Error banner shown above the form.',
  },
  {
    code: 'Net',
    title: 'Network Error',
    wrapClass: 'border-gray-200 bg-gray-50',
    badgeClass: 'bg-gray-200 text-gray-700',
    desc: 'fetch() rejects (offline / server unreachable). A generic error banner is shown. No server state is created.',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StepBox({ step, lane }) {
  const content = (
    <>
      <p className={`text-xs font-bold ${lane.boxText} leading-tight`}>{step.label}</p>
      {step.sub && (
        <p className="text-xs text-gray-400 mt-0.5 whitespace-pre-line leading-snug">{step.sub}</p>
      )}
    </>
  );

  if (step.type === 'oval') {
    return (
      <div className={`w-full px-2 py-2 text-center border-2 rounded-full ${lane.boxBorder} bg-white`}>
        {content}
      </div>
    );
  }
  if (step.type === 'diamond') {
    return (
      <div className={`w-full px-2 py-2 text-center border-2 border-dashed rounded-lg ${lane.boxBorder} bg-white`}>
        {content}
        <span className={`mt-1 text-xs inline-block px-1.5 py-0.5 rounded-full border ${lane.boxBorder} ${lane.boxText} font-semibold`}>
          ◇ decision
        </span>
      </div>
    );
  }
  return (
    <div className={`w-full px-3 py-2 text-center border-2 rounded-full ${lane.boxBorder} bg-white`}>
      {content}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProcessMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-3">
          <div
            className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
            aria-hidden="true"
          >
            <span className="text-red-600 font-black text-xl leading-none select-none">✛</span>
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-wide leading-tight">MSF Eastern Africa</p>
            <p className="text-rose-200 text-xs">Médecins Sans Frontières — Business Process Map</p>
          </div>
          <Link
            to="/"
            className="ml-auto text-xs text-rose-200 hover:text-white transition-colors font-semibold"
          >
            ← Back to portal
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Business Process Map</h1>
          <p className="text-gray-500 mt-1 text-sm">
            End-to-end donation flow — swimlane diagram across four actors
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-5">
          {LANES.map((l) => (
            <div
              key={l.id}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${l.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${l.dot}`} />
              {l.label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-500">
            ◇ Decision &nbsp;·&nbsp; ○ Start / End
          </div>
        </div>

        {/* ── Swimlane diagram ── */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white mb-8">
          <div className="min-w-[860px] p-4">
            {/* Phase headers */}
            <div
              className="grid mb-2"
              style={{ gridTemplateColumns: '110px repeat(6, 1fr)', gap: '6px' }}
            >
              <div />
              {PHASES.map((p) => (
                <div
                  key={p.id}
                  className="text-center text-xs font-extrabold text-gray-400 uppercase tracking-widest py-1 border-b-2 border-gray-200"
                >
                  {p.label}
                </div>
              ))}
            </div>

            {/* Lane rows */}
            <div className="space-y-2">
              {LANES.map((lane) => (
                <div
                  key={lane.id}
                  className={`rounded-xl border overflow-hidden ${lane.laneBg}`}
                >
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: '110px repeat(6, 1fr)', gap: '6px' }}
                  >
                    {/* Lane label */}
                    <div
                      className={`${lane.laneHeader} text-xs font-bold flex items-center justify-center text-center p-3 leading-tight`}
                    >
                      {lane.label}
                    </div>

                    {/* Phase cells */}
                    {PHASES.map((phase) => {
                      const step = STEPS[`${lane.id}-${phase.id}`];
                      return (
                        <div
                          key={phase.id}
                          className="flex items-center justify-center p-1.5 min-h-[92px]"
                        >
                          {step ? (
                            <StepBox step={step} lane={lane} />
                          ) : (
                            <div className="w-full border-t border-dashed border-gray-200" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Exception paths ── */}
        <section className="mb-8">
          <h2 className="text-lg font-extrabold text-gray-800 mb-3">Exception Paths</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {EXCEPTION_PATHS.map((e) => (
              <div key={e.code} className={`rounded-full border-2 px-5 py-4 ${e.wrapClass}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${e.badgeClass}`}>
                    {e.code}
                  </span>
                  <span className="text-sm font-bold text-gray-800">{e.title}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Happy path numbered flow ── */}
        <section>
          <h2 className="text-lg font-extrabold text-gray-800 mb-3">Happy Path — Numbered Flow</h2>
          <ol className="space-y-2.5">
            {HAPPY_PATH.map(([laneLabel, laneId, text], i) => {
              const lane = LANES.find((l) => l.id === laneId);
              return (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${lane.dot}`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex items-start gap-2 flex-wrap">
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${lane.badge}`}
                    >
                      {laneLabel}
                    </span>
                    <span className="text-sm text-gray-700">{text}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </main>

      <footer className="border-t border-rose-100 py-6 px-4 text-center text-gray-400 text-xs bg-white/40">
        <p>
          &copy; {new Date().getFullYear()} Médecins Sans Frontières.{' '}
          <span className="text-gray-500">
            This portal is a demonstration — no real payments are processed.
          </span>
        </p>
        <p className="mt-2 space-x-3">
          <Link to="/" className="text-rose-400 hover:text-rose-600 font-semibold transition-colors">Portal</Link>
          <span className="text-gray-300">·</span>
          <Link to="/docs" className="text-rose-400 hover:text-rose-600 font-semibold transition-colors">API Docs</Link>
          <span className="text-gray-300">·</span>
          <Link to="/wireframe" className="text-rose-400 hover:text-rose-600 font-semibold transition-colors">Wireframe</Link>
        </p>
      </footer>
    </div>
  );
}
