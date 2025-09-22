
# 📘 ZiroKash Documentation

Welcome to the **ZiroKash Project Documentation**.  
This document will serve as a guide for all developers working on the project to ensure consistency, clarity, and alignment.

---

## 🚀 Project Overview

**ZiroKash** is a pan-African digital payment platform enabling:  
- Peer-to-peer transfers  
- Bill payments (airtime, data, water, electricity, etc.)  
- Merchant payment gateway for organizations (similar to Paystack)  
- Cross-border cashless transactions  

Our mission is to **make payments cashless, fast, secure, and borderless across Africa**.  

---

## 🏗️ System Architecture

### Components
1. **Web App (React + Next.js)**
   - Hosted on **Vercel**.
   - Provides user wallet access, bill payments, and merchant integrations.

2. **Mobile App (React Native + Expo)**
   - Cross-platform (iOS + Android).
   - Direct integration with Supabase SDK.

3. **Backend**
   - **Supabase Cloud**:
     - PostgreSQL database
     - Authentication (email, OTP, social, passkeys)
     - Supabase Edge Functions for secure business logic
     - Row-Level Security (RLS) enabled

4. **Admin Dashboard**
   - Built in React/Next.js.
   - Restricted access with Supabase RBAC (role-based access control).
   - Features: user management, KYC verification, fraud monitoring, and support tickets.

5. **Payments Infrastructure**
   - P2P transfers inside ZiroKash wallets.
   - Bill payments (via 3rd-party APIs).  
   - Merchant Payment API & SDK for businesses to integrate.  
   - Real-time transaction monitoring.  

---

## ⚙️ Development Stack

- **Frontend (Web):** React + Next.js  
- **Frontend (Mobile):** React Native + Expo  
- **Backend/Database:** Supabase Cloud  
- **Auth:** Supabase Auth  
- **Storage:** Supabase Storage (for receipts, invoices, KYC docs)  
- **Deployment:** Vercel (Web + Admin), Supabase Cloud (DB + APIs)  
- **Monitoring:** Supabase Logs, Vercel Analytics, Sentry (optional)  

---

## 🌐 Deployment Flow

### Web App
1. Push code to GitHub.  
2. Vercel auto-builds & deploys.  
3. Preview deployment available for every PR.  

### Backend
1. Supabase Cloud manages database, auth, and APIs.  
2. Edge Functions host secure business logic.  

### Mobile App
1. Built with React Native + Expo.  
2. Connects directly to Supabase via SDK.  
3. Deployed to App Store & Google Play.  

### Admin Dashboard
1. Deployed separately on Vercel.  
2. Access restricted with Supabase RBAC roles.  

---

## 🔒 Security

- **Row-Level Security (RLS)** in Supabase to protect data access.  
- Encrypted transactions and secure API endpoints.  
- Merchant API keys & SDKs with token-based authentication.  
- Regular monitoring & audit logging.  

---

## 📊 Scalability

- **Caching:** Supabase Edge Cache + Vercel Edge.  
- **Load Balancing:** Handled by Supabase + Vercel.  
- **Database Scaling:** Supabase Cloud auto-scales Postgres.  
- **Cloud Storage:** Supabase for receipts, invoices, and KYC documents.  

---

## 👥 Team Workflow

1. **Branching Strategy:** GitHub Flow (feature branches → pull request → review → merge).  
2. **Code Reviews:** Mandatory PR reviews before merging.  
3. **CI/CD:** Vercel + Supabase auto-deploy.  
4. **Issue Tracking:** GitHub Issues or Notion.  

---

## 📝 Onboarding Guide

1. Clone the repo:  
   ```bash
   git clone https://github.com/zirokash/project.git
   cd project
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Setup environment variables:  
   - Create a `.env.local` file in root.  
   - Add Supabase API keys:  
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

4. Run the dev server (web):  
   ```bash
   npm run dev
   ```

5. Start the mobile app:  
   ```bash
   npx expo start
   ```

---

## 📅 Roadmap (First Year Features)

- ✅ User Wallets (Send & Receive Money)  
- ✅ Bill Payments (airtime, data, electricity, water, etc.)  
- ✅ Merchants Payments (QR Code & API integration)  
- ✅ Peer-to-Peer Transfers  
- ✅ Admin Dashboard with Fraud Detection  
- 🚧 Cross-Border Payments (coming soon)  
- 🚧 Merchant SDKs for businesses (coming soon)  

---

## 📌 Notes for Developers

- Always follow the **branching strategy**.  
- Document your code clearly.  
- Ensure security rules are updated when modifying DB schema.  
- Follow UI/UX guidelines for consistency across web & mobile.  

---

## 📧 Contact

For any issues, contact the **ZiroKash Core Team** at:  
📩 support@zirokash.com  

---

**ZiroKash — Cashless, Fast, Secure, Borderless.**
