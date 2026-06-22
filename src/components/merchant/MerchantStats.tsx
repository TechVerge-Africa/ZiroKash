
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export function MerchantStats() {
  const { forms, stats, isLoading: formsLoading } = usePaymentForms();
  const { user } = useAuth();

  const { data: uniqueCustomerCount = 0, isLoading: customersLoading } = useQuery({
    queryKey: ['unique-customers', user?.id],
    queryFn: async () => {
        if (!user) return 0;
        
        const { data: forms } = await supabase
            .from('payment_forms')
            .select('id')
            .eq('user_id', user.id);
            
        if (!forms || forms.length === 0) return 0;
        const formIds = forms.map(f => f.id);

        const { data, error } = await supabase
            .from('form_submissions')
            .select('payer_email')
            .in('form_id', formIds)
            .eq('status', 'paid');
            
        if (error) throw error;
        
        const emails = new Set(data?.map(s => s.payer_email).filter(Boolean));
        return emails.size;
    },
    enabled: !!user
  });

  const metrics = useMemo(() => {
    const totalCollected = Object.values(stats).reduce((sum, s) => sum + s.totalCollected, 0);
    const totalTx = Object.values(stats).reduce((sum, s) => sum + s.paidSubmissions, 0);
    const activeForms = forms.filter(f => f.is_active).length;
    
    return {
      totalCollected,
      totalTx,
      activeForms,
      uniqueCustomers: uniqueCustomerCount
    };
  }, [stats, forms, uniqueCustomerCount]);

  const isLoading = formsLoading || customersLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <div className="col-span-2 md:col-span-1 lg:col-span-1 h-32 bg-slate-900/40 border border-slate-800/40 animate-pulse rounded-xl" />
        <div className="col-span-2 md:col-span-1 lg:col-span-1 h-32 bg-slate-900/40 border border-slate-800/40 animate-pulse rounded-xl" />
        <div className="col-span-1 md:col-span-1 lg:col-span-1 h-32 bg-slate-900/40 border border-slate-800/40 animate-pulse rounded-xl" />
        <div className="col-span-1 md:col-span-1 lg:col-span-1 h-32 bg-slate-900/40 border border-slate-800/40 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Total Revenue Card (Gold Theme) */}
      <Card className="col-span-2 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.15),_0_20px_40px_rgba(0,0,0,0.6)] bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-900/40 transition-all duration-300">
        {/* Premium Glow and Noise */}
        <div className="absolute top-0 right-0 w-32 h-32 orb-amber opacity-40 -mr-10 -mt-10 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500/60 to-transparent" />
        
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-amber-500/80 uppercase tracking-wider">Total Revenue</CardTitle>
          <DollarSign className="h-5 w-5 text-amber-500/80 animate-pulse-subtle" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white number-display font-mono-data">
            ₵{metrics.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate-text flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Lifetime collections
          </p>
        </CardContent>
      </Card>
      
      {/* Transactions Card */}
      <Card className="col-span-2 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-primary/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.08),_0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{metrics.totalTx}</div>
          <p className="text-xs text-muted-foreground mt-1">Successful payments</p>
        </CardContent>
      </Card>
      
      {/* Active Forms Card */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-primary/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.08),_0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{metrics.activeForms}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently collecting</p>
        </CardContent>
      </Card>
 
      {/* Active Customers Card */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-primary/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.08),_0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{metrics.uniqueCustomers}</div>
          <p className="text-xs text-muted-foreground mt-1">Unique payers</p>
        </CardContent>
      </Card>
    </div>
  );
}
