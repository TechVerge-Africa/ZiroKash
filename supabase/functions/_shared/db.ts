/**
 * Database Helper Functions
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ZiroPayError, ErrorCodes } from './errors.ts';

/**
 * Create Supabase client for edge functions
 */
export function createSupabaseClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(req: Request) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    throw new ZiroPayError(
      ErrorCodes.UNAUTHORIZED,
      'No authorization header',
      401
    );
  }
  
  const supabase = createSupabaseClient();
  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new ZiroPayError(
      ErrorCodes.INVALID_TOKEN,
      'Invalid or expired token',
      401
    );
  }
  
  return user;
}

/**
 * Check rate limit for user
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit = 100,
  windowMinutes = 60
): Promise<boolean> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_user_id: userId,
    p_endpoint: endpoint,
    p_limit: limit,
    p_window_minutes: windowMinutes
  });
  
  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error to avoid blocking legitimate requests
  }
  
  if (!data) {
    throw new ZiroPayError(
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Too many requests. Please try again later.',
      429
    );
  }
  
  return data;
}

/**
 * Get user's wallet by type
 */
export async function getUserWallet(userId: string, walletType: string) {
  const supabase = createSupabaseClient();
  
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .eq('wallet_type', walletType)
    .eq('is_active', true)
    .single();
  
  if (error || !wallet) {
    throw new ZiroPayError(
      ErrorCodes.WALLET_NOT_FOUND,
      `${walletType} wallet not found`,
      404
    );
  }
  
  return wallet;
}

/**
 * Get merchant by user ID
 */
export async function getMerchant(userId: string) {
  const supabase = createSupabaseClient();
  
  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !merchant) {
    throw new ZiroPayError(
      ErrorCodes.MERCHANT_NOT_FOUND,
      'Merchant account not found',
      404
    );
  }
  
  if (merchant.verification_status !== 'approved' || !merchant.is_active) {
    throw new ZiroPayError(
      ErrorCodes.MERCHANT_NOT_APPROVED,
      'Merchant account not approved or inactive',
      403
    );
  }
  
  return merchant;
}

/**
 * Update wallet balance
 */
export async function updateWalletBalance(
  walletId: string,
  amount: number,
  operation: 'credit' | 'debit'
) {
  const supabase = createSupabaseClient();
  
  // Get current balance
  const { data: wallet, error: fetchError } = await supabase
    .from('wallets')
    .select('balance, is_active')
    .eq('id', walletId)
    .single();
  
  if (fetchError || !wallet) {
    throw new ZiroPayError(
      ErrorCodes.WALLET_NOT_FOUND,
      'Wallet not found',
      404
    );
  }
  
  if (!wallet.is_active) {
    throw new ZiroPayError(
      ErrorCodes.VALIDATION_ERROR,
      'Wallet is inactive',
      400
    );
  }
  
  // Calculate new balance
  const currentBalance = wallet.balance;
  const newBalance = operation === 'credit' 
    ? currentBalance + amount 
    : currentBalance - amount;
  
  // Check for insufficient funds on debit
  if (operation === 'debit' && newBalance < 0) {
    throw new ZiroPayError(
      ErrorCodes.INSUFFICIENT_FUNDS,
      'Insufficient funds',
      400
    );
  }
  
  // Update balance
  const { data: updatedWallet, error: updateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', walletId)
    .select()
    .single();
  
  if (updateError) {
    throw new ZiroPayError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to update wallet balance',
      500,
      updateError
    );
  }
  
  return updatedWallet;
}

/**
 * Create transaction record
 */
export async function createTransaction(params: {
  user_id: string;
  transaction_type: string;
  amount: number;
  currency?: string;
  status?: string;
  from_wallet_id?: string;
  to_wallet_id?: string;
  description?: string;
  metadata?: any;
  external_reference?: string;
  payment_method?: string;
}) {
  const supabase = createSupabaseClient();
  
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      ...params,
      currency: params.currency || 'GHS',
      status: params.status || 'pending',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    throw new ZiroPayError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to create transaction',
      500,
      error
    );
  }
  
  return transaction;
}
