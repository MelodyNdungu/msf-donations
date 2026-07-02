# MSF Eastern Africa — Donations Portal

A full-stack, responsive one-page donations portal for **Médecins Sans Frontières (MSF) Eastern Africa**. Built as a simulation/demonstration — no real payments are processed.

```
msf-donations/
├── client/                  # React + Vite frontend (Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── DonationForm.jsx   # Main form with validation + API integration
│   │   │   ├── SuccessMessage.jsx # Post-submission confirmation
│   │   │   └── TrustBanner.jsx    # Security messaging banner
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                  # Node.js + Express API
│   ├── controllers/
│   │   └── donationsController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── donations.js
│   ├── validators/
│   │   └── donationValidator.js
│   ├── index.js
│   └── package.json
├── API_DOCS.md
├── .env.example
└── README.md
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1 — Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2 — Configure environment

```bash
# Copy the example env file into the server directory
cp .env.example server/.env
# Edit server/.env if you need to change PORT or CLIENT_ORIGIN
```

### 3 — Start the development servers

Open **two terminal tabs**:

```bash
# Terminal 1 — API server (http://localhost:3001)
cd server && npm run dev

# Terminal 2 — Vite dev server (http://localhost:5173)
cd client && npm run dev
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:3001`, so no CORS config is needed on the browser side during development.

### 4 — Build for production (client)

```bash
cd client && npm run build
# Outputs to client/dist/
```

---

## Environment Variables

All variables are consumed by the **server** only.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | TCP port the Express server listens on. |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin. Set to your deployed frontend URL in production. |
| `NODE_ENV` | `development` | Controls error verbosity. |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/donations` | Submit a donation (validate + simulate payment). |
| `GET` | `/api/donations/:id` | Look up donation status by transaction ID. |
| `GET` | `/health` | Server health check. |

See [API_DOCS.md](API_DOCS.md) for full request/response schemas, status codes, and example payloads.

---

## Framework Choices & Rationale

### Frontend — React + Vite + Tailwind CSS

- **React** was chosen for its component model, which maps cleanly onto the distinct UI states in this form (idle → loading → success/error). The uncontrolled-to-controlled form pattern keeps validation logic co-located with rendering.
- **Vite** gives near-instant HMR and a lean build pipeline with no config overhead for a single-page app of this scope.
- **Tailwind CSS** makes responsive, accessible styling fast and consistent without a custom CSS file to maintain. Mobile-first utility classes (e.g. `sm:p-8`) handle breakpoint behaviour declaratively.

### Backend — Node.js + Express + Zod

- **Express** is the minimal, well-understood choice for a REST API of this size. Its middleware chain maps naturally onto the pipeline: CORS → body parsing → route handler → error handler.
- **Zod** provides co-located schema definition and runtime validation with descriptive per-field error messages. The `safeParse` API returns a typed result object, making validation failures an explicit branch rather than an exception.
- **ES Modules** (`"type": "module"`) are used throughout the server for consistency with the client toolchain.
- **No database** — an in-memory `Map` satisfies the requirement and keeps the setup dependency-free.

---

## Assumptions

1. **Currency is USD** throughout; the frontend labels amounts in `$`. The backend does not validate currency — that would be a concern for a real PSP integration.
2. **M-Pesa format** is scoped to Safaricom Kenya (prefix `07` or country code `2547`). Other East African M-Pesa operators (Tanzania, Uganda, Mozambique) use different numbering and would need additional regex patterns.
3. **Card validation is format-only** (Luhn check omitted) since no real payment network is involved.
4. **85/15 success/failure split** is hardcoded to make the failure UI easily observable during testing. In production this would be determined entirely by the PSP response.
5. **In-memory state is ephemeral** — donations are lost on server restart. This is intentional for the simulation.
6. **Single region** — no i18n or currency conversion is implemented.

---

## How This Would Be Secured in Production

### Transport & Infrastructure

- **HTTPS everywhere** — TLS terminated at the load balancer; HTTP → HTTPS redirect enforced. HSTS header added.
- **Strict CORS** — `CLIENT_ORIGIN` locked to the production frontend domain; credentials mode disabled since this API uses no cookies.
- **Rate limiting** — `express-rate-limit` on `POST /api/donations` (e.g. 10 requests / minute per IP) to prevent donation-spam and credential-stuffing.
- **Helmet.js** — sets secure HTTP response headers (CSP, X-Frame-Options, HSTS, etc.).

### PCI-DSS Scoping for Card Data

- **Never store card data** — the current implementation already excludes card details from the in-memory store. In production, raw card numbers, expiry dates, and CVVs must never touch your servers.
- **Tokenisation via real PSP** — integrate a PCI-compliant provider (Stripe, Flutterwave, Pesapal for East Africa). The client-side SDK tokenises card data directly in the browser; your server receives only a one-time token, keeping your infrastructure out of PCI scope (SAQ A eligibility).
- **Client-side card collection** — use the PSP's hosted fields / Elements SDK rather than a plain `<input>` so the card number never travels through your domain.

### Input Sanitisation & Injection Prevention

- All request bodies are validated and typed through Zod before any logic runs.
- String fields are trimmed; lengths are bounded.
- No SQL or template engine is used, so SQL injection and template injection are not applicable. If a database is added, use parameterised queries exclusively.
- `express.json({ limit: '10kb' })` prevents oversized-payload attacks.

### Secrets Management

- API keys, PSP credentials, and database URIs are loaded from environment variables — never committed to source control.
- In production: use a secrets manager (AWS Secrets Manager, HashiCorp Vault, or platform-native env secrets) with rotation policies.

### Authentication & Audit Logging

- Donor-facing submission requires no auth by design (public portal).
- An admin dashboard or reporting endpoint would require JWT or session-based authentication with role checks.
- Every donation submission should be written to a structured audit log (timestamp, IP address, outcome, transaction ID) stored in a tamper-evident log store.

### Monitoring

- Integrate structured logging (e.g. Pino) with a log aggregator (Datadog, CloudWatch) and alert on elevated 4xx/5xx rates.
- Track payment failure rates; a sudden spike may indicate a PSP outage or fraud attempt.

---

## Future Improvements

| Area | Improvement |
|---|---|
| **Real payments** | Integrate [Safaricom Daraja API](https://developer.safaricom.co.ke/) for live M-Pesa STK push. Integrate Stripe / Flutterwave / Pesapal for card payments. |
| **Database** | Replace the in-memory store with PostgreSQL (via Prisma or Drizzle) for persistence, querying, and reporting. |
| **Email receipts** | Send a transaction confirmation email to the donor via SendGrid / AWS SES on successful payment. |
| **Admin dashboard** | Authenticated internal view of all donations with export-to-CSV functionality. |
| **Donor accounts** | Optional account creation for recurring donations and donation history. |
| **Recurring donations** | Support monthly/annual giving via PSP subscription APIs. |
| **Multi-currency** | Accept KES, UGX, TZS alongside USD; display amounts in the donor's local currency. |
| **Accessibility audit** | Full WCAG 2.1 AA audit and remediation; keyboard navigation testing. |
| **End-to-end tests** | Playwright or Cypress tests covering the happy path, validation errors, and payment failure UI. |
| **CI/CD pipeline** | GitHub Actions workflow for linting, type-checking, and deployment to a cloud platform. |
