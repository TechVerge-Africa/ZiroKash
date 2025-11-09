import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { TransactionSuccessEmail } from './_templates/transaction-success.tsx';
import { TransactionFailedEmail } from './_templates/transaction-failed.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'email' | 'sms' | 'both' | 'merchant_approved' | 'merchant_application' | 'payment_success';
  template?: 'transaction-success' | 'transaction-failed';
  recipient?: {
    email?: string;
    phone?: string;
    name: string;
  };
  user_id?: string;
  merchant_id?: string;
  data: {
    transactionType?: string;
    amount?: string | number;
    currency?: string;
    reference?: string;
    date?: string;
    reason?: string;
    business_name?: string;
    merchant_type?: string;
    payer_name?: string;
    payer_email?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, template, recipient, data, user_id }: NotificationRequest = await req.json();

    console.log('Sending notification:', { type, template, user_id });

    const results: any = {};
    
    // Handle merchant-specific notifications
    if (type === 'merchant_approved' || type === 'merchant_application') {
      if (!user_id) {
        throw new Error('User ID required for merchant notifications');
      }
      
      // Get user email from Supabase Auth
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(user_id);
      
      if (userError || !user?.email) {
        throw new Error('User email not found');
      }
      
      let html: string;
      let subject: string;
      
      if (type === 'merchant_approved') {
        html = `
          <!DOCTYPE html>
          <html>
            <head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}.header{background:#10b981;color:white;padding:20px;text-align:center;border-radius:8px}.content{background:#f9fafb;padding:30px;margin-top:20px;border-radius:8px}.button{background:#10b981;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px}.footer{margin-top:30px;text-align:center;color:#666;font-size:12px}</style></head>
            <body>
              <div class="header"><h1>🎉 Congratulations!</h1></div>
              <div class="content">
                <h2>Your ZiroPay Merchant Account is Approved!</h2>
                <p>Dear Merchant,</p>
                <p>Great news! Your <strong>${data.business_name}</strong> (${data.merchant_type}) merchant account has been approved and is now active.</p>
                <p><strong>You can now:</strong></p>
                <ul>
                  <li>✅ Create payment forms</li>
                  <li>✅ Accept payments from customers</li>
                  <li>✅ Track your transactions</li>
                  <li>✅ Manage your merchant wallet</li>
                </ul>
                <a href="https://zirokash.lovable.app/ziropay" class="button">Get Started →</a>
              </div>
              <div class="footer"><p>ZiroKash - Ghana's Premier Fintech Platform</p></div>
            </body>
          </html>
        `;
        subject = `🎉 Your ZiroPay Merchant Account is Approved!`;
      } else {
        html = `
          <!DOCTYPE html>
          <html>
            <head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}.header{background:#3b82f6;color:white;padding:20px;text-align:center;border-radius:8px}.content{background:#f9fafb;padding:30px;margin-top:20px;border-radius:8px}.footer{margin-top:30px;text-align:center;color:#666;font-size:12px}</style></head>
            <body>
              <div class="header"><h1>Application Received!</h1></div>
              <div class="content">
                <h2>Thank You for Applying to ZiroPay</h2>
                <p>Dear ${data.business_name},</p>
                <p>We've received your merchant application and your account is being set up.</p>
                <p><strong>What's Next:</strong></p>
                <ul>
                  <li>✅ Your application is under review</li>
                  <li>⏱️ You'll receive approval within 24 hours</li>
                  <li>📧 Check your email for updates</li>
                </ul>
                <p>Once approved, you can start accepting payments immediately!</p>
              </div>
              <div class="footer"><p>ZiroKash - Ghana's Premier Fintech Platform</p></div>
            </body>
          </html>
        `;
        subject = `Application Received - ${data.business_name}`;
      }
      
      const emailResult = await resend.emails.send({
        from: 'ZiroKash <onboarding@resend.dev>',
        to: [user.email],
        subject,
        html,
      });
      
      results.email = emailResult;
      console.log('Merchant notification sent:', emailResult);
      
      return new Response(
        JSON.stringify({ success: true, results }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Handle payment success notifications
    if (type === 'payment_success') {
      if (!user_id) {
        throw new Error('User ID required for payment notifications');
      }
      
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(user_id);
      
      if (userError || !user?.email) {
        throw new Error('User email not found');
      }
      
      const html = `
        <!DOCTYPE html>
        <html>
          <head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}.header{background:#10b981;color:white;padding:20px;text-align:center;border-radius:8px}.content{background:#f9fafb;padding:30px;margin:20px 0;border-radius:8px}.amount{font-size:32px;font-weight:bold;color:#10b981;margin:20px 0}.details{background:white;padding:15px;border-radius:6px;margin:15px 0}.footer{text-align:center;color:#666;font-size:12px}</style></head>
          <body>
            <div class="header"><h1>💰 Payment Received!</h1></div>
            <div class="content">
              <h2>You've received a payment</h2>
              <div class="amount">GH₵ ${data.amount}</div>
              <div class="details">
                <p><strong>From:</strong> ${data.payer_name}</p>
                <p><strong>Email:</strong> ${data.payer_email}</p>
                <p><strong>Reference:</strong> ${data.reference}</p>
              </div>
              <p>The funds have been credited to your merchant wallet.</p>
            </div>
            <div class="footer"><p>ZiroKash - Ghana's Premier Fintech Platform</p></div>
          </body>
        </html>
      `;
      
      const emailResult = await resend.emails.send({
        from: 'ZiroKash Payments <payments@resend.dev>',
        to: [user.email],
        subject: `Payment Received - GH₵ ${data.amount}`,
        html,
      });
      
      results.email = emailResult;
      console.log('Payment notification sent:', emailResult);
      
      return new Response(
        JSON.stringify({ success: true, results }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Handle standard transaction notifications
    if (!recipient) {
      throw new Error('Recipient required for standard notifications');
    }

    // Send Email
    if (type === 'email' || type === 'both') {
      if (!recipient.email) {
        throw new Error('Email address required for email notifications');
      }

      let html: string;
      let subject: string;

      if (template === 'transaction-success') {
        html = await renderAsync(
          React.createElement(TransactionSuccessEmail, {
            recipientName: recipient.name,
            transactionType: data.transactionType,
            amount: data.amount,
            currency: data.currency,
            reference: data.reference,
            date: data.date || new Date().toLocaleString(),
          })
        );
        subject = `Transaction Successful - ${data.currency} ${data.amount}`;
      } else {
        html = await renderAsync(
          React.createElement(TransactionFailedEmail, {
            recipientName: recipient.name,
            transactionType: data.transactionType,
            amount: data.amount,
            currency: data.currency,
            reference: data.reference,
            reason: data.reason || 'Unknown error',
          })
        );
        subject = `Transaction Failed - Action Required`;
      }

      const emailResult = await resend.emails.send({
        from: 'Finance App <onboarding@resend.dev>',
        to: [recipient.email],
        subject,
        html,
      });

      results.email = emailResult;
      console.log('Email sent:', emailResult);
    }

    // Send SMS
    if (type === 'sms' || type === 'both') {
      if (!recipient.phone) {
        throw new Error('Phone number required for SMS notifications');
      }

      let message: string;

      if (template === 'transaction-success') {
        message = `Finance App: Your ${data.transactionType} of ${data.currency} ${data.amount} was successful. Ref: ${data.reference}`;
      } else {
        message = `Finance App: Your ${data.transactionType} of ${data.currency} ${data.amount} failed. ${data.reason || 'Please contact support'}. Ref: ${data.reference}`;
      }

      const smsResult = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: recipient.phone,
            From: twilioPhoneNumber!,
            Body: message,
          }),
        }
      );

      const smsData = await smsResult.json();
      results.sms = smsData;
      console.log('SMS sent:', smsData);
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
