
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Check, CreditCard, Globe, Scan, Send } from "lucide-react";

export default function Payments() {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Cross-Border Payments</h1>
            <p className="text-muted-foreground">Send money globally with low fees and instant transfers</p>
          </div>
          <Button>
            <Scan className="mr-2 h-4 w-4" />
            Scan to Pay
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>Complete the form below to make an international transfer</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Recipient Information</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Full Name" />
                        <Input placeholder="Email or Phone" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select defaultValue="united-states">
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="united-states">United States</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="germany">Germany</SelectItem>
                            <SelectItem value="japan">Japan</SelectItem>
                            <SelectItem value="china">China</SelectItem>
                            <SelectItem value="india">India</SelectItem>
                            <SelectItem value="brazil">Brazil</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="usd">
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD - US Dollar</SelectItem>
                            <SelectItem value="eur">EUR - Euro</SelectItem>
                            <SelectItem value="gbp">GBP - British Pound</SelectItem>
                            <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                            <SelectItem value="cny">CNY - Chinese Yuan</SelectItem>
                            <SelectItem value="inr">INR - Indian Rupee</SelectItem>
                            <SelectItem value="brl">BRL - Brazilian Real</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input 
                            id="amount" 
                            type="number"
                            placeholder="0.00" 
                            className="pl-8"
                          />
                        </div>
                        <div className="flex items-center text-sm space-x-2">
                          <span>You send: <strong>$550.00</strong></span>
                          <ArrowRight className="h-4 w-4" />
                          <span>Recipient gets: <strong>€502.35</strong></span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Exchange rate: 1 USD = 0.9134 EUR</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Button
                          type="button"
                          variant={paymentMethod === "wallet" ? "default" : "outline"}
                          className="justify-start h-auto py-3"
                          onClick={() => setPaymentMethod("wallet")}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Send className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">PayNex Wallet</p>
                              <p className="text-xs text-muted-foreground">Balance: $12,450</p>
                            </div>
                          </div>
                        </Button>
                        
                        <Button
                          type="button"
                          variant={paymentMethod === "card" ? "default" : "outline"}
                          className="justify-start h-auto py-3"
                          onClick={() => setPaymentMethod("card")}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">Credit Card</p>
                              <p className="text-xs text-muted-foreground">Visa •••• 4242</p>
                            </div>
                          </div>
                        </Button>
                        
                        <Button
                          type="button"
                          variant={paymentMethod === "crypto" ? "default" : "outline"}
                          className="justify-start h-auto py-3"
                          onClick={() => setPaymentMethod("crypto")}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                              <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-sm">Cryptocurrency</p>
                              <p className="text-xs text-muted-foreground">BTC, ETH, USDT</p>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Input 
                        id="note" 
                        placeholder="What's this payment for?" 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Continue to Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Side panel */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Why Choose PayNex?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Lower Fees</p>
                      <p className="text-sm text-muted-foreground">Up to 8x cheaper than traditional banks</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Real Exchange Rates</p>
                      <p className="text-sm text-muted-foreground">Get the real mid-market exchange rate</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Fast Transfers</p>
                      <p className="text-sm text-muted-foreground">65% of transfers arrive instantly</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Blockchain Secured</p>
                      <p className="text-sm text-muted-foreground">All transactions verified on blockchain</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Global Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <Globe className="h-20 w-20 text-muted-foreground opacity-50" />
                </div>
                <p className="text-sm text-center mb-4">Send money to 180+ countries and territories worldwide</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>United States</div>
                  <div>United Kingdom</div>
                  <div>European Union</div>
                  <div>Australia</div>
                  <div>Canada</div>
                  <div>Japan</div>
                  <div>India</div>
                  <div>Brazil</div>
                  <div>Mexico</div>
                  <div>Nigeria</div>
                </div>
                <Button variant="link" className="w-full mt-2 text-primary">View all supported countries</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
