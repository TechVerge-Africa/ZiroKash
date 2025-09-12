import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, ShieldCheck, Check, Zap, Settings, Wifi, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useCredit } from "@/hooks/useCredit";
import { useWallet } from "@/hooks/useWallet";
import CreditCardComponent from "@/components/cards/CreditCardComponent";
import { toast } from "@/hooks/use-toast";

export default function Cards() {
  const { creditCards, loading, updateCreditCard } = useCredit();
  const { transactions } = useWallet();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const cardTransactions = transactions.filter(t => 
    t.transaction_type === 'send' || t.transaction_type === 'receive'
  ).slice(0, 5);

  const handleFreezeCard = async (cardId: string) => {
    try {
      await updateCreditCard(cardId, { is_frozen: true });
      toast({
        title: "Card frozen successfully",
        description: "Your card has been frozen for security.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to freeze card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnfreezeCard = async (cardId: string) => {
    try {
      await updateCreditCard(cardId, { is_frozen: false });
      toast({
        title: "Card unfrozen successfully",
        description: "Your card is now active and ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to unfreeze card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (cardId: string) => {
    setSelectedCard(cardId);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cards</h1>
          <p className="text-muted-foreground">Manage your payment cards</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/cards">
              <Plus className="mr-2 h-4 w-4" />
              Order New Card
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creditCards.length > 0 ? creditCards.map((card) => (
              <CreditCardComponent
                key={card.id}
                id={card.id}
                cardName={card.card_name}
                cardNumber={card.card_number}
                cardType={card.card_type}
                balance={card.current_balance}
                creditLimit={card.credit_limit}
                isFrozen={card.is_frozen}
                isActive={card.is_active}
                onFreeze={handleFreezeCard}
                onUnfreeze={handleUnfreezeCard}
                onViewDetails={handleViewDetails}
              />
            )) : (
              <div className="col-span-2 text-center py-16">
                <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No cards yet</h3>
                <p className="text-muted-foreground mb-6">Order your first ZiroKash card to get started</p>
                <Button asChild>
                  <Link to="/cards">
                    <Plus className="mr-2 h-4 w-4" />
                    Order Your First Card
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Card Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="limits">Limits & Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                  <CardDescription>Your ZiroKash Premium Card details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Card Number</p>
                      <div className="flex items-center rounded-md border border-white/10 p-2.5">
                        <span className="font-mono">**** **** **** 4242</span>
                        <Button variant="ghost" size="sm" className="ml-auto h-auto p-1">
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Card Holder</p>
                      <div className="flex items-center rounded-md border border-white/10 p-2.5">
                        <span>John Doe</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Expiry Date</p>
                      <div className="flex items-center rounded-md border border-white/10 p-2.5">
                        <span>06/26</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">CVV</p>
                      <div className="flex items-center rounded-md border border-white/10 p-2.5">
                        <span className="font-mono">***</span>
                        <Button variant="ghost" size="sm" className="ml-auto h-auto p-1">
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Card Status</p>
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Card Security</CardTitle>
                  <CardDescription>Manage your card's security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                          <p className="font-medium">Freeze Card</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Temporarily disable your card
                        </p>
                      </div>
                      <Button variant="outline">Freeze</Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          <p className="font-medium">Online Transactions</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Allow online and e-commerce payments
                        </p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          <p className="font-medium">International Transactions</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Allow payments outside your country
                        </p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          <p className="font-medium">Contactless Payments</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Allow tap-to-pay functionality
                        </p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <Button className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Advanced Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="limits" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Card Limits</CardTitle>
                  <CardDescription>Manage your spending limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm">Daily ATM Withdrawal</p>
                        <p className="text-sm font-medium">$500 / $1,000</p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm">Daily Purchase Limit</p>
                        <p className="text-sm font-medium">$1,250 / $5,000</p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/4 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm">Online Transaction Limit</p>
                        <p className="text-sm font-medium">$1,000 / $3,000</p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <Button className="w-full">
                      <Zap className="mr-2 h-4 w-4" />
                      Request Limit Increase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Recent Card Transactions</CardTitle>
              <CardDescription>Your recent card activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cardTransactions.length > 0 ? cardTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || transaction.transaction_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent transactions</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/payments">View All Transactions</Link>
              </Button>
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
                  <Link to="/settings">
                    <ShieldCheck className="h-5 w-5 mb-2" />
                    <span className="text-xs">Freeze Card</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/settings">
                    <Settings className="h-5 w-5 mb-2" />
                    <span className="text-xs">Pin Settings</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/settings">
                    <Zap className="h-5 w-5 mb-2" />
                    <span className="text-xs">Increase Limit</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/cards">
                    <Plus className="h-5 w-5 mb-2" />
                    <span className="text-xs">Add Card</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Card Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Purchase Protection</p>
                    <p className="text-xs text-muted-foreground">Covered up to $1,000 per claim</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Travel Insurance</p>
                    <p className="text-xs text-muted-foreground">Coverage for trips paid with your card</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Cashback Rewards</p>
                    <p className="text-xs text-muted-foreground">Earn 2% on all purchases</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                View All Benefits
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Card Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm">Replace Card</p>
                <Button size="sm" variant="outline">Replace</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm">Report Lost/Stolen</p>
                <Button size="sm" variant="outline">Report</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm">View PIN</p>
                <Button size="sm" variant="outline">View</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm">Change Card Design</p>
                <Button size="sm" variant="outline">Change</Button>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <Button variant="destructive" className="w-full">
                  Cancel Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
