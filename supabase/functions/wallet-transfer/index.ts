import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransferRequest {
  to_wallet_id: string;
  amount: number; // In currency units (will be converted to cents)
  description?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { to_wallet_id, amount, description }: TransferRequest = await req.json();

    // Validate input
    if (!to_wallet_id || !amount || amount <= 0) {
      throw new Error('Invalid transfer parameters');
    }

    // Convert amount to cents (bigint)
    const amountInCents = BigInt(Math.round(amount * 100));
    const transferFee = BigInt(500); // 5 NGN fee

    // Get sender's main wallet
    const { data: fromWallet, error: fromWalletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('wallet_type', 'main')
      .single();

    if (fromWalletError || !fromWallet) {
      throw new Error('Sender wallet not found');
    }

    // Check if sender has sufficient balance
    const currentBalance = BigInt(fromWallet.balance);
    const totalDebit = amountInCents + transferFee;

    if (currentBalance < totalDebit) {
      throw new Error('Insufficient balance');
    }

    // Get recipient wallet
    const { data: toWallet, error: toWalletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('id', to_wallet_id)
      .single();

    if (toWalletError || !toWallet) {
      throw new Error('Recipient wallet not found');
    }

    // Start transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'p2p',
        amount: amountInCents.toString(),
        transaction_fee: transferFee.toString(),
        from_wallet_id: fromWallet.id,
        to_wallet_id: toWallet.id,
        description,
        status: 'processing',
        currency: fromWallet.currency
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error('Failed to create transaction');
    }

    try {
      // Debit sender's wallet
      const newFromBalance = (currentBalance - totalDebit).toString();
      const { error: debitError } = await supabase
        .from('wallets')
        .update({ balance: newFromBalance })
        .eq('id', fromWallet.id);

      if (debitError) throw debitError;

      // Credit recipient's wallet
      const recipientBalance = BigInt(toWallet.balance);
      const newToBalance = (recipientBalance + amountInCents).toString();
      const { error: creditError } = await supabase
        .from('wallets')
        .update({ balance: newToBalance })
        .eq('id', toWallet.id);

      if (creditError) throw creditError;

      // Mark transaction as completed
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) throw updateError;

      // Fraud detection check
      await checkForFraud(user.id, transaction.id, amountInCents);

      return new Response(
        JSON.stringify({
          success: true,
          transaction_id: transaction.id,
          amount: amount,
          fee: Number(transferFee) / 100,
          status: 'completed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      // Rollback transaction on failure
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      throw new Error('Transfer failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

  } catch (error) {
    console.error('Transfer error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Transfer failed' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function checkForFraud(userId: string, transactionId: string, amount: bigint) {
  try {
    // Simple fraud detection rules
    let riskScore = 0;
    
    // Check for high amount
    if (amount > BigInt(10000000)) { // > 100,000 NGN
      riskScore += 30;
    }
    
    // Check for multiple transactions in short time
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
      .neq('id', transactionId);

    if (recentTransactions && recentTransactions.length > 3) {
      riskScore += 40;
    }

    // Create fraud alert if risk score is high
    if (riskScore >= 50) {
      await supabase
        .from('fraud_alerts')
        .insert({
          user_id: userId,
          transaction_id: transactionId,
          alert_type: 'high_risk_transfer',
          risk_score: riskScore,
          metadata: { rules_triggered: ['high_amount', 'frequent_transactions'] }
        });
    }
  } catch (error) {
    console.error('Fraud check error:', error);
  }
}