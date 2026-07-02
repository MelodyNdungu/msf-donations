import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 font-semibold">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/60">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 align-top">
                  {typeof cell === 'string' && cell.startsWith('`') ? (
                    <code className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-xs">
                      {cell.replace(/`/g, '')}
                    </code>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ lang, children }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed mb-4 font-mono">
      <code>{children.trim()}</code>
    </pre>
  );
}

function Badge({ color, children }) {
  const colors = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-3">
          <div
            className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
            aria-hidden="true"
          >
            <span className="text-red-600 font-black text-xl leading-none select-none">✛</span>
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-wide leading-tight">MSF Eastern Africa</p>
            <p className="text-rose-200 text-xs">Médecins Sans Frontières — API Documentation</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        <div className="mb-8">
                      <Link
            to="/"
            className="ml-auto text-xs text-black hover:text-gray-700 font-semibold"
          >
            ← Back to portal
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">API Documentation</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Base URL (development):{' '}
            <code className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-xs">
              http://localhost:3001
            </code>
          </p>
        </div>

        {/* POST /api/donations */}
        <Section title="POST /api/donations">
          <p className="text-gray-600 text-sm mb-4">
            Submit a donation and process payment (simulated).
          </p>

          <h3 className="text-sm font-bold text-gray-700 mb-2">Request Body Schema</h3>
          <Table
            headers={['Field', 'Type', 'Required', 'Description']}
            rows={[
              ['`name`', '`string`', 'Yes', "Donor's full name. Min 2, max 100 characters."],
              ['`email`', '`string`', 'Yes', 'Valid email address. Max 254 characters.'],
              ['`amount`', '`number`', 'Yes', 'Donation amount in KES. Min 10, max 1,000,000.'],
              ['`paymentMethod`', '`"mpesa" | "card"`', 'Yes', 'Payment channel.'],
              ['`mpesaNumber`', '`string`', 'If mpesa', 'Safaricom number: 07XXXXXXXX or 2547XXXXXXXX.'],
              ['`cardDetails`', '`object`', 'If card', 'See card details schema below.'],
              ['`donationType`', '`"one-time" | "monthly"`', 'No', 'Donation frequency. Defaults to one-time.'],
            ]}
          />

          <h3 className="text-sm font-bold text-gray-700 mb-2 mt-4">Card Details Schema</h3>
          <Table
            headers={['Field', 'Type', 'Description']}
            rows={[
              ['`cardNumber`', '`string`', '13–19 digit card number, no spaces.'],
              ['`expiry`', '`string`', 'MM/YY format (e.g. 08/27).'],
              ['`cvv`', '`string`', '3 or 4 digits.'],
            ]}
          />

          <h3 className="text-sm font-bold text-gray-700 mb-2 mt-4">Example — M-Pesa</h3>
          <CodeBlock>{`POST /api/donations
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "amount": 50,
  "paymentMethod": "mpesa",
  "mpesaNumber": "0712345678",
  "donationType": "one-time"
}`}</CodeBlock>

          <h3 className="text-sm font-bold text-gray-700 mb-2 mt-4">Example — Card</h3>
          <CodeBlock>{`POST /api/donations
Content-Type: application/json

{
  "name": "John Kamau",
  "email": "john@example.com",
  "amount": 100,
  "paymentMethod": "card",
  "donationType": "monthly",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "expiry": "12/26",
    "cvv": "123"
  }
}`}</CodeBlock>

          <h3 className="text-sm font-bold text-gray-700 mb-3 mt-4">Responses</h3>

          <div className="space-y-5">
            {/* 201 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="green">201 Created</Badge>
                <span className="text-sm text-gray-600">Payment confirmed</span>
              </div>
              <CodeBlock>{`{
  "success": true,
  "transactionId": "MSF-1751500000000-A3B4C5D6",
  "amount": 50,
  "paymentMethod": "mpesa",
  "timestamp": "2026-07-02T10:30:00.000Z",
  "status": "confirmed"
}`}</CodeBlock>
              <Table
                headers={['Field', 'Type', 'Description']}
                rows={[
                  ['`success`', '`boolean`', 'Always true on this response.'],
                  ['`transactionId`', '`string`', 'Unique ref: MSF-{timestamp}-{8-char-hex}.'],
                  ['`amount`', '`number`', 'Confirmed donation amount.'],
                  ['`paymentMethod`', '`string`', '"mpesa" or "card".'],
                  ['`timestamp`', '`string`', 'ISO 8601 UTC timestamp.'],
                  ['`status`', '`string`', 'Always "confirmed" on success.'],
                ]}
              />
            </div>

            {/* 400 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="yellow">400 Bad Request</Badge>
                <span className="text-sm text-gray-600">Validation failed</span>
              </div>
              <CodeBlock>{`{
  "success": false,
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "amount", "message": "Minimum donation is KES 10" }
  ]
}`}</CodeBlock>
            </div>

            {/* 402 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="yellow">402 Payment Required</Badge>
                <span className="text-sm text-gray-600">Simulated payment failure (~15% probability)</span>
              </div>
              <CodeBlock>{`{
  "success": false,
  "message": "Payment could not be processed",
  "reason": "Insufficient funds"
}`}</CodeBlock>
              <p className="text-xs text-gray-500">
                Possible reasons: <code className="font-mono">Insufficient funds</code>,{' '}
                <code className="font-mono">Transaction declined by issuing bank</code>,{' '}
                <code className="font-mono">Network timeout with payment provider</code>,{' '}
                <code className="font-mono">Card verification failed</code>,{' '}
                <code className="font-mono">Daily transaction limit reached</code>
              </p>
            </div>

            {/* 500 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="red">500 Internal Server Error</Badge>
              </div>
              <CodeBlock>{`{
  "success": false,
  "message": "An unexpected server error occurred. Please try again."
}`}</CodeBlock>
            </div>
          </div>
        </Section>

        {/* GET /api/donations/:id */}
        <Section title="GET /api/donations/:id">
          <p className="text-gray-600 text-sm mb-4">
            Retrieve the status of a previously submitted donation.
          </p>

          <h3 className="text-sm font-bold text-gray-700 mb-2">Path Parameters</h3>
          <Table
            headers={['Parameter', 'Description']}
            rows={[['`id`', 'The transactionId returned from POST /api/donations.']]}
          />

          <h3 className="text-sm font-bold text-gray-700 mb-2 mt-4">Example Request</h3>
          <CodeBlock>{`GET /api/donations/MSF-1751500000000-A3B4C5D6`}</CodeBlock>

          <h3 className="text-sm font-bold text-gray-700 mb-3 mt-4">Responses</h3>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="green">200 OK</Badge>
                <span className="text-sm text-gray-600">Donation found</span>
              </div>
              <CodeBlock>{`{
  "success": true,
  "donation": {
    "transactionId": "MSF-1751500000000-A3B4C5D6",
    "amount": 50,
    "paymentMethod": "mpesa",
    "status": "confirmed",
    "timestamp": "2026-07-02T10:30:00.000Z"
  }
}`}</CodeBlock>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="yellow">404 Not Found</Badge>
              </div>
              <CodeBlock>{`{
  "success": false,
  "message": "Donation not found"
}`}</CodeBlock>
            </div>
          </div>
        </Section>

        {/* Health check */}
        <Section title="GET /health">
          <p className="text-gray-600 text-sm mb-4">Server health check endpoint.</p>
          <CodeBlock>{`{
  "status": "ok",
  "timestamp": "2026-07-02T10:30:00.000Z"
}`}</CodeBlock>
        </Section>
      </main>

      <footer className="border-t border-rose-100 py-6 px-4 text-center text-gray-400 text-xs bg-white/40">
        <p>
          &copy; {new Date().getFullYear()} Médecins Sans Frontières.{' '}
          <span className="text-gray-500">
            This portal is a demonstration — no real payments are processed.
          </span>
        </p>
        <p className="mt-2">
          <Link to="/wireframe" className="text-rose-400 hover:text-rose-600 transition-colors font-semibold">
            View wireframe
          </Link>
        </p>
      </footer>
    </div>
  );
}
