import { MerchantPayments } from "@/components/payment/MerchantPayments";
import { BillPayments } from "@/components/payment/BillPayments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-1">Send, receive, and manage payments</p>
      </div>

      <Tabs defaultValue="bills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bills">Bill Payments</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
        </TabsList>

        <TabsContent value="bills">
          <BillPayments />
        </TabsContent>

        <TabsContent value="merchants">
          <MerchantPayments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
