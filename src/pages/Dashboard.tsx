
import { useEffect, useMemo } from "react";
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActions from "@/components/dashboard/QuickActions";
import TransactionsList, { Transaction } from "@/components/dashboard/TransactionsList";
import CryptoPrices from "@/components/dashboard/CryptoPrices";
import SavingsCard from "@/components/dashboard/SavingsCard";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { wallets, transactions: walletTransactions, loading, getTotalBalance } = useWallet();
  
  // Convert wallet transactions to dashboard format
  const transactions: Transaction[] = useMemo(() => {
    return walletTransactions.map(tx => ({
      id: tx.id,
      type: tx.transaction_type === 'receive' || tx.transaction_type === 'deposit' ? 'incoming' : 
            tx.transaction_type === 'send' || tx.transaction_type === 'withdraw' ? 'outgoing' : 'pending',
      title: tx.description || `${tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)} Transaction`,
      amount: tx.amount,
      currency: tx.currency,
      date: new Date(tx.created_at).toLocaleDateString(),
      sender: tx.sender_address,
      recipient: tx.recipient_address,
      status: tx.status === 'pending' ? 'processing' : tx.status === 'failed' ? 'failed' : 'completed'
    }));
  }, [walletTransactions]);

  // Set up real-time subscription for transactions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh data when transactions change
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up-delayed">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'} 👋</h1>
        
        <QuickActions />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <BalanceCard balance={getTotalBalance()} currency="USD" />
          <SavingsCard 
            totalSavings={wallets.find(w => w.wallet_type === 'savings')?.balance || 0} 
            targetAmount={10000} 
            savingsName="Emergency Fund" 
          />
          <div className={isMobile ? "order-1 col-span-full" : "col-span-full"}>
            <TransactionsList transactions={transactions} />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <CryptoPrices />
      </div>
    </div>
  );
}
