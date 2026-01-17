import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MerchantData {
    id: string;
    business_name: string;
    business_email: string;
    paystack_subaccount_code: string | null;
    commission_rate: number;
    verification_status: string | null;
    is_active: boolean | null;
    created_at: string | null;
    user_id: string;
    settlement_bank_code: string | null;
    settlement_account_number: string | null;
}

export interface SubaccountDetails {
    subaccount_code: string;
    business_name: string;
    percentage_charge: number;
    settlement_bank: string;
    account_number: string;
    is_verified: boolean;
    active: boolean;
    description?: string;
    primary_contact_email?: string;
    created_at?: string;
    updated_at?: string;
}

export function useAdminMerchants() {
    const queryClient = useQueryClient();

    // Fetch all merchants
    const { data: merchants, isLoading, error } = useQuery({
        queryKey: ['admin-merchants'],
        queryFn: async (): Promise<MerchantData[]> => {
            const { data, error } = await supabase
                .from('merchants')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as MerchantData[];
        }
    });

    // Check subaccount status
    const checkSubaccount = useMutation({
        mutationFn: async (subaccountCode: string): Promise<SubaccountDetails> => {
            const { data, error } = await supabase.functions.invoke('check-subaccount', {
                body: { subaccountCode }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error || 'Failed to check subaccount');

            return data.subaccount;
        },
        onSuccess: (data) => {
            toast.success(`Subaccount verified: ${data.business_name}`, {
                description: `Commission: ${data.percentage_charge}% | Active: ${data.active ? 'Yes' : 'No'}`
            });
        },
        onError: (error: any) => {
            toast.error('Failed to check subaccount', {
                description: error.message
            });
        }
    });

    // Update single merchant commission
    const updateCommission = useMutation({
        mutationFn: async ({
            subaccountCode,
            percentageCharge
        }: {
            subaccountCode: string;
            percentageCharge: number
        }) => {
            const { data, error } = await supabase.functions.invoke('update-paystack-subaccount', {
                body: { subaccountCode, percentageCharge }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error || 'Failed to update commission');

            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
            toast.success('Commission updated successfully', {
                description: `New rate: ${data.percentageCharge}%`
            });
        },
        onError: (error: any) => {
            toast.error('Failed to update commission', {
                description: error.message
            });
        }
    });

    // Batch update all merchants
    const batchUpdateCommission = useMutation({
        mutationFn: async (percentageCharge: number) => {
            const { data, error } = await supabase.functions.invoke('update-paystack-subaccount', {
                body: { updateAll: true, percentageCharge }
            });

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
            toast.success('Batch update complete', {
                description: `Updated ${data.updated} merchants, ${data.failed} failed`
            });
        },
        onError: (error: any) => {
            toast.error('Batch update failed', {
                description: error.message
            });
        }
    });

    return {
        merchants,
        isLoading,
        error,
        checkSubaccount,
        updateCommission,
        batchUpdateCommission
    };
}
