import { useState } from 'react';

// Stubbed hook - credit_cards table doesn't exist yet
export function useCredit() {
  const [creditCards] = useState<any[]>([]);
  const [loading] = useState(false);

  return {
    creditCards,
    loading,
    createCreditCard: async () => null,
    updateCreditCard: async () => null,
    fetchCreditCards: async () => {},
    getTotalCreditUsed: () => 0,
    getTotalCreditLimit: () => 0,
    getCreditUtilization: () => 0,
  };
}