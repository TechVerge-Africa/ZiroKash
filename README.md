# ZiroPay

**The easiest way to get paid** — Create payment forms as simple as Google Forms, share a link, and collect payments with customizable receipts.

---

## 🎯 What is ZiroPay?

ZiroPay enables anyone to collect payments without needing technical expertise or complex payment gateway integrations. Think of it as "Google Forms for Payments":

1. **Create** → Build a payment form with a drag-and-drop builder
2. **Share** → Get a link or embed code for your website
3. **Collect** → Receive payments via Mobile Money or Card
4. **Receipt** → Automatically generate branded receipts

---

## ✨ Key Features

### Payment Form Builder
- Drag-and-drop form field builder
- Custom branding (logo, colors, signature)
- Flexible field types: text, email, phone, dropdown, amount
- Preview before publishing

### Receipt Designer
- Customizable receipt templates
- Add institution logo and signature
- Professional PDF generation
- Automatic email delivery

### Analytics Dashboard
- Real-time payment tracking
- Submission analytics
- Revenue reports
- Export to CSV

### Payment Integration
- Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo)
- Card payments via Paystack
- Instant webhook notifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query (React Query) |
| Backend | Supabase (Postgres + Edge Functions) |
| Payments | Paystack |
| Hosting | Vercel (Frontend) + Supabase Cloud |

---

## 📂 Project Structure

```
/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn/ui base components
│   │   ├── layout/      # Header, Sidebar, Navigation
│   │   ├── ziropay/     # Payment form builder components
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route pages
│   ├── services/        # API service classes
│   ├── types/           # TypeScript types
│   └── integrations/    # Supabase client setup
│
├── supabase/
│   ├── functions/       # Edge Functions (serverless)
│   │   ├── payment-form-submit/    # Handle form submissions
│   │   ├── form-payment-webhook/   # Paystack webhook handler
│   │   └── ...
│   └── config.toml      # Supabase configuration
│
├── docs/                # Developer documentation
└── public/              # Static assets
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)
- Paystack account (for payments)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/ziropay.git
cd ziropay
npm install
```

### 2. Environment Setup

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://kbhyqypwwmkvssrcbfdb.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | System design, database schema, data flow |
| [Developer Guide](./docs/DEVELOPER_GUIDE.md) | Setup, conventions, contribution workflow |
| [Features](./docs/FEATURES.md) | Detailed feature documentation |
| [Roadmap](./docs/ROADMAP.md) | Current status and planned features |

---

## 🔐 Key Environment Variables

### Supabase Edge Function Secrets

These secrets must be set in Supabase Dashboard → Settings → Edge Functions:

| Secret | Description |
|--------|-------------|
| `PAYSTACK_SECRET_KEY` | Paystack secret key for payment processing |
| `RESEND_API_KEY` | Resend API key for email notifications |

---

## 👥 Team

- **CEO / Founder** — Sulley Abdul Latif
- **Engineering Team** — Core developers

---

## 💡 Vision

Make payment collection as easy as creating a Google Form. No code, no complex integrations — just create, share, and get paid.

---

## 📄 License

MIT License — See [LICENSE](./LICENSE) for details.
