import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface DepositParams {
  amount: number;
  phoneNumber?: string;
  provider?: string;
  currency?: string;
}

export function useDeposit() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const depositMomo = async ({ amount, phoneNumber, provider, currency = 'USD' }: DepositParams) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a deposit",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('deposit-momo', {
        body: { 
          amount: Math.round(amount * 100), // Convert to cents
          phone_number: phoneNumber,
          provider,
          currency
        }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        // Open Paystack payment page
        window.open(data.authorization_url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: "Complete your payment in the new window",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message || "An error occurred during deposit",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const depositBank = async ({ amount, currency = 'USD' }: DepositParams) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a deposit",
        variant: "destructive"
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('deposit-bank', {
        body: { 
          amount: Math.round(amount * 100), // Convert to cents
          currency
        }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        // Open Paystack payment page
        window.open(data.authorization_url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: "Complete your payment in the new window",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message || "An error occurred during deposit",
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    depositMomo,
    depositBank,
    loading
  };
}
