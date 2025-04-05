
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Lock, Shield, Clock, ArrowRight, AlertCircle } from "lucide-react";

export default function Credit() {
  const [creditScore, setCreditScore] = useState(720);
  
  // Mock loans data
  const loans = [
    {
      id: "loan1",
      type: "Personal Loan",
      amount: 5000,
      remaining: 3200,
      apr: 8.5,
      nextPayment: "Apr 15, 2025",
      paymentAmount: 210.50,
      status: "active"
    },
    {
      id: "loan2",
      type: "Credit Card",
      amount: 2500,
      remaining: 1800,
      apr: 15.9,
      nextPayment: "Apr 22, 2025",
      paymentAmount: 120.00,
      status: "active"
    }
  ];
  
  // Mock credit offers
  const creditOffers = [
    {
      id: "offer1",
      type: "Personal Loan",
      amount: 10000,
      apr: 7.9,
      term: 36,
      monthly: 312.75,
      featured: true
    },
    {
      id: "offer2",
      type: "Credit Card",
      limit: 5000,
      apr: 14.5,
      annualFee: 0,
      cashback: 1.5,
      featured: false
    },
    {
      id: "offer3",
      type: "Debt Consolidation",
      amount: 15000,
      apr: 9.2,
      term: 48,
      monthly: 375.42,
      featured: false
    }
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Decentralized Credit</h1>
            <p className="text-muted-foreground">Smart contract loans with transparent terms and fair rates</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <CreditCard className="mr-2 h-4 w-4" />
            Apply for Credit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main credit section */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Credit Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center my-2">
                    <p className="text-4xl font-bold">{creditScore}</p>
                    <p className="text-sm text-muted-foreground">Good</p>
                  </div>
                  
                  <div className="my-4">
                    <Progress value={72} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Your blockchain-verified credit score is updated in real-time based on your transaction history and smart contract interactions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Credit Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Credit Card</span>
                        <span className="text-amber-500">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Personal Loan</span>
                        <span className="text-green-500">64%</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Total Utilization</span>
                        <span className="text-amber-500">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">
                      <div className="flex gap-2 items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <p>Maintaining your utilization below 30% can help improve your credit score.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="loans" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="loans">Active Loans</TabsTrigger>
                <TabsTrigger value="offers">Credit Offers</TabsTrigger>
                <TabsTrigger value="apply">Apply for Credit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="loans" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>My Loans</CardTitle>
                    <CardDescription>Your active loans and repayment schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loans.length > 0 ? (
                      <div className="space-y-4">
                        {loans.map((loan) => (
                          <div key={loan.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <h3 className="font-medium">{loan.type}</h3>
                                <p className="text-sm text-muted-foreground">Total: ${loan.amount}</p>
                              </div>
                              <div className="mt-2 md:mt-0 md:text-right">
                                <p className="text-sm">Remaining Balance</p>
                                <p className="font-medium">${loan.remaining}</p>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <Progress value={(loan.remaining / loan.amount) * 100} className="h-2" />
                              <p className="text-xs text-right mt-1 text-muted-foreground">
                                {Math.round((loan.remaining / loan.amount) * 100)}% remaining
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">APR</p>
                                <p>{loan.apr}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Next Payment</p>
                                <p>{loan.nextPayment}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Payment Amount</p>
                                <p>${loan.paymentAmount}</p>
                              </div>
                              <div>
                                <Button size="sm" className="mt-1 w-full">Make Payment</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You don't have any active loans</p>
                        <Button>Apply for a Loan</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="offers" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Personalized Offers</CardTitle>
                    <CardDescription>Smart contract credit offers based on your blockchain credit profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {creditOffers.map((offer) => (
                        <div 
                          key={offer.id} 
                          className={`p-4 rounded-lg ${offer.featured ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30' : 'bg-white/5 border border-white/10'}`}
                        >
                          {offer.featured && (
                            <div className="mb-2 text-xs font-medium text-primary bg-primary/10 w-fit px-2 py-1 rounded-full">
                              Best Offer
                            </div>
                          )}
                          
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <h3 className="font-medium">{offer.type}</h3>
                              {offer.amount ? (
                                <p className="text-lg font-bold">Up to ${offer.amount.toLocaleString()}</p>
                              ) : (
                                <p className="text-lg font-bold">Up to ${offer.limit.toLocaleString()} limit</p>
                              )}
                            </div>
                            <div className="mt-2 md:mt-0 md:text-right">
                              <p className="text-sm">Interest Rate</p>
                              <p className="font-medium">{offer.apr}% APR</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
                            {offer.term && (
                              <div>
                                <p className="text-muted-foreground">Term</p>
                                <p>{offer.term} months</p>
                              </div>
                            )}
                            
                            {offer.monthly && (
                              <div>
                                <p className="text-muted-foreground">Monthly Payment</p>
                                <p>${offer.monthly}/mo</p>
                              </div>
                            )}
                            
                            {offer.annualFee !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Annual Fee</p>
                                <p>${offer.annualFee}</p>
                              </div>
                            )}
                            
                            {offer.cashback && (
                              <div>
                                <p className="text-muted-foreground">Cashback</p>
                                <p>{offer.cashback}%</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button className="flex-1">Apply Now</Button>
                            <Button variant="outline" className="flex-1">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="apply" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Apply for Credit</CardTitle>
                    <CardDescription>Fill out the form below to apply for a new loan or credit card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="creditType">Credit Type</Label>
                        <select 
                          id="creditType"
                          className="w-full px-3 py-2 bg-background border border-white/10 rounded-md"
                        >
                          <option value="personal">Personal Loan</option>
                          <option value="credit-card">Credit Card</option>
                          <option value="consolidation">Debt Consolidation</option>
                          <option value="business">Business Loan</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input 
                            id="amount" 
                            type="number"
                            placeholder="5,000" 
                            className="pl-8"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <select 
                          id="purpose"
                          className="w-full px-3 py-2 bg-background border border-white/10 rounded-md"
                        >
                          <option value="debt-consolidation">Debt Consolidation</option>
                          <option value="home-improvement">Home Improvement</option>
                          <option value="major-purchase">Major Purchase</option>
                          <option value="business">Business</option>
                          <option value="education">Education</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="term">Term (months)</Label>
                        <select 
                          id="term"
                          className="w-full px-3 py-2 bg-background border border-white/10 rounded-md"
                        >
                          <option value="12">12 months</option>
                          <option value="24">24 months</option>
                          <option value="36">36 months</option>
                          <option value="48">48 months</option>
                          <option value="60">60 months</option>
                        </select>
                      </div>
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        Check Your Rate
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground">
                        Checking your rate won't affect your credit score. Terms and rates are powered by smart contracts.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Side panel */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Credit Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">On-Time Payments</p>
                      <p className="text-xs text-muted-foreground">100% of payments made on time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Credit Utilization</p>
                      <p className="text-xs text-muted-foreground">68% - Consider reducing this below 30%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Credit Age</p>
                      <p className="text-xs text-muted-foreground">2 years, 8 months average account age</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Smart Contract Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  All credit agreements are secured by audited smart contracts on the blockchain, ensuring transparency and immutability.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Audited Smart Contracts</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Encrypted Data Protection</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <p className="text-sm">Transparent Terms & Conditions</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View Smart Contracts
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Credit Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Understanding Your Credit Score
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    How Smart Contract Loans Work
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Tips to Improve Your Score
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Debt Consolidation Guide
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
