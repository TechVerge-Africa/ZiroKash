import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PaymentFormData {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  fields: any[];
  theme_color: string;
  logo_url: string | null;
  signature_url: string | null;
  receipt_template: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormStats {
  totalSubmissions: number;
  paidSubmissions: number;
  totalCollected: number;
}

export function usePaymentForms() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  // Fetch all payment forms
  const { data: forms = [], isLoading, refetch } = useQuery({
    queryKey: ['payment-forms', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('payment_forms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentFormData[];
    },
    enabled: !!userId
  });

  // Fetch stats for all forms
  const { data: stats = {} } = useQuery({
    queryKey: ['form-stats', userId],
    queryFn: async () => {
      if (!userId) return {};

      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('form_id, status, amount')
        .in('form_id', forms.map(f => f.id));

      if (error) throw error;

      const statsMap: Record<string, FormStats> = {};

      forms.forEach(form => {
        const formSubmissions = submissions?.filter(s => s.form_id === form.id) || [];
        const paid = formSubmissions.filter(s => s.status === 'paid');

        statsMap[form.id] = {
          totalSubmissions: formSubmissions.length,
          paidSubmissions: paid.length,
          totalCollected: paid.reduce((sum, s) => sum + (s.amount || 0), 0) / 100
        };
      });

      return statsMap;
    },
    enabled: forms.length > 0
  });

  // Toggle form active status
  const { mutate: toggleFormStatus } = useMutation({
    mutationFn: async ({ formId, isActive }: { formId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('payment_forms')
        .update({ is_active: isActive })
        .eq('id', formId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-forms'] });
      toast.success('Form status updated');
    },
    onError: (error) => {
      toast.error('Failed to update form status');
      console.error(error);
    }
  });

  // Delete form
  const { mutate: deleteForm } = useMutation({
    mutationFn: async (formId: string) => {
      const { error } = await supabase
        .from('payment_forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-forms'] });
      toast.success('Form deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete form');
      console.error(error);
    }
  });

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('payment-forms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_forms',
          filter: `user_id=eq.${userId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['payment-forms'] });
          queryClient.invalidateQueries({ queryKey: ['form-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_submissions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['form-stats'] });
          queryClient.invalidateQueries({ queryKey: ['revenue-history'] });
          queryClient.invalidateQueries({ queryKey: ['unique-customers'] });
          // Invalidate wallets when form submissions change (payment received)
          queryClient.invalidateQueries({ queryKey: ['wallets'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['wallets', userId] });
          queryClient.invalidateQueries({ queryKey: ['form-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return {
    forms,
    stats,
    isLoading,
    toggleFormStatus,
    deleteForm,
    refetch
  };
}