
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { ReceiptViewer } from "./ReceiptViewer";

export function RecentTransactions() {
  const { transactions, loading } = useWallet();
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Filter for incoming payments (deposits) which likely mock customer payments
  // In a real app we'd query the 'transactions' table for type='payment_form_submission' or similar
  const sales = transactions.filter(tx => tx.transaction_type === "receive" || (tx as any).metadata?.type === "payment_link");

  if (loading) return <div>Loading sales...</div>;

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest payments from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent transactions found.</p>
            ) : (
                sales.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                    <div className="flex flex-col">
                    <span className="font-medium">{tx.metadata?.name || "Customer Payment"}</span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()} • {tx.metadata?.form_title || "Payment Link"}
                    </span>
                    </div>
                    <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="font-bold text-green-500">+₵{(tx.amount / 100).toFixed(2)}</div>
                        <Badge variant="outline" className="text-[10px] h-5">{tx.status}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedTx({
                        ...tx,
                        form_title: tx.metadata?.form_title,
                        metadata: tx.metadata
                    })}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      <ReceiptViewer 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
        transaction={selectedTx} 
      />
    </>
  );
}
