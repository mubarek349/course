# Payment API Usage Guide

## 🎯 **Available APIs**

### 1. **Chapa Payment API** (`/api/update-order-status-by-chapa`)

Use this for Chapa (Ethiopian) payments.

**Request:**

```bash
POST /api/update-order-status-by-chapa
Content-Type: application/json

{
  "courseId": "course-uuid",
  "phoneNumber": "0910737199",
  "amount": 500,
  "currency": "ETB",
  "tx_ref": "chapa-transaction-ref",
  "reference": "chapa-reference",
  "code": "chapa-code",
  "img": "receipt-image-url"
}
```

**Response:**

```json
{
  "success": true,
  "updatedCount": 1,
  "message": "Chapa orders updated successfully",
  "orderId": "order-uuid"
}
```

### 2. **Stripe Payment API** (`/api/update-order-status-by-stripe`)

Use this for Stripe (International) payments.

**Request:**

```bash
POST /api/update-order-status-by-stripe
Content-Type: application/json

{
  "courseId": "course-uuid",
  "phoneNumber": "0910737199",
  "amount": 25,
  "currency": "USD",
  "sessionId": "stripe-session-id",
  "paymentIntentId": "stripe-payment-intent-id",
  "customerId": "stripe-customer-id",
  "img": "receipt-image-url"
}
```

**Response:**

```json
{
  "success": true,
  "updatedCount": 1,
  "message": "Stripe orders updated successfully",
  "orderId": "order-uuid"
}
```

### 3. **Legacy API** (`/api/update-order-status`)

This is the old API that works with both payment types. **Fixed to work with new schema.**

**Request:**

```bash
POST /api/update-order-status
Content-Type: application/json

{
  "courseId": "course-uuid",
  "phoneNumber": "0910737199",
  "paymentType": "stripe", // or "chapa"
  "amount": 100,
  "currency": "USD" // or "ETB"
}
```

## 🔧 **Key Differences**

| Feature             | Chapa API            | Stripe API                    | Legacy API    |
| ------------------- | -------------------- | ----------------------------- | ------------- |
| **Currency**        | ETB (Ethiopian Birr) | USD (US Dollar)               | Both          |
| **Price Field**     | `birrPrice`          | `dolarPrice`                  | Auto-detected |
| **Payment Type**    | `"chapa"`            | `"stripe"`                    | Configurable  |
| **Transaction Ref** | `tx_ref`             | `sessionId`/`paymentIntentId` | Generic       |
| **Reference**       | `reference`          | `paymentIntentId`             | Generic       |
| **Code**            | `code`               | `customerId`                  | Generic       |

## 🚀 **Usage Examples**

### For Chapa Payments:

```javascript
const response = await fetch("/api/update-order-status-by-chapa", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    courseId: "325b4cdb-7f88-45ed-a0e0-fad99ec7fb7a",
    phoneNumber: "0910737199",
    amount: 500,
    currency: "ETB",
    tx_ref: "chapa_tx_12345",
  }),
});
```

### For Stripe Payments:

```javascript
const response = await fetch("/api/update-order-status-by-stripe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    courseId: "325b4cdb-7f88-45ed-a0e0-fad99ec7fb7a",
    phoneNumber: "0910737199",
    amount: 25,
    currency: "USD",
    sessionId: "cs_test_12345",
  }),
});
```

## ✅ **Error Handling**

All APIs return consistent error responses:

```json
{
  "error": "Error message",
  "success": false
}
```

Common errors:

- `"Course ID and phone number are required"`
- `"User not found"`
- `"Course not found"`
- `"Database error when creating order"`

## 🔄 **Database Schema**

The unified Order table now includes:

- `currency` - Payment currency (ETB/USD)
- `birrPrice` - Price in Ethiopian Birr (for Chapa)
- `dolarPrice` - Price in US Dollars (for Stripe)
- All existing fields (tx_ref, reference, code, img, etc.)

## 🎯 **Recommendation**

**Use the specific APIs** (`/api/update-order-status-by-chapa` and `/api/update-order-status-by-stripe`) for new implementations as they provide better type safety and payment-specific handling.
