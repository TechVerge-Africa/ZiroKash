# Quick Deployment Guide 🚀

## Step 1: Add API Key in Supabase Dashboard
👉 **Go here**: https://supabase.com/dashboard/project/kbhyqypwwmkvssrcbfdb/functions/secrets

1. Click **"Add Secret"**
2. **Name**: `GEMINI_API_KEY`
3. **Value**: `AIzaSyBybK2cma3MkVkwd47sIfH0Mk8uCVSwtPo`
4. Click **"Save"**

## Step 2: Deploy Edge Function

```bash
# Install Supabase CLI (one-time)
npm install -g supabase

# Link to your project (one-time)
supabase link --project-ref kbhyqypwwmkvssrcbfdb

# Deploy the function
supabase functions deploy generate-form-ai
```

## ✅ Done!
Your AI form generator is now secure - API key is server-side only!

## Test It
Go to your app → "Create Payment Form" → "AI Generator" → Try: "simple payment for my store"
