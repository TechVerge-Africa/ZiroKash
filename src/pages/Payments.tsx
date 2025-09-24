import { SendMoneyForm } from "@/components/payment/SendMoneyForm";
import { ReceiveMoneyCard } from "@/components/payment/ReceiveMoneyCard";
import { RequestMoneyCard } from "@/components/payment/RequestMoneyCard";
import { MerchantPayments } from "@/components/payment/MerchantPayments";
import { BillPayments } from "@/components/payment/BillPayments";
import { TransactionHistory } from "@/components/payment/TransactionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-2">
          Send, receive, and track your ZiroKash transactions
        </p>
      </div>

      <Tabs defaultValue="send-receive" className="space-y-6">
<TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-4 scrollbar-hide">
  <TabsTrigger value="send-receive" className="flex-shrink-0 text-xs sm:text-sm">
    Send & Receive
  </TabsTrigger>
  <TabsTrigger value="bills" className="flex-shrink-0 text-xs sm:text-sm">
    Bill Payments
  </TabsTrigger>
  <TabsTrigger value="merchants" className="flex-shrink-0 text-xs sm:text-sm">
    Merchants
  </TabsTrigger>
  <TabsTrigger value="history" className="flex-shrink-0 text-xs sm:text-sm">
    History
  </TabsTrigger>
</TabsList>


        <TabsContent value="send-receive" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SendMoneyForm />
            <div className="space-y-6">
              <ReceiveMoneyCard />
              <RequestMoneyCard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bills">
          <BillPayments />
        </TabsContent>

        <TabsContent value="merchants">
          <MerchantPayments />
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
