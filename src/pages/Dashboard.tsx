import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Receipt, Wallet, FileText, TrendingUp, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { useMerchant } from "@/hooks/useMerchant";
import { useMemo, useState, useEffect } from "react";
import { MerchantStats } from "@/components/merchant/MerchantStats";
import { RevenueChart } from "@/components/merchant/RevenueChart";
import { RecentSettlements } from "@/components/merchant/RecentSettlements";
import { RecentTransactions } from "@/components/merchant/RecentTransactions";
import { WithdrawalModal } from "@/components/merchant/WithdrawalModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/loader";

export default function Dashboard() {
  const { wallets, transactions, loading: walletLoading, getWalletByType, fetchPaystackBalance } = useWallet();
  const { forms, stats, isLoading: formsLoading } = usePaymentForms();
  const { isMerchant, loading: merchantLoading } = useMerchant();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBalance, setShowBalance] = useState(() => {
    return localStorage.getItem("zirokash_show_balance") !== "false";
  });

  const toggleBalance = () => {
    setShowBalance(prev => {
      const next = !prev;
      localStorage.setItem("zirokash_show_balance", String(next));
      return next;
    });
  };
  
  // Fetch real-time Paystack balance on mount if user is a merchant
  useEffect(() => {
    if (isMerchant && !merchantLoading) {
      console.log('[Dashboard] Fetching real-time Paystack balance...');
      fetchPaystackBalance();
    }
  }, [isMerchant, merchantLoading, fetchPaystackBalance]);
  
  const mainWallet = getWalletByType('main');
  const merchantWallet = getWalletByType('merchant');
  
  // Show combined balance
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
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isMerchant ? "Manage your business and personal wallet" : "Welcome to your payment collection dashboard"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader variant="spinner" size="lg" />
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isMerchant && <TabsTrigger value="business">Business</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
             {/* Personal / General Overview */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {/* Premium Wallet Balance Card */}
                <Card className="col-span-2 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.15),_0_20px_40px_rgba(0,0,0,0.6)] bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-900/40 transition-all duration-300">
                  {/* Premium Glow and Noise */}
                  <div className="absolute top-0 right-0 w-32 h-32 orb-amber opacity-40 -mr-10 -mt-10 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500/60 to-transparent" />
                  
                  <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-amber-500/80 uppercase tracking-wider">Wallet Balance</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-amber-500/80 hover:text-amber-500 hover:bg-amber-500/10 rounded-full cursor-pointer z-20"
                          onClick={toggleBalance}
                          title={showBalance ? "Hide Balance" : "Show Balance"}
                        >
                          {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
                        </Button>
                        <Wallet className="h-5 w-5 text-amber-500/80 animate-pulse-subtle" />
                      </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                      <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white number-display font-mono-data">
                        {showBalance ? `₵${balance.toFixed(2)}` : "₵ ••••"}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 truncate-text flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          {isMerchant 
                            ? `Business earnings: ₵${showBalance ? merchantBalance.toFixed(2) : "••••"}` 
                            : "Available balance"}
                      </p>
                  </CardContent>
                </Card>

                {/* Total Collected Stats Card */}
                <Card className="col-span-2 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-primary/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.08),_0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-3xl font-bold truncate-text number-display font-mono-data text-white">
                        ₵{dashboardStats.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate-text">From {dashboardStats.totalPaid} paid submissions</p>
                  </CardContent>
                </Card>
                
                {/* Active Forms Stats Card */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-primary/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.08),_0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-3xl font-bold text-white">{dashboardStats.activeForms}</div>
                      <p className="text-xs text-muted-foreground mt-1">Accepting payments</p>
                  </CardContent>
                </Card>

                {/* Total Submissions Stats Card */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-1 glass-card relative overflow-hidden group transform-card hover:border-primary/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.08),_0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-3xl font-bold text-white">{dashboardStats.totalSubmissions}</div>
                      <p className="text-xs text-muted-foreground mt-1">All form submissions</p>
                  </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
                {/* Recent Activity Section */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-4 glass-card">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No recent activity</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                         {transactions.slice(0, 5).map((tx) => {
                            const isReceive = tx.transaction_type === 'receive';
                            return (
                              <div 
                                key={tx.id} 
                                className="flex justify-between items-center gap-4 bg-slate-900/30 border border-slate-800/40 p-3 rounded-xl hover:bg-slate-900/50 hover:border-slate-800/80 transition-all duration-200 group/item"
                              >
                                  <div className="flex items-center gap-3 min-w-0">
                                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 ${
                                        isReceive ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-400'
                                      }`}>
                                          {isReceive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                                      </div>
                                      <div className="min-w-0">
                                          <p className="font-semibold text-sm truncate-text text-slate-200">{tx.description || tx.transaction_type}</p>
                                          <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                                  <div className={`font-bold font-mono-data text-sm flex-shrink-0 ${
                                    isReceive ? 'text-green-500' : 'text-slate-300'
                                  }`}>
                                      {isReceive ? '+' : '-'}₵{(tx.amount / 100).toFixed(2)}
                                  </div>
                              </div>
                            );
                         })}
                        </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Quick Actions Bento Card */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-3 glass-card">
                    <CardHeader>
                     <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl cursor-pointer" asChild>
                            <Link to="/zirokash" className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 stroke-[2.5]" />
                              Create Payment Form
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-11 border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer" asChild>
                            <Link to="/transactions" className="flex items-center">
                                <Receipt className="mr-2 h-4 w-4 text-slate-400" />
                                View Transactions
                            </Link>
                        </Button>
                        {isMerchant && (
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-11 border-primary/20 hover:border-primary/40 hover:bg-primary/5 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                                onClick={() => setShowWithdraw(true)}
                            >
                                <Wallet className="mr-2 h-4 w-4 text-primary" />
                                <span className="text-primary font-semibold">Withdraw Earnings</span>
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