import { useState } from 'react';

// Stubbed hook - crypto_portfolio table doesn't exist yet
export function useCrypto() {
  const [cryptoPortfolio] = useState<any[]>([]);
  const [loading] = useState(false);

  return {
    cryptoPortfolio,
    loading,
    addCryptoAsset: async () => null,
    updateCryptoAsset: async () => null,
    fetchCryptoPortfolio: async () => {},
    getTotalPortfolioValue: () => 0,
    getTotalProfitLoss: () => 0,
    getPortfolioPerformance: () => 0,
  };
}