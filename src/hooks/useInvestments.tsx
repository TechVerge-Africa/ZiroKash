import { useState } from 'react';

// Stubbed hook - investments table doesn't exist yet
export function useInvestments() {
  const [investments] = useState<any[]>([]);
  const [loading] = useState(false);

  return {
    investments,
    loading,
    createInvestment: async () => null,
    updateInvestment: async () => null,
    fetchInvestments: async () => {},
    getTotalInvested: () => 0,
    getTotalCurrentValue: () => 0,
    getTotalProfitLoss: () => 0,
    getPortfolioPerformance: () => 0,
    getAssetsByType: () => ({}),
  };
}