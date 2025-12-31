import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Wallet {
  id: string;
  wallet_type: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  created_at: string;
  metadata?: any;
}

export function useWallet() {
  const { user } = useAuth();

  const { data: wallets = [], isLoading: loadingWallets } = useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data || []) as Wallet[];
    },
    enabled: !!user
  });

  // Fetch form submissions to show as 'receive' transactions
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['dashboard-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: forms } = await supabase
        .from('payment_forms')
        .select('id, title')
        .eq('user_id', user.id);
      
      if (!forms || forms.length === 0) return [];
      
      const formIds = forms.map(f => f.id);

      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('id, amount, status, created_at, payer_name, payer_email, form_id, submission_data')
        .in('form_id', formIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (submissions || []).map(s => {
        const form = forms.find(f => f.id === s.form_id);
        return {
          id: s.id,
          transaction_type: 'receive',
          amount: s.amount,
          currency: 'GHS',
          description: `Payment from ${s.payer_name || 'Customer'}`,
          status: s.status || 'completed',
          created_at: s.created_at || new Date().toISOString(),
          metadata: {
            name: s.payer_name,
            email: s.payer_email,
            form_title: form?.title || 'Payment Form',
            submission_data: s.submission_data,
            type: 'payment_link'
          }
        };
      }) as Transaction[];
    },
    enabled: !!user
  });

  const getWalletByType = (type: string) => {
    return wallets.find(w => w.wallet_type === type);
  };

  const loading = loadingWallets || loadingTransactions;

  return {
    wallets,
    transactions,
    loading,
    createTransaction: async () => null,
    updateWalletBalance: async () => {},
    fetchWallets: async () => {},
    fetchTransactions: async () => {},
    getTotalBalance: () => wallets.reduce((sum, w) => sum + Number(w.balance), 0),
    getWalletByType,
    getConvertedBalance: () => 0,
    userCurrency: 'GHS',
  };
}
