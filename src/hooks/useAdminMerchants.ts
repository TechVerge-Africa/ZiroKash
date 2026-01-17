import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MerchantData {
    id: string;
    business_name: string;
    business_email: string;
    paystack_subaccount_code: string | null;
    commission_rate: number | null;
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
                .select('id, business_name, business_email, paystack_subaccount_code, commission_rate, verification_status, is_active, created_at, user_id, settlement_bank_code, settlement_account_number')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as MerchantData[];
        }
    });

    // Check subaccount status
    const checkSubaccount = useMutation({
        mutationFn: async (subaccountCode: string): Promise<SubaccountDetails> => {
            try {
                const { data, error } = await supabase.functions.invoke('check-subaccount', {
                    body: { subaccountCode }
                });

                if (error) {
                    console.error('[Check Subaccount] Edge function error:', error);
                    throw new Error(error.message || 'Failed to send request to the edge function');
                }

                if (!data) {
                    throw new Error('No data returned from edge function');
                }

                if (!data.success) {
                    throw new Error(data.error || 'Failed to check subaccount');
                }

                return data.subaccount;
            } catch (err: any) {
                console.error('[Check Subaccount] Error:', err);
                throw err;
            }
        },
        onSuccess: (data) => {
            toast.success(`Subaccount verified: ${data.business_name}`, {
                description: `Commission: ${data.percentage_charge}% | Active: ${data.active ? 'Yes' : 'No'}`
            });
        },
        onError: (error: any) => {
            console.error('[Check Subaccount] Mutation error:', error);
            toast.error('Failed to check subaccount', {
                description: error.message || 'Unknown error occurred'
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
            try {
                const { data, error } = await supabase.functions.invoke('update-paystack-subaccount', {
                    body: { subaccountCode, percentageCharge }
                });

                if (error) {
                    console.error('[Update Commission] Edge function error:', error);
                    throw new Error(error.message || 'Failed to send request to the edge function');
                }

                if (!data) {
                    throw new Error('No data returned from edge function');
                }

                if (!data.success) {
                    throw new Error(data.error || 'Failed to update commission');
                }

                return data;
            } catch (err: any) {
                console.error('[Update Commission] Error:', err);
                throw err;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
            toast.success('Commission updated successfully', {
                description: `New rate: ${data.percentageCharge}%`
            });
        },
        onError: (error: any) => {
            console.error('[Update Commission] Mutation error:', error);
            toast.error('Failed to update commission', {
                description: error.message || 'Unknown error occurred'
            });
        }
    });

    // Batch update all merchants
    const batchUpdateCommission = useMutation({
        mutationFn: async (percentageCharge: number) => {
            try {
                console.log('[Batch Update] Starting batch update with percentage:', percentageCharge);

                const { data, error } = await supabase.functions.invoke('update-paystack-subaccount', {
                    body: { updateAll: true, percentageCharge }
                });

                if (error) {
                    console.error('[Batch Update] Edge function error:', error);
                    throw new Error(error.message || 'Failed to send request to the edge function');
                }

                if (!data) {
                    throw new Error('No data returned from edge function');
                }

                console.log('[Batch Update] Response:', data);
                return data;
            } catch (err: any) {
                console.error('[Batch Update] Error:', err);
                throw err;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
            toast.success('Batch update complete', {
                description: `Updated ${data.updated || 0} merchants, ${data.failed || 0} failed`
            });
        },
        onError: (error: any) => {
            console.error('[Batch Update] Mutation error:', error);
            toast.error('Batch update failed', {
                description: error.message || 'Unknown error occurred'
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
