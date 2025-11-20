import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Receipt, Wallet, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
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
        </CardContent>
      </Card>
    </div>;
}