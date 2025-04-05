
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TransactionsList, { Transaction } from "@/components/dashboard/TransactionsList";
import { ArrowLeftRight, CreditCard, Download, Plus, Send, Upload } from "lucide-react";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock transactions
  const transactions: Transaction[] = [
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
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Wallet</h1>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Add Money
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main wallet section */}
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-medium">USD Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-3xl font-bold">$12,450.75</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                    <Button className="flex-1 sm:flex-none">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Download className="mr-2 h-4 w-4" />
                      Receive
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      Swap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="send">Send Money</TabsTrigger>
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-4">
                <TransactionsList transactions={transactions} />
              </TabsContent>
              
              <TabsContent value="send" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Send Money</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Email or Wallet Address</Label>
                        <Input 
                          id="recipient" 
                          placeholder="Email, phone, or wallet address" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input 
                            id="amount" 
                            type="number"
                            placeholder="0.00" 
                            className="pl-8"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input 
                          id="note" 
                          placeholder="What's this payment for?" 
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Continue
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="deposit" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Deposit Funds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="h-auto py-6 justify-start flex-col items-start text-left">
                          <CreditCard className="h-10 w-10 mb-2" />
                          <h3 className="text-lg font-medium">Bank Transfer</h3>
                          <p className="text-sm text-muted-foreground">Deposit via ACH transfer</p>
                        </Button>
                        
                        <Button variant="outline" className="h-auto py-6 justify-start flex-col items-start text-left">
                          <Upload className="h-10 w-10 mb-2" />
                          <h3 className="text-lg font-medium">Crypto Deposit</h3>
                          <p className="text-sm text-muted-foreground">Deposit cryptocurrency</p>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Side panel */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-medium">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 06/2026</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-medium">Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="h-10 w-10 rounded-md bg-green-500/20 flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 7.20001H15V5.40001C15 4.07001 13.93 3 12.6 3H5.4C4.07 3 3 4.07001 3 5.40001V18.6C3 19.93 4.07 21 5.4 21H18.6C19.93 21 21 19.93 21 18.6V10.2C21 8.87001 19.93 7.20001 18 7.20001ZM6 8.40001H12V10.8H6V8.40001ZM18 18H6V15.6H18V18ZM18 13.2H6V12.6H18V13.2ZM18 10.2H15V9.60001H18V10.2Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-xs text-muted-foreground">Chase ••••1234</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Link Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
