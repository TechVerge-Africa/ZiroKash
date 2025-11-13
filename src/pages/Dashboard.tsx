import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Send, Wallet, TrendingUp } from "lucide-react";
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
        <p className="text-muted-foreground mt-1">Welcome back to ZiroKash</p>
      </div>

      {/* Balance Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₵{balance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-6 flex-col" asChild>
              <Link to="/wallet">
                <ArrowDown className="h-6 w-6 mb-2" />
                <span className="text-sm">Deposit</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex-col" asChild>
              <Link to="/wallet">
                <ArrowUp className="h-6 w-6 mb-2" />
                <span className="text-sm">Withdraw</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex-col" asChild>
              <Link to="/wallet">
                <Send className="h-6 w-6 mb-2" />
                <span className="text-sm">Send Money</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex-col" asChild>
              <Link to="/savings">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">Savings</span>
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