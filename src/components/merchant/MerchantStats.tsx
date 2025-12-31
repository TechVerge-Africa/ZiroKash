
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
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}
    </div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{metrics.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime collections</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalTx}</div>
          <p className="text-xs text-muted-foreground mt-1">Successful payments</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeForms}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently collecting</p>
        </CardContent>
      </Card>
 
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.uniqueCustomers}</div>
          <p className="text-xs text-muted-foreground mt-1">Unique payers</p>
        </CardContent>
      </Card>
    </div>
  );
}
