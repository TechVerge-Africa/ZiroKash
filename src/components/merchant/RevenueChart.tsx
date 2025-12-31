import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { useMemo } from "react";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function RevenueChart() {
  const { user } = useAuth();
  
  const { data: revenueData = [], isLoading } = useQuery({
    queryKey: ['revenue-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: forms } = await supabase
        .from('payment_forms')
        .select('id')
        .eq('user_id', user.id);
        
      if (!forms || forms.length === 0) return [];
      const formIds = forms.map(f => f.id);

      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('amount, created_at')
        .in('form_id', formIds)
        .gte('created_at', sevenDaysAgo)
        .eq('status', 'paid');

      if (error) throw error;

      // Group by day
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          name: format(date, 'EEE'),
          date: date,
          total: 0
        };
      });

      submissions?.forEach(sub => {
        const subDate = new Date(sub.created_at!);
        const day = days.find(d => isSameDay(d.date, subDate));
        if (day) {
          day.total += sub.amount / 100;
        }
      });

      return days;
    },
    enabled: !!user
  });

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Daily revenue for the past week</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₵${value}`}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.1)'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)' }}
                  formatter={(value: number) => [`₵${value.toFixed(2)}`, "Total Revenue"]}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
