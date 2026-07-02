import DonationForm from './components/DonationForm.jsx';
import TrustBanner from './components/TrustBanner.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          {/* MSF cross */}
          <div
            className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
            aria-hidden="true"
          >
            <span className="text-red-600 font-black text-xl leading-none select-none">
              ✛
            </span>
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-wide leading-tight">
              MSF Eastern Africa
            </p>
            <p className="text-rose-200 text-xs">
              Médecins Sans Frontières — Donations Portal
            </p>
          </div>

        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">
          {/* ── Left column: heading + form ── */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Make a difference
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Your donation enables MSF teams to deliver emergency medical care
                across Eastern Africa. Every contribution matters.
              </p>
            </div>
            <DonationForm />
          </div>

          {/* ── Right column: campaign image + trust banner ── */}
          <aside className="mt-8 lg:mt-6 lg:sticky lg:top-6 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img
                src="/msf-campaign.webp"
                alt="Multiple hands supporting a surgeon's hand holding a scalpel — It takes many to save one."
                className="w-full object-cover object-top"
                style={{ aspectRatio: '3/4' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex flex-col justify-end px-4 pb-4">
                <p className="text-white font-extrabold text-lg leading-snug drop-shadow">
                  It takes many to save one.
                </p>
                <p className="text-white/75 text-xs mt-1 drop-shadow">
                  Help us provide life-saving medical humanitarian relief.
                </p>
              </div>
            </div>
            <TrustBanner />
          </aside>
        </div>
      </main>

      <footer className="border-t border-rose-100 py-6 px-4 text-center text-gray-400 text-xs bg-white/40">
        <p>
          &copy; {new Date().getFullYear()} Médecins Sans Frontières.{' '}
          <span className="text-gray-500">
            This portal is a demonstration — no real payments are processed.
          </span>
        </p>
      </footer>
    </div>
  );
}
