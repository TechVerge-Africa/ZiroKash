# ZiroKash Features Documentation

Detailed documentation of all ZiroKash features and their implementation.

---

## 1. Payment Form Builder

### Overview
The drag-and-drop form builder allows users to create custom payment forms without any coding knowledge.

### Location
- **Page:** `/zirokash`
- **Component:** `src/components/zirokash/FormBuilder.tsx`

### Supported Field Types

| Type | Description | Options |
|------|-------------|---------|
| `text` | Single-line text input | placeholder, required |
| `email` | Email input with validation | placeholder, required |
| `phone` | Phone number input | placeholder, required |
| `number` | Numeric input | placeholder, required, min, max |
| `dropdown` | Select dropdown | options array, required |
| `textarea` | Multi-line text | placeholder, required |
| `amount` | Payment amount selector | predefined options or custom |

### Field Configuration

Each field has the following properties:
```typescript
interface FormField {
  id: string;           // Unique identifier (auto-generated)
  type: FieldType;      // Field type
  label: string;        // Display label
  placeholder?: string; // Input placeholder
  required: boolean;    // Is field required?
  options?: string[];   // For dropdown/amount fields
}
```

### Usage

1. Click "Add Field" or drag field type into builder
2. Configure field properties in the editor panel
3. Reorder fields via drag-and-drop
4. Preview form in real-time
5. Save form to publish

---

## 2. Receipt Designer

### Overview
Customize professional receipts with your institution's branding.

### Location
- **Component:** `src/components/zirokash/ReceiptDesigner.tsx`

### Customization Options

| Element | Options |
|---------|---------|
| **Logo** | Upload image (PNG, JPG, SVG) |
| **Colors** | Primary color, accent color |
| **Header** | Institution name, address |
| **Footer** | Custom message, terms |
| **Signature** | Upload authorized signature |

### Receipt Data

Receipts automatically include:
- Transaction reference number
- Date and time
- Payer details (name, email)
- Amount paid
- Payment method
- Form field values

### Future: PDF Generation
- Generate downloadable PDF receipts
- Email receipt automatically to payer
- Store receipt URL in database

---

## 3. Public Payment Page

### Overview
A public-facing page where payers can fill the form and complete payment.

### Route
```
/pay/:formId
```

### Location
- **Page:** `src/pages/PaymentForm.tsx`

### Payment Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Load Form  │───▶│  Fill Form  │───▶│  Paystack   │
│  by ID      │    │  & Submit   │    │  Checkout   │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                         ┌───────────────────┴───────────────────┐
                         ▼                                       ▼
                   ┌─────────────┐                         ┌─────────────┐
                   │  Success    │                         │   Failed    │
                   │  Redirect   │                         │  Redirect   │
                   └─────────────┘                         └─────────────┘
```

### API Call
The form submission calls the edge function:

```typescript
// POST to payment-form-submit edge function
const response = await supabase.functions.invoke('payment-form-submit', {
  body: {
    formId: 'uuid',
    data: { /* field values */ },
    payerName: 'John Doe',
    payerEmail: 'john@example.com',
    amount: 500  // in smallest currency unit
  }
});

// Response contains Paystack checkout URL
const { payment_url } = response.data;
window.location.href = payment_url;
```

---

## 4. Analytics Dashboard

### Overview
Real-time analytics for payment form performance.

### Location
- **Component:** `src/components/zirokash/FormAnalytics.tsx`
- **Page Integration:** `src/pages/FormDetails.tsx`

### Metrics

| Metric | Description |
|--------|-------------|
| **Total Collected** | Sum of all paid submissions |
| **Total Submissions** | Count of all submissions |
| **Paid Submissions** | Count of successful payments |
| **Pending Submissions** | Count awaiting payment |
| **Conversion Rate** | Paid / Total × 100% |

### Charts

1. **Daily Submissions** — Bar chart showing submissions over time
2. **Payment Status** — Pie chart of paid/pending/failed
3. **Amount Distribution** — Histogram of payment amounts

### Data Source

Analytics are calculated from `form_submissions` table:
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as collected
FROM form_submissions
WHERE form_id = :formId
```

---

## 5. Form Sharing & Embedding

### Overview
Multiple ways to share payment forms with payers.

### Location
- **Component:** `src/components/zirokash/FormEmbedCode.tsx`

### Sharing Options

#### 1. Direct Link
```
https://zirokash.app/pay/{formId}
```

#### 2. QR Code
Auto-generated QR code pointing to the payment page.

#### 3. Embed Code (iframe)
```html
<iframe 
  src="https://zirokash.app/pay/{formId}?embed=true"
  width="100%"
  height="600"
  frameborder="0">
</iframe>
```

#### 4. JavaScript Widget (Future)
```html
<script src="https://zirokash.app/widget.js"></script>
<div id="zirokash-form" data-form-id="{formId}"></div>
```

---

## 6. Submissions Management

### Overview
View and manage all form submissions.

### Location
- **Page:** `src/pages/FormDetails.tsx` (Submissions tab)

### Features

| Feature | Description |
|---------|-------------|
| **View All** | Table of all submissions |
| **Filter** | By status (paid/pending/failed) |
| **Search** | By payer name or email |
| **Export** | Download as CSV |
| **Details** | View full submission data |

### Submission Status Flow

```
pending → paid
pending → failed
```

Status is updated by the webhook when Paystack confirms payment.

---

## 7. API Integration (Future)

### Overview
Programmatic access to create submissions via API.

### Authentication
```
Authorization: Bearer {api_key}
```

### Endpoints

#### Create Submission
```http
POST /api/v1/forms/{formId}/submit
Content-Type: application/json

{
  "data": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "amount": 500
  }
}
```

#### Response
```json
{
  "success": true,
  "submission_id": "uuid",
  "payment_url": "https://checkout.paystack.com/xxx"
}
```

### API Key Management
- Generate keys in Form Settings
- Keys are tied to specific forms
- Revoke keys anytime
- Track API usage

---

## 8. Webhook Handling

### Overview
Receive payment status updates from Paystack.

### Endpoint
```
POST /functions/v1/form-payment-webhook
```

### Paystack Event Types Handled

| Event | Action |
|-------|--------|
| `charge.success` | Mark submission as paid |
| `charge.failed` | Mark submission as failed |

### Security
- Verify webhook signature
- Validate event source
- Check transaction reference

### Implementation
```typescript
// Verify Paystack signature
const hash = crypto
  .createHmac('sha512', PAYSTACK_SECRET_KEY)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (hash !== req.headers['x-paystack-signature']) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

---

## 9. Email Notifications (Planned)

### Trigger Points

| Event | Email Sent To |
|-------|---------------|
| Payment Success | Payer + Form Owner |
| Payment Failed | Payer |
| Daily Summary | Form Owner |

### Email Templates
- Transaction success confirmation
- Receipt with payment details
- Daily/weekly summary reports

---

## 10. Mobile Money Support

### Supported Providers (Ghana)

| Provider | Code | Network |
|----------|------|---------|
| MTN Mobile Money | `mtn` | MTN |
| Vodafone Cash | `vod` | Vodafone |
| AirtelTigo Money | `tgo` | AirtelTigo |

### Payment Flow

1. User selects Mobile Money
2. Enters phone number
3. Receives USSD prompt
4. Authorizes with PIN
5. Payment confirmed via webhook

### Test Numbers (Paystack Sandbox)
- MTN: `0551234567`
- Vodafone: `0201234567`
- AirtelTigo: `0261234567`

---

## Feature Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and priorities.
