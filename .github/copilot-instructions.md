# ZiroKash AI Agent Instructions

## Project Overview
ZiroKash is a pan-African digital payment platform built with React + TypeScript, featuring:
- Web interface using Vite + React + TypeScript
- Supabase for auth, database, and real-time features
- shadcn/ui component library with Tailwind CSS
- React Query for server state management
- React Router for navigation

## Key Architecture Patterns

### 1. Authentication & Context
- Authentication managed via `AuthContext` + `useAuth` hook (`src/hooks/useAuth.tsx`)
- Global auth state accessible throughout app
- Protected routes wrapped with `ProtectedRoute` component

### 2. Data Flow Patterns
- React Query for server state + Context for UI state
- Domain-specific hooks (`useWallet`, `useCrypto`, etc.) encapsulate business logic
- Supabase client singleton for database operations (`src/integrations/supabase/client.ts`)

### 3. Component Structure
- UI components in `src/components/ui/*` - all shadcn components 
- Feature components organized by domain (`auth/`, `payment/`, `wallet/`, etc.)
- Layout components (`MainLayout`, `Header`, `Sidebar`) handle responsive design

## Common Development Workflows

### Setting Up Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Configure Supabase
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
```

### Key File Locations
- Components: `src/components/` 
- Hooks: `src/hooks/`
- Pages: `src/pages/`
- Types: `src/integrations/supabase/types.ts`
- Supabase: `supabase/` (migrations)

## Project-Specific Conventions

### State Management
- Use React Query for server state/API calls
- Use React Context for global UI state
- Local state via hooks for component-specific logic

### Component Patterns
- Use shadcn/ui components as base building blocks
- Extend with Tailwind classes for custom styling
- Mobile-first responsive design using Tailwind breakpoints
- Use hooks for complex stateful logic

### Supabase Integration
- All direct DB access through domain hooks
- Types generated from Supabase schema
- Real-time subscriptions for live updates
- Row Level Security enforced in database

## Cross-Component Communication

### Event Flow
1. User actions trigger hook methods
2. Hooks update Supabase/API
3. Real-time subscriptions sync state
4. UI updates via React Query cache

### Key Integration Points
- Auth state changes -> `AuthContext` -> Protected routes
- Wallet operations -> `useWallet` -> Balance updates
- Payments -> Payment hooks -> Transaction history
- Settings -> Theme context -> UI updates

## Common Development Tasks

### Adding New Features
1. Create new hook in `src/hooks/` if needed
2. Add components in domain folder
3. Update types in `types.ts` if adding tables
4. Add route in `App.tsx` if new page
5. Update Supabase schemas if needed

### Working with Components
- Use shadcn/ui components from `ui/` folder
- Follow mobile-first responsive patterns
- Handle loading/error states
- Use TypeScript types from Supabase

### Debugging Tips
- Check React Query dev tools for API state
- Verify Supabase real-time connections
- Confirm auth context state
- Check mobile/desktop layouts separately