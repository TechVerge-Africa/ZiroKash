# AI Deployment Troubleshooting 🔧

## "AI Generation Failed" Errors?

If you see errors like `models/gemini-... is not found`, it usually means:

1. **API Key Issues**:
   - The key might be for a project that doesn't have the Generative Language API enabled
   - The key might be restricted to specific IPs (Edge Functions have dynamic IPs)
   - The key might have expired or hit quota limits

2. **Fixing It**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a **new** API key (unrestricted)
   - Update it in Supabase:
     ```bash
     supabase secrets set GEMINI_API_KEY=new_key_here
     ```

## Robustness Features Built-in 🛡️

Your AI service is now super robust! It automatically tries **5 different configurations** if one fails:

1. `gemini-1.5-flash` (v1beta)
2. `gemini-1.5-flash-latest` (v1beta)
3. `gemini-1.5-pro` (v1beta)
4. `gemini-pro` (v1)
5. `gemini-1.0-pro` (v1beta)

This "self-healing" capability means it will keep working even if Google changes model names or versions!
