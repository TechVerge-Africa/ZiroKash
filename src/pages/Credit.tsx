
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowUp, CheckCircle, CreditCard, DollarSign, Plus, ShieldCheck } from "lucide-react";

export default function Credit() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Credit</h1>
          <p className="text-muted-foreground">Manage your decentralized credit and loans</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Credit Score
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Credit Score Card */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Credit Score</CardTitle>
              <CardDescription>Your blockchain-verified creditworthiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary blur-lg opacity-20"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-white/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold">720</span>
                      <span className="text-sm text-muted-foreground">Good</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Payment History</p>
                      <p className="text-sm font-medium">Excellent</p>
                    </div>
                    <Progress value={92} className="h-2 bg-white/10" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Credit Utilization</p>
                      <p className="text-sm font-medium">Good</p>
                    </div>
                    <Progress value={70} className="h-2 bg-white/10" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Credit Age</p>
                      <p className="text-sm font-medium">Fair</p>
                    </div>
                    <Progress value={60} className="h-2 bg-white/10" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Credit Mix</p>
                      <p className="text-sm font-medium">Good</p>
                    </div>
                    <Progress value={75} className="h-2 bg-white/10" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Last updated: April 1, 2025</p>
                <Button variant="outline" size="sm">
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Credit Tab Container */}
          <Tabs defaultValue="loans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="loans">My Loans</TabsTrigger>
              <TabsTrigger value="offers">Loan Offers</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="loans" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Personal Loan</p>
                          <p className="text-xs text-muted-foreground">3-year term at 5.2% APR</p>
                        </div>
                        <p className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                          Current
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm">Repayment Progress</p>
                          <p className="text-sm font-medium">12 of 36 months</p>
                        </div>
                        <Progress value={33} className="h-2 bg-white/10" />
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Original Amount</p>
                          <p className="font-medium">$12,000.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Current Balance</p>
                          <p className="font-medium">$8,450.30</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Payment</p>
                          <p className="font-medium">$362.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Next Payment</p>
                          <p className="font-medium">May 15, 2025</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Make Payment</Button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button className="mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Apply for New Loan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="offers" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Personalized Loan Offers</CardTitle>
                  <CardDescription>Pre-qualified offers based on your credit profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Personal Loan</p>
                          <p className="text-xs text-muted-foreground">Fixed rate loan for any purpose</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Up to $25,000</p>
                          <p className="text-xs text-muted-foreground">From 6.5% APR</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>No origination fees</span>
                        </div>
                        <div className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>Fast approval</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">Check Your Rate</Button>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Debt Consolidation</p>
                          <p className="text-xs text-muted-foreground">Combine multiple debts into one payment</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Up to $35,000</p>
                          <p className="text-xs text-muted-foreground">From 7.2% APR</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>Lower your payments</span>
                        </div>
                        <div className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>Simplify finances</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">Check Your Rate</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Recent loan payments and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        title: 'Personal Loan Payment', 
                        date: 'Apr 15, 2025', 
                        amount: '$362.00',
                        status: 'Completed'
                      },
                      { 
                        title: 'Personal Loan Payment', 
                        date: 'Mar 15, 2025', 
                        amount: '$362.00',
                        status: 'Completed'
                      },
                      { 
                        title: 'Personal Loan Payment', 
                        date: 'Feb 15, 2025', 
                        amount: '$362.00',
                        status: 'Completed'
                      },
                      { 
                        title: 'Personal Loan Payment', 
                        date: 'Jan 15, 2025', 
                        amount: '$362.00',
                        status: 'Completed'
                      },
                      { 
                        title: 'Personal Loan Payment', 
                        date: 'Dec 15, 2024', 
                        amount: '$362.00',
                        status: 'Completed'
                      },
                    ].map((payment, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <ArrowUp className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.title}</p>
                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{payment.amount}</p>
                          <p className="text-xs text-green-500">{payment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Credit Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Credit</p>
                    <p className="text-2xl font-bold">$15,000</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Available</p>
                    <p className="text-2xl font-bold">$6,550</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Credit Utilization</p>
                    <p className="text-sm font-medium">56%</p>
                  </div>
                  <Progress value={56} className="h-2 bg-white/10" />
                  <p className="text-xs text-muted-foreground mt-1">Keep below 30% for optimal credit score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Credit Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pay on time, every time</p>
                    <p className="text-xs text-muted-foreground">Payment history is the biggest factor in your credit score</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Lower your credit utilization</p>
                    <p className="text-xs text-muted-foreground">Try to use less than 30% of your available credit</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Keep old accounts open</p>
                    <p className="text-xs text-muted-foreground">Longer credit history improves your score</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View All Credit Tips
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Blockchain Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your credit history is securely stored on the blockchain, providing transparency and immutability.
                </p>
                
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <p className="font-medium">Verified Credit Score</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last verified on Apr 1, 2025
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                  <p className="text-xs font-mono bg-white/10 px-2 py-1 rounded">0x87a...31fe</p>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Blockchain Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
