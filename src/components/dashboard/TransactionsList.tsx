
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatDistanceToNow } from "date-fns";

export interface Transaction {
  id: string;
  type: "incoming" | "outgoing" | "pending";
  title: string;
  amount: number;
  currency: string;
  date: string;
  sender?: string;
  recipient?: string;
  status: "completed" | "processing" | "failed";
}

interface TransactionsListProps {
  className?: string;
}

export default function TransactionsList({ className }: TransactionsListProps) {
  const { transactions, loading } = useWallet();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map((transaction) => {
            const isIncoming = transaction.transaction_type === 'receive' || transaction.transaction_type === 'deposit';
            const isOutgoing = transaction.transaction_type === 'send' || transaction.transaction_type === 'withdraw';
            
            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center">
                  {isIncoming ? (
                    <div className="bg-green-500/20 h-8 w-8 rounded-full flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    </div>
                  ) : isOutgoing ? (
                    <div className="bg-red-500/20 h-8 w-8 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    </div>
                  ) : (
                    <div className="bg-amber-500/20 h-8 w-8 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {transaction.description || 
                     (transaction.recipient_address && `To: ${transaction.recipient_address}`) ||
                     (transaction.sender_address && `From: ${transaction.sender_address}`) ||
                     'No description'
                    }
                  </p>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <p className={`font-medium ${
                      isIncoming ? "text-green-600" : "text-red-600"
                    }`}>
                      {isIncoming ? "+" : "-"}${(transaction.amount / 100).toFixed(2)}
                    </p>
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
