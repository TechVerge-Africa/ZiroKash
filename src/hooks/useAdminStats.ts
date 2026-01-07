import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminStats {
    merchantsCount: number;
    formsCount: number;
    transactionsSum: number;
    successfulTransactions: number;
    failedTransactions: number;
    totalRevenue: number;
    revenueHistory: { date: string; amount: number }[];
}

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin-global-stats'],
        queryFn: async (): Promise<AdminStats> => {
            // 1. Fetch Merchants count
            const { count: merchantsCount, error: mError } = await supabase
                .from('merchants')
                .select('*', { count: 'exact', head: true });

            if (mError) throw mError;

            // 2. Fetch Forms count
            const { count: formsCount, error: fError } = await supabase
                .from('payment_forms')
                .select('*', { count: 'exact', head: true });

            if (fError) throw fError;

            // 3. Fetch all form submissions for revenue and success/fail metrics
            const { data: submissions, error: sError } = await supabase
                .from('form_submissions')
                .select('created_at, status, amount, net_amount');

            if (sError) throw sError;

            // Type assertion for outdated Supabase types
            const typedSubmissions = (submissions || []) as any[];

            const successful = typedSubmissions.filter(s => s.status === 'paid');
            const failed = typedSubmissions.filter(s => s.status === 'failed');

            const totalRevenue = successful.reduce((sum, s) => sum + (s.net_amount || s.amount || 0), 0) / 100;

            // Group revenue by date for the chart
            const revenueByDate: Record<string, number> = {};
            successful.forEach(s => {
                if (!s.created_at) return;
                const date = new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                revenueByDate[date] = (revenueByDate[date] || 0) + ((s.net_amount || s.amount || 0) / 100);
            });

            const revenueHistory = Object.entries(revenueByDate).map(([date, amount]) => ({
                date,
                amount: Math.round(amount * 100) / 100
            })).slice(-7); // Last 7 days/entries

            return {
                merchantsCount: merchantsCount || 0,
                formsCount: formsCount || 0,
                transactionsSum: submissions?.length || 0,
                successfulTransactions: successful.length,
                failedTransactions: failed.length,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                revenueHistory
            };
        }
    });
}
