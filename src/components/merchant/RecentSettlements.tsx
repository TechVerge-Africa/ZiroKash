import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMerchant } from "@/hooks/useMerchant";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function RecentSettlements() {
    const { merchant, loading: merchantLoading } = useMerchant();

    const { data: settlements = [], isLoading: settlementsLoading } = useQuery({
        queryKey: ['recent-settlements', merchant?.id],
        queryFn: async () => {
            if (!merchant) return [];
            const { data, error } = await supabase
                .from('settlements')
                .select('*')
                .eq('merchant_id', merchant.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            return data;
        },
        enabled: !!merchant
    });

    const loading = merchantLoading || settlementsLoading;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Payouts</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
            </div>
        ) : settlements.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
                No recent payouts
            </div>
        ) : (
            <div className="space-y-4">
            {settlements.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div>
                    <p className="font-medium">Settlement #{s.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                        {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A'} • {s.settlement_type}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={s.status === 'completed' ? 'default' : 'secondary'}>
                        {s.status}
                    </Badge>
                    <span className="font-bold">₵{(s.amount / 100).toFixed(2)}</span>
                </div>
                </div>
            ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
