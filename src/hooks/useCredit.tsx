import { useState } from 'react';

// Stubbed hook - credit_cards table doesn't exist yet
export function useCredit() {
  const [creditCards] = useState<any[]>([]);
  const [loading] = useState(false);

  // Stubbed updateCreditCard that accepts card id and updates object
  const updateCreditCard = async (_cardId: string, _updates: Record<string, any>) => {
    console.log('updateCreditCard is stubbed - no credit_cards table exists');
    return null;
  };

  return {
    creditCards,
    loading,
    createCreditCard: async () => null,
    updateCreditCard,
    fetchCreditCards: async () => {},
    getTotalCreditUsed: () => 0,
    getTotalCreditLimit: () => 0,
    getCreditUtilization: () => 0,
  };
}