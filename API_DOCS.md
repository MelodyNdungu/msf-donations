# MSF Eastern Africa — Donations Portal API Documentation

Base URL (development): `http://localhost:3001`

---

## POST `/api/donations`

Submit a donation and process payment (simulated).

### Request

**Content-Type:** `application/json`

#### Body Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Donor's full name. Min 2, max 100 characters. |
| `email` | `string` | ✅ | Valid email address. Max 254 characters. |
| `amount` | `number` | ✅ | Donation amount in KES. Minimum `10`, maximum `1,000,000`. |
| `paymentMethod` | `"mpesa" \| "card"` | ✅ | Payment channel. |
| `mpesaNumber` | `string` | ✅ (if mpesa) | Safaricom number. Format: `07XXXXXXXX` or `2547XXXXXXXX`. |
| `cardDetails` | `object` | ✅ (if card) | See card details schema below. |

#### Card Details Schema (`cardDetails`)

| Field | Type | Description |
|---|---|---|
| `cardNumber` | `string` | 13–19 digit card number, no spaces. |
| `expiry` | `string` | `MM/YY` format (e.g. `08/27`). |
| `cvv` | `string` | 3 or 4 digits. |

### Example Requests

#### M-Pesa

```json
POST /api/donations
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "amount": 50,
  "paymentMethod": "mpesa",
  "mpesaNumber": "0712345678"
}
```

#### Card

```json
POST /api/donations
Content-Type: application/json

{
  "name": "John Kamau",
  "email": "john@example.com",
  "amount": 100,
  "paymentMethod": "card",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "expiry": "12/26",
    "cvv": "123"
  }
}
```

---

### Responses

#### `201 Created` — Payment confirmed

```json
{
  "success": true,
  "transactionId": "MSF-1751500000000-A3B4C5D6",
  "amount": 50,
  "paymentMethod": "mpesa",
  "timestamp": "2026-07-02T10:30:00.000Z",
  "status": "confirmed"
}
```

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | Always `true` on this response. |
| `transactionId` | `string` | Unique reference in the format `MSF-{timestamp}-{8-char-hex}`. |
| `amount` | `number` | Confirmed donation amount. |
| `paymentMethod` | `string` | `"mpesa"` or `"card"`. |
| `timestamp` | `string` | ISO 8601 UTC timestamp. |
| `status` | `string` | Always `"confirmed"` on success. |

---

#### `400 Bad Request` — Validation failed

Returned when one or more fields fail server-side validation.

```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "amount", "message": "Minimum donation is $10" }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | Always `false`. |
| `errors` | `Array<{ field: string, message: string }>` | One entry per failing field. `field` uses dot notation for nested fields (e.g. `cardDetails.cvv`). |

---

#### `402 Payment Required` — Simulated payment failure

Returned when validation passes but the simulated payment gateway rejects the transaction (15% probability).

```json
{
  "success": false,
  "message": "Payment could not be processed",
  "reason": "Insufficient funds"
}
```

Possible `reason` values:
- `"Insufficient funds"`
- `"Transaction declined by issuing bank"`
- `"Network timeout with payment provider"`
- `"Card verification failed"`
- `"Daily transaction limit reached"`

---

#### `500 Internal Server Error` — Unexpected error

```json
{
  "success": false,
  "message": "An unexpected server error occurred. Please try again."
}
```

---

## GET `/api/donations/:id`

Retrieve the status of a previously submitted donation.

### Path Parameters

| Parameter | Description |
|---|---|
| `id` | The `transactionId` returned from `POST /api/donations`. |

### Example Request

```
GET /api/donations/MSF-1751500000000-A3B4C5D6
```

### Responses

#### `200 OK` — Donation found

```json
{
  "success": true,
  "donation": {
    "transactionId": "MSF-1751500000000-A3B4C5D6",
    "amount": 50,
    "paymentMethod": "mpesa",
    "status": "confirmed",
    "timestamp": "2026-07-02T10:30:00.000Z"
  }
}
```

> **Privacy note:** Email and donor name are intentionally excluded from this endpoint to minimise PII exposure.

#### `400 Bad Request` — Invalid ID format

```json
{
  "success": false,
  "message": "Invalid transaction ID format"
}
```

#### `404 Not Found` — No matching donation

```json
{
  "success": false,
  "message": "Donation not found"
}
```

> **Note:** The in-memory store is cleared on server restart. In production this would be a persistent database lookup.

---

## Status Code Summary

| Code | Meaning | When used |
|---|---|---|
| `201` | Created | Donation confirmed |
| `200` | OK | GET donation status |
| `400` | Bad Request | Validation errors / bad ID |
| `402` | Payment Required | Simulated payment failure |
| `404` | Not Found | Unknown transaction ID |
| `500` | Internal Server Error | Unhandled exception |

---

## Error Object Shape

All error responses share a common top-level structure:

```typescript
{
  success: false;
  message?: string;           // Human-readable error (single-message responses)
  errors?: Array<{            // Field-level errors (validation responses)
    field: string;
    message: string;
  }>;
  reason?: string;            // Payment failure reason (402 responses)
}
```
