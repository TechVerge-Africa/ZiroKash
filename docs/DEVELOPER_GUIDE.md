# ZiroKash Developer Guide

This guide covers development setup, coding conventions, and contribution workflow.

---

## Development Setup

### Prerequisites

- **Node.js** 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ or **yarn** 1.22+
- **Git**
- **Supabase CLI** (optional, for local development)

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/zirokash.git
cd zirokash

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev
```

### IDE Setup

**Recommended: VS Code with extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar) — for better TS support

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

---

## Code Conventions

### File Naming

- **Components**: PascalCase (`FormBuilder.tsx`, `ReceiptDesigner.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePaymentForms.ts`, `useAuth.tsx`)
- **Services**: PascalCase with `Service` suffix (`WalletService.ts`)
- **Types**: PascalCase (`database.types.ts`, `financial.ts`)
- **Pages**: PascalCase (`Dashboard.tsx`, `ZiroKash.tsx`)

### Component Structure

```tsx
// 1. Imports (external first, then internal)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 2. Types/Interfaces
interface FormBuilderProps {
  formId: string;
  onSave: (data: FormData) => void;
}

// 3. Component
export function FormBuilder({ formId, onSave }: FormBuilderProps) {
  // 3a. Hooks
  const { user } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);

  // 3b. Handlers
  const handleAddField = () => {
    // ...
  };

  // 3c. Render
  return (
    <div className="space-y-4">
      {/* JSX */}
    </div>
  );
}
```

### Styling Guidelines

**DO:**
```tsx
// Use Tailwind semantic tokens
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
```

**DON'T:**
```tsx
// Avoid direct color values
<div className="bg-white text-black">
<Button className="bg-blue-500 text-white">
```

### State Management

- **Server State**: TanStack Query (React Query)
- **Local UI State**: React useState/useReducer
- **Form State**: React Hook Form

```tsx
// Server state with TanStack Query
const { data: forms, isLoading } = useQuery({
  queryKey: ['payment-forms'],
  queryFn: () => supabase.from('payment_forms').select('*'),
});

// Mutations
const createFormMutation = useMutation({
  mutationFn: (data) => supabase.from('payment_forms').insert(data),
  onSuccess: () => queryClient.invalidateQueries(['payment-forms']),
});
```

---

## Database Migrations

### Creating a Migration

Database changes go through Supabase migrations:

1. Create migration file in `supabase/migrations/`
2. Write SQL for changes
3. Test locally (if using Supabase CLI)
4. Deploy via Supabase Dashboard or CI/CD

**Example Migration:**
```sql
-- 20240101000000_add_receipt_sent_field.sql

ALTER TABLE form_submissions
ADD COLUMN receipt_sent BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN form_submissions.receipt_sent IS 'Whether receipt email was sent';
```

### RLS Policy Conventions

Always create RLS policies for new tables:

```sql
-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- SELECT: Users see their own data
CREATE POLICY "Users can view own data"
ON my_table FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can insert their own data
CREATE POLICY "Users can insert own data"
ON my_table FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own data
CREATE POLICY "Users can update own data"
ON my_table FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own data
CREATE POLICY "Users can delete own data"
ON my_table FOR DELETE
USING (auth.uid() = user_id);
```

---

## Edge Functions

### Creating a New Edge Function

1. Create folder: `supabase/functions/my-function/`
2. Create entry file: `supabase/functions/my-function/index.ts`
3. Add to config if needed: `supabase/config.toml`

**Template:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Your logic here
    const data = await req.json();
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Adding Secrets

Secrets are managed in Supabase Dashboard → Settings → Edge Functions:

1. Go to Supabase Dashboard
2. Navigate to Settings → Edge Functions
3. Add your secret (e.g., `PAYSTACK_SECRET_KEY`)
4. Access in function: `Deno.env.get('PAYSTACK_SECRET_KEY')`

---

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Form creation flow works
- [ ] Form preview matches builder
- [ ] Public payment page loads
- [ ] Payment redirect works (test mode)
- [ ] Analytics display correctly
- [ ] Mobile responsive on all pages

### Test Paystack Integration

Use Paystack test keys and test cards:
- **Card Number:** `4084 0840 8408 4081`
- **Expiry:** Any future date
- **CVV:** `408`
- **PIN:** `0000`
- **OTP:** `123456`

---

## Git Workflow

### Branch Naming

```
feature/add-receipt-designer
bugfix/fix-form-validation
hotfix/payment-webhook-error
chore/update-dependencies
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add receipt PDF generation
fix: resolve form submission error on mobile
docs: update API documentation
style: format code with prettier
refactor: extract FormField component
test: add unit tests for usePaymentForms
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with atomic commits
3. Push branch and open PR
4. Fill out PR template
5. Request review from team member
6. Address review feedback
7. Squash and merge when approved

---

## Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors after DB changes:**
```bash
# Regenerate Supabase types (done automatically in CI)
# Types are in src/integrations/supabase/types.ts (read-only)
```

**Edge function deployment issues:**
- Check `supabase/config.toml` syntax
- Verify all imports use `https://` URLs
- Check function logs in Supabase Dashboard

### Getting Help

1. Check existing GitHub issues
2. Search Supabase documentation
3. Ask in team Slack channel
4. Create new issue with reproduction steps

---

## Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Paystack Documentation](https://paystack.com/docs/)
