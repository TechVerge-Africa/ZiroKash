
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpRight } from "lucide-react";
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
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-3.5 border border-slate-800/40 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-800/80 transition-all duration-200 group/item"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 bg-green-500/10 text-green-500">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm text-slate-200 truncate-text">
                                {tx.metadata?.name || "Customer Payment"}
                            </span>
                            <span className="text-[11px] text-muted-foreground mt-0.5 truncate-text">
                                {new Date(tx.created_at).toLocaleDateString()} • {tx.metadata?.form_title || "Payment Link"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                            <div className="font-bold text-green-500 font-mono-data text-sm">
                                +₵{(tx.amount / 100).toFixed(2)}
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-[9px] font-semibold h-4 px-1.5 mt-0.5 uppercase tracking-wide bg-green-500/5 border-green-500/20 text-green-400"
                            >
                                {tx.status}
                            </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                          onClick={() => setSelectedTx({
                              ...tx,
                              form_title: tx.metadata?.form_title,
                              metadata: tx.metadata
                          })}
                        >
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
