
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, Plus, Wallet as WalletIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Wallet() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your digital assets and payments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/payments">
              <ArrowDown className="mr-2 h-4 w-4" />
              Deposit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/payments">
              <ArrowUp className="mr-2 h-4 w-4" />
              Withdraw
            </Link>
          </Button>
          <Button asChild>
            <Link to="/payments">
              <Plus className="mr-2 h-4 w-4" />
              Add Money
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Main Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$12,450.75</span>
                    <span className="ml-2 text-green-500 text-sm">+2.5%</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Available balance</span>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/payments">
                        <ArrowUp className="mr-2 h-3 w-3" />
                        Send
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/payments">
                        <ArrowDown className="mr-2 h-3 w-3" />
                        Receive
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Crypto Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$3,287.45</span>
                    <span className="ml-2 text-red-500 text-sm">-1.2%</span>
                  </div>
                  <span className="text-muted-foreground text-sm">In cryptocurrencies</span>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/investments">
                        <DollarSign className="mr-2 h-3 w-3" />
                        Buy
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/investments">
                        <CreditCard className="mr-2 h-3 w-3" />
                        Sell
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <WalletIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Deposit to Main Account</p>
                            <p className="text-xs text-muted-foreground">Apr 3, 2025</p>
                          </div>
                        </div>
                        <p className="font-medium text-green-500">+$250.00</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Your linked payment sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-xs text-muted-foreground">Expires 06/26</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Default</Button>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scheduled" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Scheduled Transactions</CardTitle>
                  <CardDescription>Upcoming and recurring payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You don't have any scheduled transactions.</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule a Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/payments">
                    <ArrowUp className="h-5 w-5 mb-2" />
                    <span className="text-xs">Send Money</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/payments">
                    <ArrowDown className="h-5 w-5 mb-2" />
                    <span className="text-xs">Receive</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/investments">
                    <DollarSign className="h-5 w-5 mb-2" />
                    <span className="text-xs">Exchange</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/payments">
                    <CreditCard className="h-5 w-5 mb-2" />
                    <span className="text-xs">Pay Bills</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Spending Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Monthly Spending</p>
                    <p className="text-sm font-medium">$2,450 / $5,000</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/2 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Savings Goal</p>
                    <p className="text-sm font-medium">$10,200 / $25,000</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-1/4 rounded-full"></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    View Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Currency Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">From</p>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                      <span>USD</span>
                      <span>$</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To</p>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                      <span>EUR</span>
                      <span>€</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                    <span>$100.00</span>
                    <span>€92.34</span>
                  </div>
                </div>
                
                <Button className="w-full">Exchange Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
