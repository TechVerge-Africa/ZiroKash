
import { useMemo } from "react";
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActions from "@/components/dashboard/QuickActions";
import TransactionsList, { Transaction } from "@/components/dashboard/TransactionsList";
import CryptoPrices from "@/components/dashboard/CryptoPrices";
import SavingsCard from "@/components/dashboard/SavingsCard";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Mock transactions data
  const transactions: Transaction[] = useMemo(() => [
    {
      id: "txn1",
      type: "incoming",
      title: "Received Payment",
      amount: 250.00,
      currency: "USD",
      date: "Today, 10:32 AM",
      sender: "John Smith",
      status: "completed"
    },
    {
      id: "txn2",
      type: "outgoing",
      title: "Rent Payment",
      amount: 800.00,
      currency: "USD",
      date: "Yesterday, 3:15 PM",
      recipient: "Landlord LLC",
      status: "completed"
    },
    {
      id: "txn3",
      type: "incoming",
      title: "Salary Deposit",
      amount: 3200.00,
      currency: "USD",
      date: "Mar 28, 9:00 AM",
      sender: "TechCorp Inc.",
      status: "completed"
    },
    {
      id: "txn4",
      type: "outgoing",
      title: "Grocery Shopping",
      amount: 75.50,
      currency: "USD",
      date: "Mar 27, 6:22 PM",
      recipient: "Whole Foods",
      status: "completed"
    },
    {
      id: "txn5",
      type: "pending",
      title: "BTC Purchase",
      amount: 500.00,
      currency: "USD",
      date: "Processing",
      recipient: "Crypto Exchange",
      status: "processing"
    }
  ], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up-delayed">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'} 👋</h1>
        
        <QuickActions />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <BalanceCard balance={12450.75} currency="USD" />
          <SavingsCard 
            totalSavings={3250.50} 
            targetAmount={10000} 
            savingsName="Emergency Fund" 
          />
          <div className={isMobile ? "order-1 col-span-full" : "col-span-full"}>
            <TransactionsList transactions={transactions} />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <CryptoPrices />
      </div>
    </div>
  );
}
