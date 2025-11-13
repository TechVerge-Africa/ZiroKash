import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { WalletService } from '@/services/WalletService';
import { TransactionService } from '@/services/TransactionService';
import { useAuth } from './useAuth';
import type { 
  Wallet, 
  Transaction,
  WalletType,
  Tables
} from '@/types/supabase';

export function useWallet() {
  const { user } = useAuth();
  const walletService = WalletService.getInstance();
  
  const wallets: UseQueryResult<Wallet[]> = useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: () => walletService.getUserWallets(user!.id),
    enabled: !!user
  });

  const createWallet = useMutation({
    mutationFn: ({ 
      currency, 
      type 
    }: { 
      currency: string; 
      type: WalletType;
    }) => walletService.createWallet(user!.id, currency, type),
    onSuccess: () => {
      wallets.refetch();
    }
  });

  const getWalletById = async (walletId: string): Promise<Wallet> => {
    return walletService.getWallet(walletId);
  };

  return {
    wallets: wallets.data || [],
    isLoading: wallets.isLoading,
    error: wallets.error,
    createWallet: createWallet.mutate,
    getWalletById,
  };
}

export function useTransactions(walletId?: string) {
  const { user } = useAuth();
  const transactionService = TransactionService.getInstance();

  const transactions = useQuery({
    queryKey: ['transactions', walletId],
    queryFn: () => transactionService.getTransactionHistory(user!.id),
    enabled: !!user
  });

  const createTransaction = useMutation({
    mutationFn: ({ 
      amount,
      currency,
      type,
      description 
    }: { 
      amount: number;
      currency: string;
      type: Tables['transactions']['Row']['transaction_type'];
      description: string;
    }) => transactionService.createTransaction(amount, currency, type, description),
    onSuccess: () => {
      transactions.refetch();
    }
  });

  return {
    transactions: transactions.data || [],
    isLoading: transactions.isLoading,
    error: transactions.error,
    createTransaction: createTransaction.mutate,
  };
}