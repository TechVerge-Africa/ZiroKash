import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Gift, Plus, ShieldCheck, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export default function Credit() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Credit</h1>
          <p className="text-muted-foreground">Manage your credit cards and credit score</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/credit">
              <Plus className="mr-2 h-4 w-4" />
              Apply for Credit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$1,235.42</span>
                    <span className="ml-2 text-muted-foreground text-sm">of $5,000</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Next payment due: April 15, 2025</span>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Credit Used</span>
                      <span>24.7%</span>
                    </div>
                    <Progress value={24.7} className="h-2" />
                  </div>
                  
                  <div className="mt-4">
                    <Button className="w-full" asChild>
                      <Link to="/payments">Make a Payment</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Credit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">748</span>
                    <span className="ml-2 text-green-500 text-sm">+12 pts</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Excellent (700-850)</span>
                  
                  <div className="mt-4 relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/3 bg-red-500"></div>
                      <div className="w-1/3 bg-yellow-500"></div>
                      <div className="w-1/3 bg-green-500"></div>
                    </div>
                    <div className="absolute h-4 w-4 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white" style={{ left: '83%' }}></div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/settings">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        View Credit Report
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Credit Cards</CardTitle>
              <CardDescription>Manage your active credit cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">PayNex Premium Card</p>
                      <p className="text-xs text-muted-foreground">**** **** **** 4242</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <p className="font-medium">$1,235.42 / $5,000</p>
                    <div className="w-full md:w-40 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div className="bg-primary h-full w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">PayNex Rewards Card</p>
                      <p className="text-xs text-muted-foreground">**** **** **** 8731</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <p className="font-medium">$723.85 / $3,000</p>
                    <div className="w-full md:w-40 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div className="bg-primary h-full w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add New Card
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent credit card activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Amazon.com', date: 'Apr 5, 2025', amount: '$54.32', card: '4242' },
                  { title: 'Uber', date: 'Apr 3, 2025', amount: '$22.50', card: '4242' },
                  { title: 'Starbucks', date: 'Apr 2, 2025', amount: '$6.75', card: '8731' },
                  { title: 'Netflix', date: 'Apr 1, 2025', amount: '$14.99', card: '4242' },
                  { title: 'Grocery Store', date: 'Mar 30, 2025', amount: '$87.65', card: '8731' }
                ].map((transaction, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.title}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date} • Card ending in {transaction.card}</p>
                      </div>
                    </div>
                    <p className="font-medium">{transaction.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                    <DollarSign className="h-5 w-5 mb-2" />
                    <span className="text-xs">Pay Balance</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/settings">
                    <ShieldCheck className="h-5 w-5 mb-2" />
                    <span className="text-xs">Freeze Card</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/settings">
                    <Zap className="h-5 w-5 mb-2" />
                    <span className="text-xs">Increase Limit</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/credit">
                    <Gift className="h-5 w-5 mb-2" />
                    <span className="text-xs">Rewards</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Balance</span>
                  <span className="font-medium">$1,235.42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Minimum Payment</span>
                  <span className="font-medium">$35.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="font-medium">April 15, 2025</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="font-medium">Available Credit</span>
                  <span className="font-medium">$3,764.58</span>
                </div>
                
                <Button className="w-full" asChild>
                  <Link to="/payments">Make a Payment</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Credit Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Credit Utilization</p>
                    <p className="text-sm font-medium">24.7% <span className="text-green-500 text-xs">Good</span></p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-1/4 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Payment History</p>
                    <p className="text-sm font-medium">100% <span className="text-green-500 text-xs">Excellent</span></p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Account Age</p>
                    <p className="text-sm font-medium">3 yrs <span className="text-yellow-500 text-xs">Fair</span></p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-1/2 rounded-full"></div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
