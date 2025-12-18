import { useState } from 'react';

const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'GHS': '₵',
  'NGN': '₦',
  'KES': 'KSh',
  'EUR': '€',
  'GBP': '£',
};

// Simplified currency hook - no DB dependency
export function useCurrency() {
  const [userCurrency] = useState('GHS');
  const [loading] = useState(false);

  const convertAmount = (amount: number, _fromCurrency: string = 'USD'): number => {
    return amount;
  };

  const formatAmount = (amount: number, currency?: string): string => {
    const targetCurrency = currency || userCurrency;
    const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;
    return `${symbol}${amount.toFixed(2)}`;
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
    exchangeRates: { GHS: 1 },
  };
}