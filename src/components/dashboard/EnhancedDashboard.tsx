import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  TrendingUp,
  DollarSign,
  Target,
  PiggyBank,
  Smartphone,
  Shield,
  Gift,
  Eye,
  EyeOff,
  Plus,
  Send,
  Download,
  Banknote
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useCredit } from "@/hooks/useCredit";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import CreditCardComponent from "@/components/cards/CreditCardComponent";

interface QuickStatProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

function QuickStat({ title, value, change, isPositive, icon, onClick }: QuickStatProps) {
  return (
    <Card className="glass-card border-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={cn(
                "text-xs flex items-center",
                isPositive ? "text-green-500" : "text-red-500"
              )}>
                {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownLeft className="h-3 w-3 mr-1" />}
                {change}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentTransactionProps {
  id: string;
  type: 'send' | 'receive' | 'card' | 'bill';
  title: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  formattedAmount: string;
}

function RecentTransaction({ type, title, amount, currency, date, status, formattedAmount }: RecentTransactionProps) {
  const getIcon = () => {
    switch (type) {
      case 'send': return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'receive': return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'card': return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'bill': return <Smartphone className="h-4 w-4 text-purple-500" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          "font-medium text-sm",
          type === 'receive' ? "text-green-500" : "text-foreground"
        )}>
          {type === 'receive' ? '+' : '-'}{formattedAmount}
        </p>
        <Badge 
          variant={status === 'completed' ? "default" : status === 'pending' ? "secondary" : "destructive"}
          className="text-xs"
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name;
  const firstName = fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const { wallets, transactions, loading: walletLoading, getTotalBalance } = useWallet();
  const { creditCards, loading: creditLoading } = useCredit();
  const { formatAmount, convertAmount, loading: currencyLoading } = useCurrency();
  const [hideBalance, setHideBalance] = useState(false);

  const stats = useMemo(() => {
    const totalBalanceUSD = getTotalBalance();
    const totalBalance = convertAmount(totalBalanceUSD, 'USD');
    
    const totalCreditUSD = creditCards.reduce((sum, card) => sum + card.credit_limit, 0);
    const totalCredit = convertAmount(totalCreditUSD / 100, 'USD');
    
    const monthlySpendUSD = transactions
      .filter(t => new Date(t.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + (t.transaction_type === 'send' ? (t.amount / 100) : 0), 0);
    const monthlySpend = convertAmount(monthlySpendUSD, 'USD');
    
    const savingsBalanceUSD = (wallets.find(w => w.wallet_type === 'savings')?.balance || 0) / 100;
    const savingsBalance = convertAmount(savingsBalanceUSD, 'USD');

    return {
      totalBalance,
      totalCredit,
      monthlySpend,
      savingsBalance
    };
  }, [wallets, creditCards, transactions, getTotalBalance, convertAmount]);

  const recentTransactions: RecentTransactionProps[] = useMemo(() => {
    return transactions.slice(0, 5).map(t => {
      const amountUSD = t.amount / 100;
      const convertedAmount = convertAmount(amountUSD, 'USD');
      
      return {
        id: t.id,
        type: t.transaction_type === 'receive' ? 'receive' : 'send',
        title: t.description || `${t.transaction_type} Transaction`,
        amount: convertedAmount,
        currency: t.currency,
        date: new Date(t.created_at).toLocaleDateString(),
        status: t.status === 'pending' ? 'pending' : t.status === 'failed' ? 'failed' : 'completed',
        formattedAmount: formatAmount(convertedAmount)
      };
    });
  }, [transactions, convertAmount, formatAmount]);

  if (walletLoading || creditLoading || currencyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-8 animate-fade-up-delayed">
      {/* Header - Mobile Optimized */}
      <div className="glass-card rounded-xl p-4 md:p-6 border border-white/10">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with your money today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/payments">
                <Send className="mr-2 h-4 w-4" />
                Send Money
              </Link>
            </Button>
            <Button className="w-full sm:w-auto" asChild>
              <Link to="/wallet">
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats - 2x2 Grid on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <QuickStat
          title="Total Balance"
          value={hideBalance ? "****" : formatAmount(stats.totalBalance)}
          change={null}
          isPositive={true}
          icon={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideBalance(!hideBalance)}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          }
          onClick={() => {}}
        />
        
        <QuickStat
          title="Savings"
          value={formatAmount(stats.savingsBalance)}
          change={null}
          isPositive={true}
          icon={<PiggyBank className="h-6 w-6 text-primary" />}
          onClick={() => {}}
        />
        
        <QuickStat
          title="Monthly Spending"
          value={formatAmount(stats.monthlySpend)}
          change={null}
          isPositive={true}
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          onClick={() => {}}
        />
        
        <QuickStat
          title="Available Credit"
          value={formatAmount(stats.totalCredit)}
          change={null}
          icon={<CreditCard className="h-6 w-6 text-primary" />}
          onClick={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions - 2x2 Grid on Mobile */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                <Button className="h-16 md:h-20 flex flex-col items-center gap-1 md:gap-2 min-h-[44px]" variant="outline" asChild>
                  <Link to="/payments">
                    <Send className="h-4 w-4 md:h-6 md:w-6" />
                    <span className="text-xs">Send Money</span>
                  </Link>
                </Button>
                
                <Button className="h-16 md:h-20 flex flex-col items-center gap-1 md:gap-2 min-h-[44px]" variant="outline" asChild>
                  <Link to="/payments">
                    <Download className="h-4 w-4 md:h-6 md:w-6" />
                    <span className="text-xs">Request</span>
                  </Link>
                </Button>
                
                <Button className="h-16 md:h-20 flex flex-col items-center gap-1 md:gap-2 min-h-[44px]" variant="outline" asChild>
                  <Link to="/payments">
                    <Smartphone className="h-4 w-4 md:h-6 md:w-6" />
                    <span className="text-xs">Pay Bills</span>
                  </Link>
                </Button>
                
                <Button className="h-16 md:h-20 flex flex-col items-center gap-1 md:gap-2 min-h-[44px]" variant="outline" asChild>
                  <Link to="/wallet">
                    <Banknote className="h-4 w-4 md:h-6 md:w-6" />
                    <span className="text-xs">Top Up</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards Preview */}
          {creditCards.length > 0 && (
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Your Cards</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/cards">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creditCards.slice(0, 2).map((card) => (
                    <CreditCardComponent
                      key={card.id}
                      id={card.id}
                      cardName={card.card_name}
                      cardNumber={card.card_number}
                      cardType={card.card_type}
                      balance={card.current_balance}
                      creditLimit={card.credit_limit}
                      isFrozen={card.is_frozen}
                      isActive={card.is_active}
                      className="max-w-none"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/payments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                  <RecentTransaction key={transaction.id} {...transaction} />
                )) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Status */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Status</span>
                <Badge variant="default" className="bg-green-500">Verified</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/security">Security Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}