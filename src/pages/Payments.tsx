import { SendMoneyForm } from "@/components/payment/SendMoneyForm";
import { ReceiveMoneyCard } from "@/components/payment/ReceiveMoneyCard";
import { TransactionHistory } from "@/components/payment/TransactionHistory";

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-2">
          Send, receive, and track your blockchain transactions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SendMoneyForm />
        <ReceiveMoneyCard />
      </div>

      <TransactionHistory />
    </div>
  );
}
