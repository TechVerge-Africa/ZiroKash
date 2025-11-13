import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CreditCard {
  id: string;
  card_name: string;
  card_number: string;
  card_type: string;
  credit_limit: number;
  current_balance: number;
  minimum_payment: number;
  due_date?: string;
  is_active: boolean;
  is_frozen: boolean;
  security_settings: any;
  created_at: string;
  updated_at: string;
}

export function useCredit() {
  const { user } = useAuth();
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreditCards = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching credit cards:', error);
    } else {
      setCreditCards((data || []) as CreditCard[]);
    }
  };

  const createCreditCard = async (cardData: { card_name: string; card_number: string; card_type?: string; credit_limit?: number; current_balance?: number; minimum_payment?: number; due_date?: string; is_active?: boolean; is_frozen?: boolean; security_settings?: any; }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_cards')
      .insert({
        user_id: user.id,
        ...cardData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating credit card:', error);
      throw error;
    }

    await fetchCreditCards();
    return data;
  };

  const updateCreditCard = async (cardId: string, updates: Partial<CreditCard>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_cards')
      .update(updates)
      .eq('id', cardId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating credit card:', error);
      throw error;
    }

    await fetchCreditCards();
    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCreditCards();
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const getTotalCreditUsed = () => {
    return creditCards.reduce((total, card) => total + card.current_balance, 0);
  };

  const getTotalCreditLimit = () => {
    return creditCards.reduce((total, card) => total + card.credit_limit, 0);
  };

  const getCreditUtilization = () => {
    const totalLimit = getTotalCreditLimit();
    if (totalLimit === 0) return 0;
    return (getTotalCreditUsed() / totalLimit) * 100;
  };

  return {
    creditCards,
    loading,
    createCreditCard,
    updateCreditCard,
    fetchCreditCards,
    getTotalCreditUsed,
    getTotalCreditLimit,
    getCreditUtilization,
  };
}