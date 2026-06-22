import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMerchant } from "@/hooks/useMerchant";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownLeft } from "lucide-react";

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
             <div className="space-y-3">
             {settlements.map((s) => {
                 const isCompleted = s.status === 'completed' || s.status === 'paid';
                 return (
                   <div 
                     key={s.id} 
                     className="flex items-center justify-between p-3.5 border border-slate-800/40 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-800/80 transition-all duration-200 group/item"
                   >
                     <div className="flex items-center gap-3 min-w-0">
                         <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 bg-slate-800 text-slate-400">
                             <ArrowDownLeft className="h-4 w-4" />
                         </div>
                         <div className="flex flex-col min-w-0">
                             <span className="font-semibold text-sm text-slate-200 truncate-text">
                                 Payout #{s.id.slice(0, 8)}
                             </span>
                             <span className="text-[11px] text-muted-foreground mt-0.5 truncate-text">
                                 {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A'} • {s.settlement_type}
                             </span>
                         </div>
                     </div>
                     <div className="flex items-center gap-3 flex-shrink-0">
                         <div className="text-right">
                             <div className="font-bold text-slate-300 font-mono-data text-sm">
                                 ₵{(s.amount / 100).toFixed(2)}
                             </div>
                             <Badge 
                               variant={isCompleted ? 'default' : 'secondary'} 
                               className={`text-[9px] font-semibold h-4 px-1.5 mt-0.5 uppercase tracking-wide ${
                                 isCompleted ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20 text-amber-400 hover:bg-amber-500/25' : ''
                               }`}
                             >
                                 {s.status}
                             </Badge>
                         </div>
                     </div>
                   </div>
                 );
             })}
             </div>
        )}
      </CardContent>
    </Card>
  );
}
