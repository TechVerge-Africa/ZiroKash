import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Settings,
  Users,
  CreditCard
} from "lucide-react";

export default function MerchantTools() {
  const [qrAmount, setQrAmount] = useState("");
  const [description, setDescription] = useState("");

  const recentTransactions = [
    {
      id: "TXN001",
      customer: "John Doe",
      amount: "$45.50",
      method: "QR Code",
      status: "Completed",
      date: "2024-01-20 14:30"
    },
    {
      id: "TXN002",
      customer: "Jane Smith",
      amount: "$120.00",
      method: "Card Payment",
      status: "Completed",
      date: "2024-01-20 13:15"
    },
    {
      id: "TXN003",
      customer: "Mike Johnson",
      amount: "$75.25",
      method: "QR Code",
      status: "Pending",
      date: "2024-01-20 12:45"
    }
  ];

  const settlements = [
    {
      date: "2024-01-19",
      amount: "$1,250.75",
      transactions: 45,
      status: "Settled"
    },
    {
      date: "2024-01-18",
      amount: "$980.50",
      transactions: 38,
      status: "Settled"
    },
    {
      date: "2024-01-17",
      amount: "$1,450.25",
      transactions: 52,
      status: "Processing"
    }
  ];

  const generateQR = () => {
    // In a real app, this would generate an actual QR code
    alert(`QR Code generated for $${qrAmount} - ${description}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business payments and customer transactions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold">$1,234.56</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="qr-generator">QR Generator</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest customer payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{transaction.customer}</h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction.method} • {transaction.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{transaction.amount}</div>
                      <Badge 
                        variant={transaction.status === "Completed" ? "default" : "secondary"}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-generator">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>QR Code Generator</span>
              </CardTitle>
              <CardDescription>
                Generate payment QR codes for your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={qrAmount}
                      onChange={(e) => setQrAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Payment description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={generateQR} className="w-full">
                    Generate QR Code
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">QR Code will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements">
          <Card>
            <CardHeader>
              <CardTitle>Settlement History</CardTitle>
              <CardDescription>
                Track your payment settlements and payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlements.map((settlement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{settlement.date}</h3>
                      <p className="text-sm text-muted-foreground">
                        {settlement.transactions} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{settlement.amount}</div>
                      <Badge 
                        variant={settlement.status === "Settled" ? "default" : "secondary"}
                      >
                        {settlement.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Settlement Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  Insights into your business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Sales Trends</h3>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground">Chart placeholder</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Payment Methods</h3>
                    <div className="h-32 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground">Chart placeholder</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}