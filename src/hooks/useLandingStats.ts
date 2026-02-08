import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LandingStats {
    totalForms: number;
    totalTransactions: number;
    totalVolume: number;
    activeMerchants: number;
    isLoading: boolean;
}

export function useLandingStats() {
    const [stats, setStats] = useState<LandingStats>({
        totalForms: 0,
        totalTransactions: 0,
        totalVolume: 0,
        activeMerchants: 0,
        isLoading: true
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                // Run all queries in parallel for better performance
                const [formsResult, merchantsResult, submissionsResult, volumeResult] = await Promise.all([
                    // 1. Count Total Payment Forms
                    supabase
                        .from('payment_forms')
                        .select('*', { count: 'exact', head: true }),

                    // 2. Count Active Merchants
                    supabase
                        .from('merchants')
                        .select('*', { count: 'exact', head: true })
                        .eq('is_active', true),

                    // 3. Count Total Form Submissions (transactions)
                    supabase
                        .from('form_submissions')
                        .select('*', { count: 'exact', head: true }),

                    // 4. Sum Total Volume from paid submissions
                    supabase
                        .from('form_submissions')
                        .select('amount')
                        .eq('status', 'paid')
                ]);

                // Calculate total volume from paid submissions
                const totalVolume = volumeResult.data?.reduce((sum, row) => sum + (row.amount || 0), 0) || 0;

                setStats({
                    totalForms: formsResult.count || 0,
                    totalTransactions: submissionsResult.count || 0,
                    totalVolume: Math.round(totalVolume),
                    activeMerchants: merchantsResult.count || 0,
                    isLoading: false
                });

            } catch (error) {
                console.error("Error fetching landing stats:", error);
                // Show zeros on error - real data only
                setStats({
                    totalForms: 0,
                    totalTransactions: 0,
                    totalVolume: 0,
                    activeMerchants: 0,
                    isLoading: false
                });
            }
        }

        fetchStats();
    }, []);

    return stats;
}
