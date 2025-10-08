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
  type: 'email' | 'sms' | 'both';
  template: 'transaction-success' | 'transaction-failed';
  recipient: {
    email?: string;
    phone?: string;
    name: string;
  };
  data: {
    transactionType: string;
    amount: string;
    currency: string;
    reference: string;
    date?: string;
    reason?: string;
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
