import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'email' | 'sms' | 'whatsapp' | 'all';
  template: string;
  recipient: {
    email?: string;
    phone?: string;
    name?: string;
  };
  data: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    const { type, template, recipient, data }: NotificationRequest = await req.json();

    // Currently only handling Email
    if (!recipient.email) {
      console.log('No email recipient provided, skipping email.');
      return new Response(JSON.stringify({ skipped: true }), { headers: corsHeaders });
    }

    let subject = '';
    let html = '';

    // Template Engine
    if (template === 'transaction-success') {
      subject = `Payment Receipt - ${data.reference}`;
      html = `
         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
           <div style="text-align: center; margin-bottom: 20px;">
             <h2 style="color: #0f172a;">Payment Successful</h2>
           </div>
           <p>Hi ${recipient.name || 'there'},</p>
           <p>Your payment was successfully processed.</p>
           
           <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
             <p style="margin: 5px 0;"><strong>Amount:</strong> ${data.currency} ${data.amount}</p>
             <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
             <p style="margin: 5px 0;"><strong>Reference:</strong> ${data.reference}</p>
           </div>
           
           <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
           <p style="color: #64748b; font-size: 14px;">Thank you for using ZiroKash.</p>
         </div>
       `;
    } else if (template === 'merchant-payment-received') {
      subject = `💸 Payment Received: ${data.currency} ${data.amount}`;
      html = `
         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
           <div style="text-align: center; margin-bottom: 20px;">
             <h2 style="color: #0f172a;">You got paid!</h2>
           </div>
           <p>Hi ${recipient.name},</p>
           <p>Good news! You just received a payment.</p>
           
           <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #bbf7d0;">
             <p style="margin: 5px 0; font-size: 18px; color: #166534;"><strong>${data.currency} ${data.amount}</strong></p>
             <p style="margin: 5px 0;"><strong>From:</strong> ${data.merchantName}</p>
             <p style="margin: 5px 0;"><strong>Form:</strong> ${data.formName}</p>
           </div>
           
           <p>Reference: ${data.reference}</p>
           <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
           <a href="https://zirokash.africa/dashboard" style="display: inline-block; background-color: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Dashboard</a>
         </div>
       `;
    } else {
      throw new Error(`Unknown template: ${template}`);
    }

    console.log(`Sending email to ${recipient.email} [${template}]`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ZiroKash <noreply@zirokash.africa>', // Must be verified in Resend, or use 'onboarding@resend.dev' for testing
        to: recipient.email,
        subject: subject,
        html: html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Resend API Error:', result);
      throw new Error(result.message || 'Failed to send email via Resend');
    }

    console.log('Email sent successfully:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Notification Function Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
