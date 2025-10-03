import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface WithdrawMomoParams {
  amount: number;
  phoneNumber: string;
  provider: string;
  currency?: string;
}

interface WithdrawBankParams {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  currency?: string;
}

export function useWithdraw() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const withdrawMomo = async ({ amount, phoneNumber, provider, currency = 'USD' }: WithdrawMomoParams) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to withdraw",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('withdraw-momo', {
        body: { 
          amount: Math.round(amount * 100), // Convert to cents
          phone_number: phoneNumber,
          provider,
          currency
        }
      });

      if (error) throw error;

      toast({
        title: "Withdrawal initiated",
        description: `Withdrawing $${amount.toFixed(2)} to ${phoneNumber}`,
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message || "An error occurred during withdrawal",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const withdrawBank = async ({ amount, bankCode, accountNumber, accountName, currency = 'USD' }: WithdrawBankParams) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to withdraw",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('withdraw-bank', {
        body: { 
          amount: Math.round(amount * 100), // Convert to cents
          bank_code: bankCode,
          account_number: accountNumber,
          account_name: accountName,
          currency
        }
      });

      if (error) throw error;

      toast({
        title: "Withdrawal initiated",
        description: `Withdrawing $${amount.toFixed(2)} to ${accountName}`,
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message || "An error occurred during withdrawal",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    withdrawMomo,
    withdrawBank,
    loading
  };
}
