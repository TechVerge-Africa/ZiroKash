import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCurrency } from './useCurrency';

interface Wallet {
  id: string;
  wallet_type: 'main' | 'savings' | 'investment';
  balance: number;
  currency: string;
  blockchain_address?: string;
}

interface Transaction {
  id: string;
  transaction_type: 'send' | 'receive' | 'deposit' | 'withdraw' | 'investment' | 'savings';
  amount: number;
  currency: string;
  recipient_address?: string;
  sender_address?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

export function useWallet() {
  const { user } = useAuth();
  const { userCurrency, convertAmount } = useCurrency();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching wallets:', error);
    } else {
      setWallets((data || []) as Wallet[]);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions((data || []) as Transaction[]);
    }
  };

  const createTransaction = async (
    type: Transaction['transaction_type'],
    amount: number,
    toAddress?: string,
    description?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: type,
        amount,
        currency: 'USD',
        recipient_address: toAddress,
        description,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    // Refresh transactions
    await fetchTransactions();
    return data;
  };

  const updateWalletBalance = async (walletType: string, newBalance: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user.id)
      .eq('wallet_type', walletType);

    if (error) {
      console.error('Error updating wallet balance:', error);
    } else {
      await fetchWallets();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWallets(), fetchTransactions()]);
      setLoading(false);
    };

    if (user) {
      loadData();

      // Set up real-time subscription for transactions
      const transactionsChannel = supabase
        .channel('transactions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchTransactions();
          }
        )
        .subscribe();

      // Set up real-time subscription for wallets
      const walletsChannel = supabase
        .channel('wallets_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallets',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchWallets();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(transactionsChannel);
        supabase.removeChannel(walletsChannel);
      };
    }
  }, [user]);

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => {
      // Convert wallet balance to user's currency
      const balance = wallet.balance / 100; // Convert from cents
      const convertedBalance = convertAmount(balance, wallet.currency);
      return total + convertedBalance;
    }, 0);
  };

  const getWalletByType = (type: 'main' | 'savings' | 'investment') => {
    return wallets.find(w => w.wallet_type === type);
  };

  const getConvertedBalance = (wallet: Wallet) => {
    const balance = wallet.balance / 100; // Convert from cents
    return convertAmount(balance, wallet.currency);
  };

  return {
    wallets,
    transactions,
    loading,
    createTransaction,
    updateWalletBalance,
    fetchWallets,
    fetchTransactions,
    getTotalBalance,
    getWalletByType,
    getConvertedBalance,
    userCurrency,
  };
}