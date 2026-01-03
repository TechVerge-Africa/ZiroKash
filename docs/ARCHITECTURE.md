# ZiroKash Architecture

This document describes the system architecture, database schema, and data flow for ZiroKash.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Dashboard   │  │ Form Builder │  │  Public Pay  │     │
│  │    Page      │  │   (Auth)     │  │   (Auth)     │  │    Page      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE BACKEND                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │   Database   │  │ Edge         │  │   Storage    │     │
│  │   (Email)    │  │   (Postgres) │  │ Functions    │  │   (Files)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
│  ┌──────────────┐  ┌──────────────┐                                         │
│  │   Paystack   │  │   Resend     │                                         │
│  │  (Payments)  │  │  (Emails)    │                                         │
│  └──────────────┘  └──────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Flow: Create Form → Collect Payment

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. CREATE  │───▶│  2. SHARE   │───▶│  3. SUBMIT  │───▶│  4. PAY     │
│    FORM     │    │    LINK     │    │    FORM     │    │   (Paystack)│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      ▼                  ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│payment_forms│    │  /pay/:id   │    │form_submiss-│    │   webhook   │
│   (table)   │    │  (route)    │    │   ions      │    │  callback   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                               │
                                                               ▼
                                                         ┌─────────────┐
                                                         │  5. RECEIPT │
                                                         │  Generated  │
                                                         └─────────────┘
```

---

## Database Schema

### Core Tables

#### `payment_forms`
Stores the payment form configurations created by users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Owner's auth user ID |
| `title` | TEXT | Form title |
| `description` | TEXT | Form description |
| `fields` | JSONB | Array of form field definitions |
| `theme_color` | TEXT | Brand color (hex) |
| `logo_url` | TEXT | Institution logo URL |
| `signature_url` | TEXT | Signature image URL |
| `receipt_template` | JSONB | Receipt customization |
| `is_active` | BOOLEAN | Whether form accepts submissions |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Fields JSONB Structure:**
```json
[
  {
    "id": "field_abc123",
    "type": "text",
    "label": "Full Name",
    "placeholder": "Enter your name",
    "required": true
  },
  {
    "id": "field_def456",
    "type": "amount",
    "label": "Amount",
    "options": ["100", "200", "500"]
  }
]
```

#### `form_submissions`
Tracks all payment form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `form_id` | UUID | FK to payment_forms |
| `submission_data` | JSONB | Field values submitted |
| `amount` | BIGINT | Amount in smallest currency unit |
| `payer_name` | TEXT | Name of payer |
| `payer_email` | TEXT | Email of payer |
| `status` | TEXT | pending, paid, failed |
| `transaction_id` | UUID | Paystack transaction reference |
| `receipt_url` | TEXT | Generated receipt URL |
| `created_at` | TIMESTAMP | Submission timestamp |

#### `form_api_keys`
API keys for programmatic form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `form_id` | UUID | FK to payment_forms |
| `user_id` | UUID | Owner's auth user ID |
| `api_key` | TEXT | The API key (hashed) |
| `status` | TEXT | active, revoked |
| `last_used_at` | TIMESTAMP | Last API call time |
| `created_at` | TIMESTAMP | Creation timestamp |

---

## Edge Functions

### `payment-form-submit`
Handles public form submissions and initiates Paystack payment.

**Endpoint:** `POST /functions/v1/payment-form-submit`

**Request:**
```json
{
  "formId": "uuid",
  "data": {
    "field_abc123": "John Doe",
    "field_def456": 500
  },
  "payerName": "John Doe",
  "payerEmail": "john@example.com",
  "amount": 500
}
```

**Response:**
```json
{
  "success": true,
  "payment_url": "https://checkout.paystack.com/xxx",
  "submission_id": "uuid"
}
```

### `form-payment-webhook`
Receives Paystack webhook callbacks to update submission status.

**Endpoint:** `POST /functions/v1/form-payment-webhook`

**Flow:**
1. Verify Paystack signature
2. Parse event data
3. Update `form_submissions.status` to 'paid'
4. Trigger receipt generation (future)
5. Send email notification (future)

---

## Security Model

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**payment_forms:**
- Users can only CRUD their own forms (`user_id = auth.uid()`)

**form_submissions:**
- Anyone can INSERT (public form submission)
- Form owners can SELECT their form's submissions

**form_api_keys:**
- Users can only CRUD their own API keys

### Authentication Flow

```
┌───────────┐    ┌───────────┐    ┌───────────┐
│   User    │───▶│  Supabase │───▶│  Session  │
│  Sign In  │    │   Auth    │    │   Token   │
└───────────┘    └───────────┘    └───────────┘
                                        │
                                        ▼
                                  ┌───────────┐
                                  │  RLS      │
                                  │ Policies  │
                                  └───────────┘
```

---

## Component Architecture

### Page Components

```
/pages/
├── Landing.tsx      # Public landing page
├── Auth.tsx         # Login/Signup
├── Dashboard.tsx    # Main dashboard (auth required)
├── ZiroKash.tsx      # Form management & builder
├── FormDetails.tsx  # Single form view with analytics
└── PaymentForm.tsx  # Public payment page (/pay/:formId)
```

### Feature Components

```
/components/zirokash/
├── FormBuilder.tsx     # Drag-and-drop form editor
├── FormPreview.tsx     # Live form preview
├── ReceiptDesigner.tsx # Receipt customization
├── ThemePicker.tsx     # Color/branding picker
├── FormAnalytics.tsx   # Submission charts
└── FormEmbedCode.tsx   # Embed code generator
```

### Hooks

```
/hooks/
├── useAuth.tsx         # Authentication state
├── usePaymentForms.ts  # Form CRUD operations
├── useFormApiKey.ts    # API key management
└── useWallet.tsx       # Wallet/balance operations
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      VERCEL                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │              React SPA (Vite)                   │    │
│  │         https://zirokash.vercel.app              │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SUPABASE CLOUD                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Database   │  │     Auth     │  │    Edge      │   │
│  │   Postgres   │  │   Service    │  │  Functions   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  Project: kbhyqypwwmkvssrcbfdb                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  PAYSTACK (Ghana)                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Mobile Money: MTN, Vodafone, AirtelTigo        │    │
│  │  Cards: Visa, Mastercard                        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Environment Variables

### Frontend (Vite)
```env
VITE_SUPABASE_URL=https://kbhyqypwwmkvssrcbfdb.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Supabase Edge Function Secrets
```
PAYSTACK_SECRET_KEY=sk_live_xxx
RESEND_API_KEY=re_xxx
```

---

## Future Architecture Considerations

1. **Caching**: Add Redis/Upstash for API rate limiting
2. **CDN**: Use Cloudflare for static assets
3. **Queue**: Add BullMQ for async receipt generation
4. **Monitoring**: Integrate Sentry for error tracking
