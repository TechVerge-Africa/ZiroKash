import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Send as SendIcon, Wallet as WalletIcon } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { DepositDialog } from "@/components/wallet/DepositDialog";
import { WithdrawDialog } from "@/components/wallet/WithdrawDialog";
import { SendMoneyDialog } from "@/components/wallet/SendMoneyDialog";
import { ReceiveMoneyDialog } from "@/components/wallet/ReceiveMoneyDialog";

export default function Wallet() {
  const { wallets, transactions, loading, fetchWallets, getWalletByType } = useWallet();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  
  const mainWallet = getWalletByType('main');
  const balance = (mainWallet?.balance || 0) / 100;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your digital wallet</p>
      </div>
      
      {/* Wallet Balance Card */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-4xl font-bold">₵{balance.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Available balance</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button onClick={() => setDepositDialogOpen(true)} variant="outline" className="flex-col h-auto py-4">
              <ArrowDown className="h-5 w-5 mb-1" />
              <span className="text-xs">Deposit</span>
            </Button>
            
            <Button onClick={() => setWithdrawDialogOpen(true)} variant="outline" className="flex-col h-auto py-4">
              <ArrowUp className="h-5 w-5 mb-1" />
              <span className="text-xs">Withdraw</span>
            </Button>
            
            <Button onClick={() => setSendDialogOpen(true)} variant="outline" className="flex-col h-auto py-4">
              <SendIcon className="h-5 w-5 mb-1" />
              <span className="text-xs">Send</span>
            </Button>
            
            <Button onClick={() => setReceiveDialogOpen(true)} variant="outline" className="flex-col h-auto py-4">
              <ArrowDown className="h-5 w-5 mb-1" />
              <span className="text-xs">Receive</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            ) : (
              transactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <WalletIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description || `${tx.transaction_type}`}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    tx.transaction_type === 'deposit' || tx.transaction_type === 'receive' 
                      ? 'text-green-600 dark:text-green-500' 
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {tx.transaction_type === 'deposit' || tx.transaction_type === 'receive' ? '+' : '-'}
                    ₵{(tx.amount / 100).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DepositDialog 
        open={depositDialogOpen} 
        onOpenChange={setDepositDialogOpen}
        onSuccess={fetchWallets}
      />

      <WithdrawDialog 
        open={withdrawDialogOpen} 
        onOpenChange={setWithdrawDialogOpen}
        onSuccess={fetchWallets}
      />

      <SendMoneyDialog 
        open={sendDialogOpen} 
        onOpenChange={setSendDialogOpen}
        onSuccess={fetchWallets}
      />

      <ReceiveMoneyDialog 
        open={receiveDialogOpen} 
        onOpenChange={setReceiveDialogOpen}
      />
    </div>
  );
}
