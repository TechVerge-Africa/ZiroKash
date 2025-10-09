import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'GHS': '₵',
  'NGN': '₦',
  'KES': 'KSh',
  'UGX': 'USh',
  'TZS': 'TSh',
  'ZAR': 'R',
  'GBP': '£',
  'EUR': '€',
};

export function useCurrency() {
  const { user } = useAuth();
  const [userCurrency, setUserCurrency] = useState<string>('GHS');
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    'USD': 1,
    'GHS': 15.50,
    'NGN': 1650,
    'KES': 129,
    'UGX': 3700,
    'TZS': 2500,
    'ZAR': 18.50,
    'GBP': 0.79,
    'EUR': 0.92,
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data } = await supabase.functions.invoke('currency-rates', {
          body: { from: 'USD', to: 'GHS', amount: 1 }
        });
        if (data?.rates) {
          setExchangeRates(data.rates);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchRates();
    // Refresh rates every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const detectAndSetCurrency = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's wallet to check their currency
        const { data: wallets } = await supabase
          .from('wallets')
          .select('currency')
          .eq('user_id', user.id)
          .eq('wallet_type', 'main')
          .single();

        if (wallets?.currency) {
          setUserCurrency(wallets.currency);
        } else {
          // Auto-detect country and set currency (defaults to Ghana/GHS)
          const { data } = await supabase.functions.invoke('detect-country');
          if (data?.currency) {
            setUserCurrency(data.currency);
          }
        }
      } catch (error) {
        console.error('Error detecting currency:', error);
      } finally {
        setLoading(false);
      }
    };

    detectAndSetCurrency();
  }, [user]);

  const convertAmount = (amount: number, fromCurrency: string = 'USD', toCurrency?: string): number => {
    const targetCurrency = toCurrency || userCurrency;
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[targetCurrency] || 1;
    
    const amountInUSD = amount / fromRate;
    return Math.round(amountInUSD * toRate * 100) / 100;
  };

  const formatAmount = (amount: number, currency?: string): string => {
    const targetCurrency = currency || userCurrency;
    const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return `${symbol}${formattedAmount}`;
  };

  const getCurrencySymbol = (currency?: string): string => {
    return CURRENCY_SYMBOLS[currency || userCurrency] || (currency || userCurrency);
  };

  return {
    userCurrency,
    loading,
    convertAmount,
    formatAmount,
    getCurrencySymbol,
    exchangeRates,
  };
}
