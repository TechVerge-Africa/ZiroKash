import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { formatDistanceToNow } from "date-fns";

export function TransactionHistory() {
  const { transactions, loading } = useWallet();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'receive':
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Your recent blockchain transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet. Start by sending or receiving money!
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.transaction_type)}
                  <div>
                    <p className="font-medium">
                      {transaction.transaction_type === 'send' ? 'Sent' : 
                       transaction.transaction_type === 'receive' ? 'Received' :
                       transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.description || 
                       (transaction.recipient_address && `To: ${transaction.recipient_address.slice(0, 10)}...`) ||
                       (transaction.sender_address && `From: ${transaction.sender_address.slice(0, 10)}...`) ||
                       'No description'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      transaction.transaction_type === 'send' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.transaction_type === 'send' ? '-' : '+'}${(transaction.amount / 100).toFixed(2)}
                    </span>
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}