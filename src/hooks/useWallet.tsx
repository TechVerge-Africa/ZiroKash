import { useState } from 'react';
import { useAuth } from './useAuth';

interface Wallet {
  id: string;
  wallet_type: 'main' | 'savings' | 'investment';
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  transaction_type: 'send' | 'receive' | 'deposit' | 'withdraw' | 'investment' | 'savings';
  amount: number;
  currency: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

// Stubbed hook - wallets/transactions tables don't exist yet
export function useWallet() {
  const { user } = useAuth();
  const [wallets] = useState<Wallet[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const [loading] = useState(false);

  const getWalletByType = (type: 'main' | 'savings' | 'investment') => {
    return wallets.find(w => w.wallet_type === type);
  };

  return {
    wallets,
    transactions,
    loading,
    createTransaction: async () => null,
    updateWalletBalance: async () => {},
    fetchWallets: async () => {},
    fetchTransactions: async () => {},
    getTotalBalance: () => 0,
    getWalletByType,
    getConvertedBalance: () => 0,
    userCurrency: 'GHS',
  };
}
