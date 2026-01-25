// AI Form Generator Service
// Calls secure Supabase Edge Function (API key stored server-side for security)

import { supabase } from "@/integrations/supabase/client";

interface AIFormRequest {
    description: string;
    context?: string;
    merchantType?: string;
}

interface FormField {
    type: "text" | "email" | "dropdown" | "amount";
    label: string;
    required: boolean;
    options?: string[];
    defaultValue?: string;
}

interface AIFormResponse {
    title: string;
    description: string;
    fields: FormField[];
    receiptHeader: string;
    themeColor: string;
    category?: string;
}

/**
 * Generate a payment form using AI
 * Calls secure Supabase Edge Function - API key is never exposed to frontend
 */
export async function generateFormWithAI(request: AIFormRequest): Promise<AIFormResponse> {
    try {
        // Call secure Supabase Edge Function (API key is server-side only - secure!)
        const { data, error } = await supabase.functions.invoke('generate-form-ai', {
            body: {
                description: request.description,
                context: request.context,
                merchantType: request.merchantType,
            },
        });

        if (error) {
            console.error('Edge Function Error:', error);
            throw new Error(error.message || 'Failed to generate form');
        }

        if (!data) {
            throw new Error('No response from AI service');
        }

        return data as AIFormResponse;
    } catch (error) {
        console.error('AI Form Generation Error:', error);
        throw error;
    }
}

// Fallback: Generate a basic form from keywords if AI fails
export function generateBasicForm(description: string): AIFormResponse {
    const lowerDesc = description.toLowerCase();

    // Detect category
    let category = "other";
    let themeColor = "#0056D2";
    let receiptHeader = "PAYMENT RECEIPT";

    if (lowerDesc.includes("school") || lowerDesc.includes("student") || lowerDesc.includes("education")) {
        category = "education";
        themeColor = "#0056D2";
        receiptHeader = "SCHOOL FEES RECEIPT";
    } else if (lowerDesc.includes("event") || lowerDesc.includes("ticket") || lowerDesc.includes("conference")) {
        category = "events";
        themeColor = "#7C3AED";
        receiptHeader = "EVENT TICKET RECEIPT";
    } else if (lowerDesc.includes("donation") || lowerDesc.includes("charity") || lowerDesc.includes("church")) {
        category = "nonprofit";
        themeColor = "#10B981";
        receiptHeader = "DONATION RECEIPT";
    } else if (lowerDesc.includes("invoice") || lowerDesc.includes("business") || lowerDesc.includes("service")) {
        category = "business";
        themeColor = "#0F172A";
        receiptHeader = "PAYMENT RECEIPT";
    }

    return {
        title: description.length > 50 ? description.substring(0, 50) + "..." : description,
        description: "Please complete the payment form below",
        receiptHeader,
        themeColor,
        category,
        fields: [
            { type: "text", label: "Full Name", required: true },
            { type: "email", label: "Email Address", required: true },
            { type: "text", label: "Phone Number", required: false },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    };
}
