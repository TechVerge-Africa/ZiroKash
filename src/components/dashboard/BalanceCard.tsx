
import { CreditCard, DollarSign, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/modals/FormDialogs";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export default function BalanceCard({ balance, currency }: BalanceCardProps) {
  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-md font-medium">Total Balance</CardTitle>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <RefreshCw size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold mr-2">{balance.toLocaleString()}</span>
          <span className="text-xl text-muted-foreground">{currency}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <FormDialog
            trigger={
              <Button className="w-full bg-primary hover:bg-primary/90">
                <DollarSign className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            }
            title="Add Funds to Wallet"
            description="Choose your preferred payment method"
            formType="deposit"
          />
          <FormDialog
            trigger={
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            }
            title="Withdraw Funds"
            description="Choose your preferred withdrawal method"
            formType="withdraw"
          />
        </div>
      </CardContent>
    </Card>
  );
}
