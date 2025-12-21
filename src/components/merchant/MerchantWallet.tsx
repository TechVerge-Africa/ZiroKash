import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMerchant } from "@/hooks/useMerchant";
import { Loader2, Wallet, TrendingUp, ArrowDownToLine } from "lucide-react";
import { WithdrawalForm } from "./WithdrawalForm";

interface MerchantStats {
  totalReceived: number;
  pendingAmount: number;
  transactionCount: number;
}

export function MerchantWallet() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [stats, setStats] = useState<MerchantStats>({ totalReceived: 0, pendingAmount: 0, transactionCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    if (merchant) {
      fetchStats();
    }
  }, [merchant]);

  const fetchStats = async () => {
    try {
      // Get submissions for forms owned by this merchant
      const { data: forms } = await supabase
        .from('payment_forms')
        .select('id')
        .eq('user_id', merchant!.user_id);

      if (!forms || forms.length === 0) {
        setLoading(false);
        return;
      }

      const formIds = forms.map(f => f.id);

      const { data: submissions } = await supabase
        .from('form_submissions')
        .select('amount, status')
        .in('form_id', formIds);

      if (submissions) {
        const totalReceived = submissions
          .filter(s => s.status === 'paid')
          .reduce((sum, s) => sum + (s.amount || 0), 0);
        
        const pendingAmount = submissions
          .filter(s => s.status === 'pending')
          .reduce((sum, s) => sum + (s.amount || 0), 0);

        const transactionCount = submissions.filter(s => s.status === 'paid').length;

        setStats({ totalReceived, pendingAmount, transactionCount });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  if (merchantLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!merchant || !merchant.paystack_subaccount_code) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(stats.totalReceived)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{formatAmount(stats.pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <ArrowDownToLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{stats.transactionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Withdrawals</CardTitle>
            <CardDescription>
              Payments are automatically settled to your bank account via Paystack
            </CardDescription>
          </div>
          <Button onClick={() => setShowWithdraw(!showWithdraw)}>
            {showWithdraw ? 'Cancel' : 'Manual Withdrawal'}
          </Button>
        </CardHeader>
        {showWithdraw && (
          <CardContent>
            <WithdrawalForm onSuccess={() => setShowWithdraw(false)} />
          </CardContent>
        )}
      </Card>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Settlement Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name</span>
              <span className="font-medium">{merchant.settlement_account_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Number</span>
              <span className="font-mono">
                {merchant.settlement_account_number?.slice(-4).padStart(10, '•')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Settlement</span>
              <span className="text-green-600">Automatic (T+1)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
