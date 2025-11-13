import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Investment {
  id: string;
  asset_name: string;
  asset_type: string;
  symbol?: string;
  shares_owned: number;
  purchase_price: number;
  current_price: number;
  total_invested: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useInvestments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching investments:', error);
    } else {
      setInvestments((data || []) as Investment[]);
    }
  };

  const createInvestment = async (investmentData: { asset_name: string; asset_type: string; symbol?: string; shares_owned?: number; purchase_price?: number; current_price?: number; total_invested?: number; current_value?: number; profit_loss?: number; profit_loss_percentage?: number; }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        ...investmentData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating investment:', error);
      throw error;
    }

    await fetchInvestments();
    return data;
  };

  const updateInvestment = async (investmentId: string, updates: Partial<Investment>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('investments')
      .update(updates)
      .eq('id', investmentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating investment:', error);
      throw error;
    }

    await fetchInvestments();
    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInvestments();
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const getTotalInvested = () => {
    return investments.reduce((total, investment) => total + investment.total_invested, 0);
  };

  const getTotalCurrentValue = () => {
    return investments.reduce((total, investment) => total + investment.current_value, 0);
  };

  const getTotalProfitLoss = () => {
    return investments.reduce((total, investment) => total + investment.profit_loss, 0);
  };

  const getPortfolioPerformance = () => {
    const totalInvested = getTotalInvested();
    if (totalInvested === 0) return 0;
    return (getTotalProfitLoss() / totalInvested) * 100;
  };

  const getAssetsByType = () => {
    const assetTypes = investments.reduce((acc, investment) => {
      if (!acc[investment.asset_type]) {
        acc[investment.asset_type] = {
          total_value: 0,
          count: 0,
          profit_loss: 0
        };
      }
      acc[investment.asset_type].total_value += investment.current_value;
      acc[investment.asset_type].count += 1;
      acc[investment.asset_type].profit_loss += investment.profit_loss;
      return acc;
    }, {} as Record<string, { total_value: number; count: number; profit_loss: number }>);

    return assetTypes;
  };

  return {
    investments,
    loading,
    createInvestment,
    updateInvestment,
    fetchInvestments,
    getTotalInvested,
    getTotalCurrentValue,
    getTotalProfitLoss,
    getPortfolioPerformance,
    getAssetsByType,
  };
}