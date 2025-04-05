
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  transactions: Transaction[];
  className?: string;
}

export default function TransactionsList({ transactions, className }: TransactionsListProps) {
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
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                {transaction.type === "incoming" ? (
                  <div className="bg-green-500/20 h-8 w-8 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  </div>
                ) : transaction.type === "outgoing" ? (
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
                <p className="font-medium truncate">{transaction.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {transaction.type === "incoming" 
                    ? `From: ${transaction.sender}` 
                    : transaction.type === "outgoing" 
                    ? `To: ${transaction.recipient}` 
                    : "Processing..."}
                </p>
              </div>
              
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === "incoming" 
                    ? "text-green-500" 
                    : transaction.type === "outgoing" 
                    ? "text-red-500" 
                    : "text-amber-500"
                }`}>
                  {transaction.type === "incoming" ? "+" : transaction.type === "outgoing" ? "-" : ""}
                  {transaction.currency}{transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
