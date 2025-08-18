import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  purchase_price: number;
  current_price: number;
  total_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useCrypto() {
  const { user } = useAuth();
  const [cryptoPortfolio, setCryptoPortfolio] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCryptoPortfolio = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('crypto_portfolio')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching crypto portfolio:', error);
    } else {
      setCryptoPortfolio((data || []) as CryptoAsset[]);
    }
  };

  const addCryptoAsset = async (assetData: { symbol: string; name: string; balance?: number; purchase_price?: number; current_price?: number; total_value?: number; profit_loss?: number; profit_loss_percentage?: number; }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('crypto_portfolio')
      .insert({
        user_id: user.id,
        ...assetData
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding crypto asset:', error);
      throw error;
    }

    await fetchCryptoPortfolio();
    return data;
  };

  const updateCryptoAsset = async (assetId: string, updates: Partial<CryptoAsset>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('crypto_portfolio')
      .update(updates)
      .eq('id', assetId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating crypto asset:', error);
      throw error;
    }

    await fetchCryptoPortfolio();
    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCryptoPortfolio();
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const getTotalPortfolioValue = () => {
    return cryptoPortfolio.reduce((total, asset) => total + asset.total_value, 0);
  };

  const getTotalProfitLoss = () => {
    return cryptoPortfolio.reduce((total, asset) => total + asset.profit_loss, 0);
  };

  const getPortfolioPerformance = () => {
    const totalInvested = cryptoPortfolio.reduce((total, asset) => total + (asset.balance * asset.purchase_price), 0);
    if (totalInvested === 0) return 0;
    return (getTotalProfitLoss() / totalInvested) * 100;
  };

  return {
    cryptoPortfolio,
    loading,
    addCryptoAsset,
    updateCryptoAsset,
    fetchCryptoPortfolio,
    getTotalPortfolioValue,
    getTotalProfitLoss,
    getPortfolioPerformance,
  };
}