# AI Edge Function Deployment Guide

## What Changed 🔐

**Security Improvement**: Gemini API key moved from frontend to secure backend!

- ❌ **Before**: API key in frontend `.env` (exposed in browser, insecure)
- ✅ **After**: API key in Supabase secrets (server-side only, secure)

## Files Created

1. **Edge Function**: `supabase/functions/generate-form-ai/index.ts`
   - Handles AI form generation server-side
   - API key never exposed to frontend
   
2. **CORS Helper**: `supabase/functions/_shared/cors.ts`
   - Handles cross-origin requests

3. **Updated Service**: `src/services/aiFormGenerator.ts`
   - Now calls Edge Function instead of Gemini directly

## Deployment Steps

### Method 1: Using Supabase Dashboard (Recommended - Easiest!)

**Step 1: Add the API Key in Dashboard**
1. Go to: https://supabase.com/dashboard/project/kbhyqypwwmkvssrcbfdb/functions/secrets
2. Click "Add Secret"
3. Name: `GEMINI_API_KEY`
4. Value: `AIzaSyBybK2cma3MkVkwd47sIfH0Mk8uCVSwtPo`
5. Click "Save"

**Step 2: Deploy the Edge Function**
1. Install Supabase CLI (if not already):
   ```bash
   npm install -g supabase
   ```

2. Link to your project:
   ```bash
   supabase link --project-ref kbhyqypwwmkvssrcbfdb
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy generate-form-ai
   ```

**That's it!** The AI form generator will now work securely.

### Method 2: Using CLI Only (Alternative)
```bash
supabase secrets set GEMINI_API_KEY=AIzaSyBybK2cma3MkVkwd47sIfH0Mk8uCVSwtPo
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy generate-form-ai
```

### 5. Verify the function is running
```bash
supabase functions list
```

## Testing the Edge Function

You can test it manually with curl:
```bash
curl -i --location --request POST 'https://kbhyqypwwmkvssrcbfdb.supabase.co/functions/v1/generate-form-ai' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "description": "simple payment for my store"
  }'
```

## How It Works Now

1. **User Input**: User types "school fees with student ID"
2. **Frontend**: Calls `supabase.functions.invoke('generate-form-ai', ...)`
3. **Edge Function**: Receives request, uses server-side API key
4. **Gemini AI**: Generates form structure
5. **Response**: Sent back to frontend (API key never exposed!)

## Security Benefits

✅ **API Key Hidden**: Never sent to browser  
✅ **Server-Side Only**: Runs in Supabase's secure environment  
✅ **No Rate Limit Exposure**: Users can't abuse your API quota  
✅ **Audit Trail**: All requests logged by Supabase  

## Rollback (if needed)

If deployment fails, the frontend will use the fallback `generateBasicForm()` function which creates simple forms based on keywords.

## Next Time

To update the Edge Function code:
```bash
supabase functions deploy generate-form-ai
```

To change the API key:
```bash
supabase secrets set GEMINI_API_KEY=new_key_here
```
