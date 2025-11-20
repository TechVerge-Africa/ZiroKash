import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Receipt, Wallet, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
<<<<<<< HEAD
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { useMemo } from "react";

export default function Dashboard() {
  const { wallets, transactions, loading: walletLoading, getWalletByType } = useWallet();
  const { forms, stats, isLoading: formsLoading } = usePaymentForms();
  
  const mainWallet = getWalletByType('main');
  const balance = (mainWallet?.balance || 0) / 100;

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

  const loading = walletLoading || formsLoading;
  
  return (
    <div className="space-y-6">
=======
export default function Dashboard() {
  const {
    wallets,
    transactions,
    loading,
    getWalletByType
  } = useWallet();
  const mainWallet = getWalletByType('main');
  const balance = (mainWallet?.balance || 0) / 100;
  return <div className="space-y-6">
>>>>>>> 166a6eaa3b2a86911f9317c885b92c9d5b184417
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your payment collection dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold">₵{dashboardStats.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {dashboardStats.totalPaid} paid submissions
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold">{dashboardStats.activeForms}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently accepting payments
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold">{dashboardStats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All form submissions
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold">₵{balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Available balance
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-6 flex-col" asChild>
              <Link to="/ziropay">
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-sm">Create Payment Form</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex-col" asChild>
              <Link to="/transactions">
                <Receipt className="h-6 w-6 mb-2" />
                <span className="text-sm">View Transactions</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 && forms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No recent activity</p>
              <Button variant="outline" asChild>
                <Link to="/ziropay">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions
                .filter(tx => 
                  tx.transaction_type === 'corporate_collection' || 
                  tx.transaction_type === 'receive' ||
                  tx.description?.toLowerCase().includes('form') ||
                  tx.description?.toLowerCase().includes('payment')
                )
                .slice(0, 5)
                .map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.description || tx.transaction_type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-green-600 dark:text-green-500">
                      +₵{(tx.amount / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              {transactions.filter(tx => 
                tx.transaction_type === 'corporate_collection' || 
                tx.transaction_type === 'receive' ||
                tx.description?.toLowerCase().includes('form') ||
                tx.description?.toLowerCase().includes('payment')
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No payment collections yet</p>
                  <Button variant="outline" asChild>
                    <Link to="/ziropay">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Create Payment Form
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
=======
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : transactions.length === 0 ? <p className="text-center text-muted-foreground py-8">No recent activity</p> : <div className="space-y-3">
              {transactions.slice(0, 5).map(tx => <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description || tx.transaction_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-medium ${tx.transaction_type === 'deposit' || tx.transaction_type === 'receive' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                    {tx.transaction_type === 'deposit' || tx.transaction_type === 'receive' ? '+' : '-'}
                    ₵{(tx.amount / 100).toFixed(2)}
                  </p>
                </div>)}
            </div>}
>>>>>>> 166a6eaa3b2a86911f9317c885b92c9d5b184417
        </CardContent>
      </Card>
    </div>;
}