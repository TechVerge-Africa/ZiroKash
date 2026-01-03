import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Receipt, Wallet, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { useMerchant } from "@/hooks/useMerchant";
import { useMemo, useState } from "react";
import { MerchantStats } from "@/components/merchant/MerchantStats";
import { RevenueChart } from "@/components/merchant/RevenueChart";
import { RecentSettlements } from "@/components/merchant/RecentSettlements";
import { RecentTransactions } from "@/components/merchant/RecentTransactions";
import { WithdrawalModal } from "@/components/merchant/WithdrawalModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { wallets, transactions, loading: walletLoading, getWalletByType } = useWallet();
  const { forms, stats, isLoading: formsLoading } = usePaymentForms();
  const { isMerchant, loading: merchantLoading } = useMerchant();
  const [showWithdraw, setShowWithdraw] = useState(false);
  
  const mainWallet = getWalletByType('main');
  const merchantWallet = getWalletByType('merchant');
  
  // Show combined balance or prioritize the one with funds
  const balance = ((mainWallet?.balance || 0) + (merchantWallet?.balance || 0)) / 100;
  const merchantBalance = (merchantWallet?.balance || 0) / 100;

  // Calculate aggregated stats from all forms
  const dashboardStats = useMemo(() => {
    const totalCollected = Object.values(stats).reduce((sum, s) => sum + s.totalCollected, 0);
    const totalSubmissions = Object.values(stats).reduce((sum, s) => sum + s.totalSubmissions, 0);
    const totalPaid = Object.values(stats).reduce((sum, s) => sum + s.paidSubmissions, 0);
    const activeForms = forms.filter(f => f.is_active).length;
    
    return {
      totalCollected,
      totalSubmissions,
      totalPaid,
      activeForms
    };
  }, [stats, forms]);

  const loading = walletLoading || formsLoading || merchantLoading;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isMerchant ? "Manage your business and personal wallet" : "Welcome to your payment collection dashboard"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isMerchant && <TabsTrigger value="business">Business</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
             {/* Personal / General Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">₵{balance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isMerchant ? `Includes ₵${merchantBalance.toFixed(2)} business earnings` : "Available balance"}
                    </p>
                </CardContent>
                </Card>

                <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">₵{dashboardStats.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground mt-1">From {dashboardStats.totalPaid} paid submissions</p>
                </CardContent>
                </Card>
                
                <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{dashboardStats.activeForms}</div>
                    <p className="text-xs text-muted-foreground mt-1">Accepting payments</p>
                </CardContent>
                </Card>

                <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{dashboardStats.totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground mt-1">All form submissions</p>
                </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-border">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                        <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No recent activity</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                         {transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center bg-muted/40 p-3 rounded-lg">
                                <div>
                                    <p className="font-medium">{tx.description || tx.transaction_type}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className={`font-bold ${tx.transaction_type === 'receive' ? 'text-green-500' : 'text-foreground'}`}>
                                    {tx.transaction_type === 'receive' ? '+' : '-'}₵{(tx.amount / 100).toFixed(2)}
                                </div>
                            </div>
                         ))}
                        </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="col-span-3 glass-card border-border">
                    <CardHeader>
                     <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" asChild>
                            <Link to="/zirokash">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Create Payment Form
                            </Link>
                        </Button>
                         <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/transactions">
                                <Receipt className="mr-2 h-4 w-4" />
                                View Transactions
                            </Link>
                        </Button>
                        {isMerchant && (
                            <Button 
                                variant="outline" 
                                className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => setShowWithdraw(true)}
                            >
                                <Wallet className="mr-2 h-4 w-4" />
                                Withdraw Earnings
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
          
            {isMerchant && (
                <TabsContent value="business" className="space-y-6">
                    <MerchantStats />
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                        <RevenueChart />
                        </div>
                        <div className="space-y-6">
                           <RecentSettlements />
                        </div>
                    </div>
                    <RecentTransactions />
                </TabsContent>
            )}
        </Tabs>
      )}
      
      <WithdrawalModal 
        isOpen={showWithdraw} 
        onClose={() => setShowWithdraw(false)} 
      />
    </div>
  );
}