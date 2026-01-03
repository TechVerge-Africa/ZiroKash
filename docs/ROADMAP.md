# ZiroKash Roadmap

Current development status, completed features, and future plans.

---

## Current Status: Beta

ZiroKash is in active development with core payment collection functionality working.

---

## ✅ Completed Features

### Authentication & User Management
- [x] Email/password authentication
- [x] User registration and login
- [x] Protected routes
- [x] User profile management
- [x] Session persistence

### Payment Form Builder
- [x] Drag-and-drop form builder
- [x] Multiple field types (text, email, phone, dropdown, amount)
- [x] Field validation settings
- [x] Live form preview
- [x] Form save and publish
- [x] Theme color customization
- [x] Logo upload support
- [x] Signature upload support

### Receipt Designer
- [x] Receipt template customization
- [x] Logo placement
- [x] Signature placement
- [x] Custom messaging

### Public Payment Page
- [x] Public form rendering (`/pay/:formId`)
- [x] Form validation
- [x] Paystack integration
- [x] Payment redirect flow
- [x] Mobile responsive design

### Backend Infrastructure
- [x] Supabase database setup
- [x] Row Level Security policies
- [x] Edge function: `payment-form-submit`
- [x] Edge function: `form-payment-webhook`
- [x] Real-time subscriptions

### Analytics Dashboard
- [x] Total collected amount
- [x] Submission counts
- [x] Active forms count
- [x] Per-form statistics
- [x] Basic charts (Recharts)

### Form Management
- [x] List all forms
- [x] View form details
- [x] Toggle form active/inactive
- [x] Delete forms
- [x] Copy payment link
- [x] View submissions table
- [x] Export submissions to CSV

### Sharing Features
- [x] Direct payment link
- [x] QR code generation
- [x] Embed code (iframe)

---

## 🚧 In Progress

### Receipt System
- [ ] PDF receipt generation (jsPDF)
- [ ] Automatic receipt delivery via email
- [ ] Receipt storage and retrieval

### Email Notifications
- [ ] Payment success email to payer
- [ ] Payment notification to form owner
- [ ] Email template customization

---

## 📋 Planned Features

### High Priority (Next Sprint)

#### PDF Receipts
- Generate professional PDF receipts
- Include institution branding
- Store in Supabase Storage
- Downloadable from dashboard

#### Email Integration
- Set up Resend email service
- Payment confirmation emails
- Receipt attachment
- Configurable email templates

#### Form Templates
- Pre-built form templates
- School fees template
- Event registration template
- Donation template
- Quick form creation

### Medium Priority (Q1 2025)

#### Advanced Analytics
- Time-series charts
- Conversion funnel
- Geographic breakdown
- Export reports to PDF

#### API for Developers
- REST API for form submissions
- API key generation and management
- Webhook configuration
- Rate limiting

#### Multi-currency Support
- GHS (Ghana Cedis) — current
- NGN (Nigerian Naira)
- KES (Kenyan Shillings)
- USD (US Dollars)

#### Payment Methods
- Bank transfer
- USSD payments
- Additional MoMo providers

### Low Priority (Q2 2025)

#### Team Collaboration
- Invite team members
- Role-based permissions
- Activity audit log
- Shared form ownership

#### White-label Solution
- Custom domain support
- Remove ZiroKash branding
- Custom email sender
- Enterprise pricing tier

#### Mobile App
- React Native app
- Push notifications
- Offline form access
- Quick payment links

#### Integrations
- Zapier integration
- Webhook customization
- Google Sheets export
- Slack notifications

---

## 🐛 Known Issues

### High Priority Fixes
1. **Amount validation** — Large amounts may overflow display
2. **Form preview** — Some field types not rendering correctly
3. **Mobile keyboard** — Amount input keyboard issues on iOS

### Medium Priority Fixes
1. **Real-time updates** — Occasional subscription disconnects
2. **CSV export** — Special characters not escaped properly
3. **Theme color** — Dark mode contrast issues

### Low Priority Fixes
1. **Loading states** — Inconsistent skeleton loaders
2. **Error messages** — Some errors show technical details
3. **Form builder** — Undo/redo not implemented

---

## 💡 Feature Requests (Under Consideration)

- Recurring payments / subscriptions
- Partial payments
- Refund processing
- Installment plans
- Multi-page forms
- Conditional logic (show/hide fields)
- File uploads in forms
- Digital signatures
- Scheduled form publishing

---

## Development Priorities

### Priority Matrix

| Impact ↓ / Effort → | Low Effort | Medium Effort | High Effort |
|---------------------|------------|---------------|-------------|
| **High Impact** | Email notifications | PDF receipts | API system |
| **Medium Impact** | Form templates | Advanced analytics | Multi-currency |
| **Low Impact** | UI polish | Integrations | Mobile app |

### Current Sprint Focus

1. ✅ Complete form builder core
2. ✅ Implement payment flow
3. ✅ Build analytics dashboard
4. 🔄 Add PDF receipt generation
5. 🔄 Integrate email notifications
6. 📋 Create form templates

---

## How to Contribute

1. Check the [Issues](https://github.com/your-org/zirokash/issues) for open tasks
2. Pick an issue labeled `good-first-issue` or `help-wanted`
3. Comment on the issue to claim it
4. Submit a PR following our [Developer Guide](./DEVELOPER_GUIDE.md)

---

## Release History

| Version | Date | Highlights |
|---------|------|------------|
| 0.1.0 | TBD | Initial beta release |
| 0.2.0 | TBD | PDF receipts, email notifications |
| 0.3.0 | TBD | Form templates, API system |

---

## Contact

For feature requests or bug reports:
- GitHub Issues: [zirokash/issues](https://github.com/your-org/zirokash/issues)
- Email: support@zirokash.com
