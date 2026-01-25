import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { description, context, merchantType } = await req.json()

        if (!description) {
            return new Response(
                JSON.stringify({ error: 'Description is required' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Get Gemini API key from Supabase secrets (not exposed to frontend)
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured on server')
        }

        // Build the AI prompt
        const prompt = buildPrompt(description, context, merchantType)

        let lastError = null;
        let generatedText = null;

        // Try using Gemini's OpenAI-compatible endpoint (often more reliable)
        // This removes the confusion about model versions/paths
        try {
            console.log('Trying OpenAI-compatible endpoint...');
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GEMINI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gemini-1.5-flash",
                        messages: [
                            {
                                role: "system",
                                content: "You are a JSON form generator. Return ONLY valid JSON."
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        temperature: 0.3
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    generatedText = content;
                    console.log('Success with OpenAI-compatible endpoint');
                }
            } else {
                const errorData = await response.json();
                lastError = errorData;
                console.warn('OpenAI endpoint failed:', errorData);
            }
        } catch (err) {
            console.warn('OpenAI endpoint network error:', err);
            lastError = err;
        }

        // Fallback to standard Google API if OpenAI endpoint fails
        if (!generatedText) {
            // List of model/version combinations to try in order of preference
            const attempts = [
                { model: 'gemini-1.5-flash', version: 'v1beta' },
                { model: 'gemini-1.5-flash-latest', version: 'v1beta' },
                { model: 'gemini-pro', version: 'v1' },
            ];

            for (const attempt of attempts) {
                // ... (existing loop logic, kept for fallback)
                try {
                    console.log(`Fallback: Trying ${attempt.model} on ${attempt.version}`);
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${GEMINI_API_KEY}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }],
                                generationConfig: { temperature: 0.3 }
                            }),
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                            generatedText = data.candidates[0].content.parts[0].text;
                            console.log(`Fallback Success with ${attempt.model} on ${attempt.version}`);
                            break;
                        }
                    } else {
                        const errorData = await response.json();
                        lastError = errorData;
                        console.warn(`Fallback ${attempt.model} on ${attempt.version} failed:`, errorData);
                    }
                } catch (err) {
                    console.warn(`Fallback network error for ${attempt.model}:`, err);
                    lastError = err;
                }
            }
        }

        if (!generatedText) {
            console.error('All strategies failed. Last error:', lastError);
            throw new Error(`AI generation failed. Last error: ${JSON.stringify(lastError)}`);
        }

        // Parse and validate the response
        const formData = parseAIResponse(generatedText)

        return new Response(
            JSON.stringify(formData),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Failed to generate form' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

function buildPrompt(description: string, context?: string, merchantType?: string): string {
    return `You are an expert payment form designer helping novice users create professional payment collection forms.

<role>
You transform simple, everyday language into complete payment forms. Users might say things like "I need to collect money from students" or "payment form for my shop" - and you make it work perfectly.
</role>

<user_request>
"${description}"
${context ? `\nAdditional context: ${context}` : ""}
${merchantType ? `\nBusiness type: ${merchantType}` : ""}
</user_request>

<task>
1. **Understand the intent**: What is the user trying to collect payment for?
2. **Identify the use case**: Is it for a school, business, donation, event, or other purpose?
3. **Determine required information**: What details do they need to collect from payers?
4. **Create appropriate fields**: Only include fields that make sense for this specific use case
5. **Output valid JSON**: Return ONLY a JSON object with the exact structure below
</task>

<examples>
Example 1 - Simple Input:
User: "payment for my store"
Reasoning: They need a quick, simple form for in-store payments
Output:
{
  "title": "Store Payment",
  "description": "Complete your payment",
  "receiptHeader": "PAYMENT RECEIPT",
  "themeColor": "#0056D2",
  "category": "business",
  "fields": [
    {"type": "text", "label": "Your Name", "required": true},
    {"type": "amount", "label": "Amount", "required": true}
  ]
}

Example 2 - School Fees:
User: "collect school fees with student ID and class"
Reasoning: School needs to track which student paid, what class they're in
Output:
{
  "title": "School Fees Payment",
  "description": "Pay your school fees online",
  "receiptHeader": "SCHOOL FEES RECEIPT",
  "themeColor": "#0056D2",
  "category": "education",
  "fields": [
    {"type": "text", "label": "Student Name", "required": true},
    {"type": "text", "label": "Student ID", "required": true},
    {"type": "text", "label": "Class/Grade", "required": true},
    {"type": "text", "label": "Parent Phone", "required": true},
    {"type": "amount", "label": "Amount", "required": true}
  ]
}

Example 3 - Donations:
User: "anonymous donation for church"
Reasoning: Anonymous means minimal fields, just amount
Output:
{
  "title": "Make a Donation",
  "description": "Support our mission",
  "receiptHeader": "DONATION RECEIPT",
  "themeColor": "#10B981",
  "category": "nonprofit",
  "fields": [
    {"type": "dropdown", "label": "Donation Purpose", "required": false, "options": ["General Fund", "Building Project", "Mission", "Other"]},
    {"type": "amount", "label": "Donation Amount", "required": true}
  ]
}

Example 4 - Event Tickets:
User: "event registration with ticket types"
Reasoning: Need to collect attendee info and let them choose ticket tier
Output:
{
  "title": "Event Registration",
  "description": "Register and pay for the event",
  "receiptHeader": "EVENT TICKET",
  "themeColor": "#7C3AED",
  "category": "events",
  "fields": [
    {"type": "text", "label": "Full Name", "required": true},
    {"type": "email", "label": "Email", "required": true},
    {"type": "text", "label": "Phone Number", "required": true},
    {"type": "dropdown", "label": "Ticket Type", "required": true, "options": ["General - ₵100", "VIP - ₵300"]},
    {"type": "amount", "label": "Total Amount", "required": true}
  ]
}
</examples>

<critical_rules>
1. **Always include an "amount" field** - This is a payment form!
2. **Keep it simple for simple requests** - If user says "payment for shop", don't add 10 fields
3. **Match the use case** - School forms need student info, donations might be anonymous, stores need minimal info
4. **Use dropdowns wisely** - Only when there are clear predefined options (ticket types, departments, etc.)
5. **Email is important** - Include email for most cases (except anonymous donations or simple QR payments)
6. **Required vs Optional** - Name, amount always required. Email usually required. Other fields depend on use case.
</critical_rules>

<field_types>
- "text": For any text input (names, IDs, addresses, etc.)
- "email": Specifically for email addresses
- "dropdown": For predefined choices (ticket types, classes, categories)
- "amount": For payment amounts (ALWAYS required, ALWAYS include)
</field_types>

<theme_colors>
- Education/Schools: "#0056D2" (professional blue)
- Events/Entertainment: "#7C3AED" (vibrant purple)
- Donations/Charity: "#10B981" (trustworthy green)
- Business/Professional: "#0F172A" (sleek dark)
- General: "#0056D2" (default blue)
</theme_colors>

<categories>
Choose ONE: "quick", "education", "business", "nonprofit", "events", "other"
</categories>

<json_structure>
Return ONLY this JSON structure, nothing else:
{
  "title": "Clear, concise form title",
  "description": "One sentence explaining what this form is for",
  "receiptHeader": "UPPERCASE RECEIPT HEADER",
  "themeColor": "#HEXCOLOR",
  "category": "one of the categories above",
  "fields": [
    {
      "type": "text|email|dropdown|amount",
      "label": "Clear field label",
      "required": true,
      "options": ["only", "for", "dropdown"] // only if type is dropdown
    }
  ]
}
</json_structure>

<output_instructions>
- Return ONLY the JSON object
- No markdown code blocks
- No explanations before or after
- Valid JSON syntax
- Include 2-6 fields (less for simple, more for complex)
- Always include "amount" field as the last field
</output_instructions>

Now generate the form for the user's request above:`
}

function parseAIResponse(text: string) {
    try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No JSON found in AI response')
        }

        const parsed = JSON.parse(jsonMatch[0])

        // Validate required fields
        if (!parsed.title || !parsed.fields || !Array.isArray(parsed.fields)) {
            throw new Error('Invalid form structure from AI')
        }

        // Set defaults for missing fields
        return {
            title: parsed.title,
            description: parsed.description || 'Please complete the payment form below',
            receiptHeader: parsed.receiptHeader || 'PAYMENT RECEIPT',
            themeColor: parsed.themeColor || '#0056D2',
            category: parsed.category,
            fields: parsed.fields.map((field: any, index: number) => ({
                type: field.type || 'text',
                label: field.label || `Field ${index + 1}`,
                required: field.required !== false,
                options: field.options,
                defaultValue: field.type === 'amount' ? '0' : field.defaultValue,
            })),
        }
    } catch (error) {
        console.error('Failed to parse AI response:', error)
        console.log('Raw response:', text)
        throw new Error('Failed to parse AI-generated form. Please try again.')
    }
}
