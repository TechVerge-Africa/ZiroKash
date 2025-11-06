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
  type: 'email' | 'sms' | 'both' | 'merchant_application' | 'merchant_approved';
  template?: 'transaction-success' | 'transaction-failed';
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
    businessName?: string;
    businessType?: string;
    applicantEmail?: string;
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

    // Handle merchant-specific emails
    if (type === 'merchant_application') {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0056D2 0%, #004aad 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to ZiroPay!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-top: 0;">Dear ${data.businessName},</p>
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for applying to become a ZiroPay merchant. We have received your application and our team will review it within <strong>24 hours</strong>.
            </p>
            <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0056D2;">
              <h3 style="margin-top: 0; color: #0056D2;">Application Details</h3>
              <p style="margin: 5px 0;"><strong>Business Name:</strong> ${data.businessName}</p>
              <p style="margin: 5px 0;"><strong>Business Type:</strong> ${data.businessType}</p>
              <p style="margin: 5px 0;"><strong>Contact Email:</strong> ${data.applicantEmail}</p>
            </div>
            <div style="background-color: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #0056D2;">What Happens Next?</h3>
              <ul style="line-height: 1.8; padding-left: 20px;">
                <li>Our team reviews your application</li>
                <li>You'll receive an approval email within 24 hours</li>
                <li>Set up your security PIN</li>
                <li>Start creating payment forms and accepting payments!</li>
              </ul>
            </div>
            <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #0056D2;">Once Approved, You'll Be Able To:</h3>
              <ul style="line-height: 1.8; padding-left: 20px;">
                <li>✓ Create custom payment forms for fees, donations, and services</li>
                <li>✓ Accept payments from students, members, or donors</li>
                <li>✓ Track all transactions in real-time with detailed analytics</li>
                <li>✓ Generate branded receipts automatically</li>
                <li>✓ Share payment links via WhatsApp, email, or social media</li>
              </ul>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you have any questions, please don't hesitate to contact our support team.
            </p>
            <p style="font-size: 16px; margin-top: 20px;">
              Best regards,<br>
              <strong>The ZiroPay Team</strong>
            </p>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 ZiroPay. Simplifying payments across Ghana.</p>
          </div>
        </div>
      `;

      const emailResult = await resend.emails.send({
        from: 'ZiroPay <onboarding@resend.dev>',
        to: [recipient.email!],
        subject: 'Application Received - ZiroPay Merchant Account 🎉',
        html,
      });

      results.email = emailResult;
      console.log('Merchant application email sent:', emailResult);
    } else if (type === 'merchant_approved') {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations! You're Approved!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-top: 0;">Dear ${data.businessName},</p>
            <p style="font-size: 16px; line-height: 1.6;">
              <strong>Great news!</strong> Your ZiroPay merchant application has been approved. You can now start accepting payments and managing your finances effortlessly.
            </p>
            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4caf50; text-align: center;">
              <h2 style="margin: 0; color: #2e7d32; font-size: 24px;">✓ Your Account is Now Active</h2>
              <p style="margin: 10px 0 0 0; color: #2e7d32; font-size: 14px;">You can now access all merchant features</p>
            </div>
            <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #0056D2;">🚀 Next Steps:</h3>
              <ol style="line-height: 2; padding-left: 20px; font-size: 16px;">
                <li>Log in to your ZiroPay dashboard</li>
                <li>Set up your security PIN (if you haven't already)</li>
                <li>Create your first payment form</li>
                <li>Share the payment link with your payers</li>
                <li>Start receiving payments instantly!</li>
              </ol>
            </div>
            <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3 style="margin-top: 0; color: #856404;">💡 Pro Tips:</h3>
              <ul style="line-height: 1.8; padding-left: 20px; font-size: 14px; color: #856404;">
                <li>Customize your payment forms with your organization's branding</li>
                <li>Use descriptive form titles to help payers identify the payment</li>
                <li>Enable automatic receipt generation for better record-keeping</li>
                <li>Monitor your analytics to track payment trends</li>
              </ul>
            </div>
            <p style="font-size: 16px; margin-top: 30px;">
              Welcome to the ZiroPay family! We're excited to have you on board.
            </p>
            <p style="font-size: 16px; margin-top: 20px;">
              Best regards,<br>
              <strong>The ZiroPay Team</strong>
            </p>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 ZiroPay. Simplifying payments across Ghana.</p>
          </div>
        </div>
      `;

      const emailResult = await resend.emails.send({
        from: 'ZiroPay <onboarding@resend.dev>',
        to: [recipient.email!],
        subject: '🎉 Approved! Start Accepting Payments with ZiroPay',
        html,
      });

      results.email = emailResult;
      console.log('Merchant approval email sent:', emailResult);
    }
    // Handle transaction emails
    else if (type === 'email' || type === 'both') {
      if (!recipient.email) {
        throw new Error('Email address required for email notifications');
      }

      let html: string;
      let subject: string;

      if (template === 'transaction-success') {
        html = await renderAsync(
          React.createElement(TransactionSuccessEmail, {
            recipientName: recipient.name,
            transactionType: data.transactionType!,
            amount: data.amount!,
            currency: data.currency!,
            reference: data.reference!,
            date: data.date || new Date().toLocaleString(),
          })
        );
        subject = `Transaction Successful - ${data.currency} ${data.amount}`;
      } else {
        html = await renderAsync(
          React.createElement(TransactionFailedEmail, {
            recipientName: recipient.name,
            transactionType: data.transactionType!,
            amount: data.amount!,
            currency: data.currency!,
            reference: data.reference!,
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
