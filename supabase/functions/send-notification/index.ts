import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'https://esm.sh/resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const atUsername = Deno.env.get('AFRICAS_TALKING_USERNAME');
const atApiKey = Deno.env.get('AFRICAS_TALKING_API_KEY');
const atSenderId = Deno.env.get('AFRICAS_TALKING_SENDER_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'email' | 'sms' | 'whatsapp' | 'all';
  template:
  | 'transaction-success'
  | 'transaction-failed'
  | 'merchant-payment-received'
  | 'new-form-submission'
  | 'weekly-summary'
  | 'low-balance'
  | 'welcome-email';
  recipient: {
    email?: string;
    phone?: string;
    name: string;
  };
  data: {
    transactionType?: string;
    amount?: string;
    currency?: string;
    reference?: string;
    date?: string;
    reason?: string;
    formName?: string;
    submissionId?: string;
    balance?: string;
    merchantName?: string;
    summaryData?: any;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, template, recipient, data }: NotificationRequest = await req.json();

    console.log('Sending notification:', { type, template, recipient: recipient.name });

    const results: any = {};

    // 1. Send Email (via Resend)
    if (type === 'email' || type === 'all') {
      if (!recipient.email) {
        throw new Error('Email address required for email notifications');
      }

      let html: string;
      let subject: string;

      switch (template) {
        case 'transaction-success':
          subject = `Transaction Successful - ${data.currency} ${data.amount}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #22c55e;">Transaction Successful</h1>
              <p>Hello ${recipient.name},</p>
              <p>Your ${data.transactionType} of <strong>${data.currency} ${data.amount}</strong> was successful.</p>
              <p><strong>Reference:</strong> ${data.reference}</p>
              <p><strong>Date:</strong> ${data.date || new Date().toLocaleString()}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 12px;">ZiroPay - The easiest way to get paid</p>
            </div>
          `;
          break;
        case 'merchant-payment-received':
          subject = `New Payment Received: ${data.currency} ${data.amount}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #f97316;">Payment Received!</h1>
              <p>Hello ${recipient.name},</p>
              <p>You have received a new payment for <strong>${data.currency} ${data.amount}</strong> from <strong>${data.merchantName || 'a customer'}</strong>.</p>
              <p><strong>Form:</strong> ${data.formName || 'General Payment'}</p>
              <p><strong>Reference:</strong> ${data.reference}</p>
              <p><strong>Date:</strong> ${data.date || new Date().toLocaleString()}</p>
              <div style="margin-top: 20px;">
                <a href="https://ziropay.com/dashboard" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 12px;">ZiroPay Business - Powering African Commerce</p>
            </div>
          `;
          break;
        case 'low-balance':
          subject = `Action Required: Low Wallet Balance`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #ef4444;">Low Balance Alert</h1>
              <p>Hello ${recipient.name},</p>
              <p>Your wallet balance is currently <strong>${data.currency} ${data.balance}</strong>, which is below your preferred threshold.</p>
              <p>Please top up your wallet to continue using our services without interruption.</p>
              <div style="margin-top: 20px;">
                <a href="https://ziropay.com/dashboard" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Top Up Now</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 12px;">ZiroPay Security</p>
            </div>
          `;
          break;
        case 'welcome-email':
          subject = `Welcome to ZiroPay, ${recipient.name}! 🚀`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #f97316;">Welcome to ZiroPay!</h1>
              <p>Hello ${recipient.name},</p>
              <p>We're excited to have you on board. ZiroPay is designed to help you manage your digital finances and grow your business with ease.</p>
              <p>Here's what you can do right now:</p>
              <ul>
                <li>Set up your business profile</li>
                <li>Create your first payment form</li>
                <li>Link your bank or MoMo account</li>
              </ul>
              <div style="margin-top: 25px;">
                <a href="https://ziropay.com/onboarding" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
              <p style="color: #6b7280; font-size: 12px;">ZiroPay Team - Accra, Ghana</p>
            </div>
          `;
          break;
        case 'new-form-submission':
          subject = `New Submission: ${data.formName}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #0d9488;">New Form Submission</h1>
              <p>Hello ${recipient.name},</p>
              <p>You have a new submission for your form "<strong>${data.formName}</strong>".</p>
              <p><strong>Payer:</strong> ${data.merchantName || 'Anonymous'}</p>
              <p><strong>Amount:</strong> ${data.currency} ${data.amount}</p>
              <p><strong>Submission ID:</strong> ${data.reference}</p>
              <div style="margin-top: 20px;">
                <a href="https://ziropay.com/dashboard/forms" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Submissions</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 12px;">ZiroPay Forms</p>
            </div>
          `;
          break;
        case 'weekly-summary':
          subject = `Your ZiroPay Weekly Summary 📊`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #f97316;">Weekly Activity Report</h1>
              <p>Hello ${recipient.name},</p>
              <p>Here is a summary of your business activity for the past week:</p>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Total Revenue:</strong> GHS ${data.amount || '0.00'}</p>
                <p style="margin: 5px 0;"><strong>New Submissions:</strong> ${data.reference || '0'}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> Healthy ✅</p>
              </div>
              <p>Keep up the great work!</p>
              <div style="margin-top: 20px;">
                <a href="https://ziropay.com/dashboard" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 12px;">ZiroPay Insights</p>
            </div>
          `;
          break;
        default:
          subject = `Notification from ZiroPay`;
          html = `<p>Hello ${recipient.name}, you have a new notification.</p>`;
      }

      const emailResult = await resend.emails.send({
        from: 'ZiroPay <finance@ziropay.com>', // Branded sender
        to: [recipient.email],
        subject,
        html,
      });

      results.email = emailResult;
      console.log('Email sent:', emailResult);
    }

    // 2. Send SMS or WhatsApp (via Africa's Talking)
    if (type === 'sms' || type === 'whatsapp' || type === 'all') {
      if (!recipient.phone) {
        throw new Error('Phone number required for SMS/WhatsApp notifications');
      }

      let message: string;
      switch (template) {
        case 'transaction-success':
          message = `ZiroPay: Your payment of ${data.currency} ${data.amount} was successful. Ref: ${data.reference}`;
          break;
        case 'merchant-payment-received':
          message = `ZiroPay: New payment received! You've been credited ${data.currency} ${data.amount} for "${data.formName}". Ref: ${data.reference}`;
          break;
        case 'low-balance':
          message = `ZiroPay Alert: Your balance is low (${data.currency} ${data.balance}). Please top up to avoid interruptions.`;
          break;
        default:
          message = `ZiroPay: You have a new notification for your account.`;
      }

      // Africa's Talking API call
      // For WhatsApp, Africa's Talking uses the same messaging endpoint but requires the 'from' number to be a WhatsApp-enabled number
      const smsResult = await fetch(
        'https://api.africastalking.com/version1/messaging',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': atApiKey!,
          },
          body: new URLSearchParams({
            username: atUsername || 'sandbox',
            to: recipient.phone,
            message: message,
            // If type is whatsapp, we use a different senderID/Channel if provided
            ...(type === 'whatsapp' ? { from: 'WhatsAppNumber' } : (atSenderId ? { from: atSenderId } : {})),
          }),
        }
      );

      const smsData = await smsResult.json();
      results.messaging = smsData;
      console.log(`${type.toUpperCase()} sent:`, smsData);
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
