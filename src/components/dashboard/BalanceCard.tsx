
import { CreditCard, DollarSign, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export default function BalanceCard({ balance, currency }: BalanceCardProps) {
  const { formatAmount, convertAmount, userCurrency } = useCurrency();
  const convertedBalance = convertAmount(balance, 'USD');
  
  return (
    <Card className={cn(
        "overflow-hidden transition-all duration-200",
        "dark:glass-card dark:border-white/10",
        "bg-white border-border/50 shadow-sm", // Light mode styles
        "hover:shadow-md hover:border-primary/20" // Interactive hover effect
      )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-md font-medium">Total Balance</CardTitle>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <RefreshCw size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold mr-2">{formatAmount(convertedBalance)}</span>
          <span className="text-xl text-muted-foreground">{userCurrency}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link to="/wallet">
              <DollarSign className="mr-2 h-4 w-4" />
              Add Funds
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/wallet">
              <CreditCard className="mr-2 h-4 w-4" />
              Withdraw
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
