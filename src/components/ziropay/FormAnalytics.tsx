import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, CheckCircle, Clock } from "lucide-react";

interface AnalyticsProps {
  formId: string;
}

export default function FormAnalytics({ formId }: AnalyticsProps) {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    paidSubmissions: 0,
    pendingSubmissions: 0,
    totalAmount: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [formId]);

  const fetchAnalytics = async () => {
    try {
      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', formId);

      if (error) throw error;

      const total = submissions?.length || 0;
      const paid = submissions?.filter(s => s.status === 'paid').length || 0;
      const pending = submissions?.filter(s => s.status === 'pending').length || 0;
      const amount = submissions
        ?.filter(s => s.status === 'paid')
        .reduce((sum, s: any) => sum + (s.net_amount || s.amount || 0), 0) || 0;

      setStats({
        totalSubmissions: total,
        paidSubmissions: paid,
        pendingSubmissions: pending,
        totalAmount: amount / 100 // Convert from kobo/pesewas
      });

      // Group by date for chart
      const groupedByDate = submissions?.reduce((acc: any, sub) => {
        const date = new Date(sub.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, amount: 0, count: 0 };
        }
        if (sub.status === 'paid') {
          acc[date].amount += ((sub as any).net_amount || sub.amount) / 100;
          acc[date].count += 1;
        }
        return acc;
      }, {});

      setChartData(Object.values(groupedByDate || {}));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
            <CardDescription>Daily payment collection overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}