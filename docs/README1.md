# 📖 ZiroKash Developer Documentation (docs.md)

Welcome to the **ZiroKash** project documentation.  
This file serves as the **single source of truth** for architecture, stack, and implementation.  
All contributors **must follow this document strictly** to avoid deviations.

---

## 🚀 Project Vision
ZiroKash is Africa’s **cashless, borderless payment system**.  
We make it easy for anyone to **send, receive, and spend money instantly** — whether for **P2P transfers, bills, merchant payments, or corporate collections**.

Key differentiators:
- **Cashless**: Pay without cash, everywhere.
- **Borderless**: One wallet across African countries (no forex bureau stress).
- **Fast & Secure**: Realtime transactions, encrypted, KYC-compliant.
- **For Everyone**: Users, Merchants, Corporates, NGOs, Schools, and more.

---

## 🏗️ Core Features (Year 1)

1. **Wallet**
   - Create account & verify identity (KYC).
   - View balances in local currency + USD equivalent.
   - Transaction history.

2. **Payments**
   - **Send & Receive money** (P2P transfers, QR code payments).
   - **Bills & Utilities**:
     - Airtime & Data
     - Electricity
     - Water bills
     - Internet/TV subscriptions
   - **Merchants**: Pay businesses with QR or merchant code.

3. **Corporate Collections (like Paystack)**
   - APIs & SDKs for organisations to integrate ZiroKash into their websites/apps.
   - Supports:
     - NGOs (donations)
     - Schools (fees)
     - Businesses (online checkout)
   - Dashboard for corporates to track incoming payments.

4. **Cash In / Cash Out**
   - Mobile money (MTN MoMo, AirtelTigo, Vodafone).
   - Bank transfers.
   - Agent network (future).

5. **Cards**
   - Virtual debit cards (for online purchases).
   - Freeze/unfreeze card.

6. **Admin / Backoffice**
   - Monitor transactions.
   - Fraud detection & limits.
   - Reconciliation dashboard.

---

## ⚙️ Tech Stack

### Frontend
- **Web App**: React + TypeScript + TailwindCSS (shadcn UI for components)
- **Mobile App**: React Native (Expo, TypeScript, NativeWind)
- **State Management**: React Query + Context API
- **Build Tools**: Vite (web), Expo CLI (mobile)

### Backend
- **Supabase**: Authentication, Postgres DB, Realtime, Storage
- **API Gateway (Node.js, NestJS/Express)**:
  - Payments Service
  - Wallet Service
  - Corporate Collections Service
  - KYC Service
  - Treasury Service
- **Background Jobs**: BullMQ / RabbitMQ
- **Blockchain (future)**: Celo/Polygon for cross-border settlement

### Infra
- Cloud: AWS/GCP/Azure
- CI/CD: GitHub Actions
- Cache: Redis
- Logs: ELK / Datadog
- Monitoring: Prometheus + Grafana

---

## 🗂️ Repo Structure

/zirokash
/docs
docs.md
api.md
/apps
/web # React web app
/mobile # React Native app
/admin # Backoffice dashboard
/services
/api-gateway
/wallet
/payments
/corporate-collections
/treasury
/infra
/k8s
/terraform
.github/workflows
README.md

---

## 🛢️ Database (Supabase Postgres)

**Tables**

- `users` → id, email, phone, kyc_status, created_at
- `wallets` → id, user_id, currency, balance_bigint, reserved_bigint
- `ledger_entries` → id, wallet_id, type, amount_bigint, reference_id, created_at
- `payments` → id, from_wallet, to_wallet, amount, fee, status, provider_ref
- `bills` → id, user_id, bill_type (airtime, water, etc.), amount, status
- `merchants` → id, name, category, api_key, webhook_url
- `corporate_collections` → id, org_id, amount, currency, status, created_at
- `virtual_cards` → id, user_id, card_token, last4, brand, status
- `psp_webhooks` → id, provider, payload, processed
- `treasury_positions` → currency, available, locked, updated_at

> Always store balances as **integers (cents or pesewas)** — no floating points.

---

## 🔗 API Endpoints

### Auth
POST /auth/register
POST /auth/login
GET /auth/me


### Wallet
GET /wallets
POST /wallets/deposit
POST /wallets/withdraw
GET /wallets/:id/ledger


### Payments
POST /payments/send
POST /payments/request
GET /payments/:id


### Bills
POST /bills/pay # {type: airtime|water|electricity, amount, account_ref}
GET /bills/history


### Merchants
POST /merchants/pay # {merchant_id, amount, ref}
GET /merchants/:id


### Corporate Collections
POST /collections/initiate # org integrates this for collections
POST /collections/webhook # org webhook for updates
GET /collections/:id/status


---

## 🔄 Payment Flows

### P2P Send/Receive
1. User enters recipient + amount.
2. Debit sender wallet, credit receiver wallet (DB transaction).
3. Realtime notification → both users.

### Bills
1. User selects bill type (airtime, water, electricity, etc.).
2. Payment initiated → debit wallet.
3. Call PSP / bill provider API.
4. Confirm success → mark bill as paid.

### Merchants
1. Customer scans QR code or enters merchant code.
2. API validates merchant.
3. Debit customer wallet, credit merchant wallet.
4. Merchant dashboard shows new transaction.

### Corporate Collections
1. Organisation integrates ZiroKash API (checkout or donation).
2. Payment initiated → redirect to ZiroKash (secure pay page).
3. On success → webhook to organisation.
4. Org dashboard shows collection analytics.

---

## 🔒 Security & Compliance
- Supabase Auth (JWT, RLS policies).
- KYC via Jumio / SmileID.
- Device binding & OTP for high-value transfers.
- PCI-DSS compliance (via PSP partners).
- Rate limiting & idempotency keys for all payments.

---

## 📈 Scalability & Production Setup
- **Caching**: Redis (sessions, idempotency keys, rate limits).
- **Load Balancing**: Cloud LB or Nginx Ingress (k8s).
- **DB Scaling**: Supabase read replicas, partition `ledger_entries`.
- **Storage**: Supabase buckets (kyc-docs, receipts).
- **Message Queue**: RabbitMQ/Kafka for async jobs.
- **Monitoring**: Prometheus + Grafana dashboards.
- **Alerts**: Slack / PagerDuty for failures.

---

## 🧪 Testing
- **Unit tests**: Jest (backend + frontend).
- **Integration tests**: payments, wallet, bills.
- **E2E tests**: Playwright (web), Detox (mobile).
- **Load tests**: k6 for payment throughput.

---

## 🛠️ Local Setup

### Prerequisites
- Node.js >= 18
- Yarn / npm
- Supabase CLI
- Expo CLI

### Steps
```bash
# Clone repo
git clone git@github.com:yourorg/zirokash.git
cd zirokash

# Install deps
npm install

# Setup Supabase
supabase start
supabase db reset

# Run web app
cd apps/web
npm dev

# Run mobile app
cd apps/mobile
expo start

# Run API
cd services/api-gateway
npm dev

