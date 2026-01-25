import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useCurrency } from "@/hooks/useCurrency";
import { format } from "date-fns";

export default function Transactions() {
  const { transactions, loading } = useWallet();
  const { formatAmount } = useCurrency();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid': 
        return 'bg-secondary text-secondary-foreground';
      case 'pending': return 'bg-accent text-accent-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader variant="spinner" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground mt-2">View your payment collection history</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All your transaction activity in one place</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-sm truncate-text max-w-[120px]">
                        {transaction.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4 truncate-text max-w-[150px]">
                        {getTransactionType(transaction.transaction_type)}
                      </td>
                      <td className="py-3 px-4 font-semibold number-display whitespace-nowrap">
                        {transaction.transaction_type === 'receive' || transaction.transaction_type === 'deposit' ? '+' : '-'}
                        {formatAmount(transaction.amount / 100)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
