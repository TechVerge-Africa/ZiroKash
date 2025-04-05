
import { ArrowDown, ArrowUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Transaction = {
  id: string;
  type: "incoming" | "outgoing" | "pending";
  title: string;
  amount: number;
  currency: string;
  date: string;
  recipient?: string;
  sender?: string;
  status?: "completed" | "processing" | "failed";
};

interface TransactionsListProps {
  transactions: Transaction[];
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-md font-medium">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between hover:bg-white/5 py-3 px-4 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  transaction.type === "incoming" ? "bg-green-500/10" : 
                  transaction.type === "outgoing" ? "bg-red-500/10" : "bg-yellow-500/10"
                )}>
                  {transaction.type === "incoming" ? (
                    <ArrowDown className={cn(
                      "h-5 w-5",
                      transaction.type === "incoming" ? "text-green-500" : 
                      transaction.type === "outgoing" ? "text-red-500" : "text-yellow-500"
                    )} />
                  ) : transaction.type === "outgoing" ? (
                    <ArrowUp className={cn(
                      "h-5 w-5",
                      transaction.type === "incoming" ? "text-green-500" : 
                      transaction.type === "outgoing" ? "text-red-500" : "text-yellow-500"
                    )} />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.type === "incoming" 
                      ? `From: ${transaction.sender}` 
                      : `To: ${transaction.recipient}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-medium",
                  transaction.type === "incoming" ? "text-green-500" : 
                  transaction.type === "outgoing" ? "text-red-500" : "text-yellow-500"
                )}>
                  {transaction.type === "incoming" ? "+" : "-"}{transaction.amount} {transaction.currency}
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
