import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_email: string;
  business_phone: string | null;
  business_address: string | null;
  contact_person: string | null;
  merchant_type: string | null;
  verification_status: string | null;
  is_active: boolean | null;
  paystack_subaccount_code: string | null;
  paystack_subaccount_code_v2?: string | null; // New field for Primary Gateway
  settlement_bank_code: string | null;
  settlement_account_number: string | null;
  settlement_account_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Bank {
  name: string;
  code: string;
  type: string;
  currency: string;
}

export function useMerchant() {
  const { user } = useAuth();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  const fetchMerchant = useCallback(async () => {
    if (!user) return;
    try {
      console.log('Fetching merchant data for user:', user.id);
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      console.log('Merchant data fetched:', data);
      setMerchant(data);
    } catch (error) {
      console.error('Error fetching merchant:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMerchant();
      
      // Set up real-time subscription for merchant updates
      const channelName = `merchants-${user.id}`;
      const channel = supabase
        .channel(channelName, { config: { broadcast: { self: true } } })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'merchants',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Merchant update received:', payload);
            if (payload.new) {
              console.log('Updating merchant state with:', payload.new);
              setMerchant(payload.new as Merchant);
            }
          }
        )
        .subscribe((status) => {
          console.log('Channel subscription status:', status);
        });
      
      // Fallback: Poll for updates every 3 seconds if needed
      const pollInterval = setInterval(() => {
        console.log('Polling merchant data...');
        fetchMerchant();
      }, 3000);
      
      return () => {
        channel.unsubscribe();
        clearInterval(pollInterval);
      };
    } else {
      setMerchant(null);
      setLoading(false);
    }
  }, [user, fetchMerchant]);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-banks');
      if (error) throw error;
      setBanks(data.banks || []);
      return data.banks || [];
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Failed to load banks');
      return [];
    } finally {
      setLoadingBanks(false);
    }
  };

  const verifyBankAccount = async (accountNumber: string, bankCode: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-bank-account', {
        body: { accountNumber, bankCode }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying account:', error);
      throw error;
    }
  };

  const createMerchant = async (merchantData: {
    businessName: string;
    businessEmail: string;
    businessPhone?: string;
    businessAddress?: string;
    contactPerson?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .insert({
          user_id: user!.id,
          business_name: merchantData.businessName,
          business_email: merchantData.businessEmail,
          business_phone: merchantData.businessPhone,
          business_address: merchantData.businessAddress,
          verification_status: 'pending', // Explicitly set to valid enum value
        })
        .select()
        .single();

      if (error) throw error;
      setMerchant(data);
      return data;
    } catch (error) {
      console.error('Error creating merchant:', error);
      throw error;
    }
  };

  const setupPaystackSubaccount = async (
    businessName: string,
    bankCode: string,
    accountNumber: string,
    accountName: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-paystack-subaccount', {
        body: { businessName, bankCode, accountNumber, accountName }
      });

      if (error) throw error;

      // Refresh merchant data
      await fetchMerchant();
      return data;
    } catch (error) {
      console.error('Error creating subaccount:', error);
      throw error;
    }
  };
  const withdrawToMobileMoney = async (params: {
    amount: number;
    phoneNumber: string;
    provider: string;
    currency: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('withdraw-momo', {
        body: {
          ...params,
          is_merchant: true // Flag to indicate merchant withdrawal
        }
      });

      if (error) throw error;

      toast.success(`Withdrawal of GHS ${params.amount} initiated successfully`);
      return data;
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast.error(error.message || 'Withdrawal failed');
      throw error;
    }
  };

  return {
    merchant,
    loading,
    banks,
    loadingBanks,
    fetchMerchant,
    fetchBanks,
    verifyBankAccount,
    createMerchant,
    setupPaystackSubaccount,
    withdrawToMobileMoney,
    isMerchant: !!merchant,
    hasSubaccount: !!merchant?.paystack_subaccount_code_v2, // Require v2 for complete setup status
  };
}
