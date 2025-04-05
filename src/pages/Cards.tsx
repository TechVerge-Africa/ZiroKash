
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Plus, RefreshCw, Shield, CreditCard, Smartphone, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cards() {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isVirtualCardDialogOpen, setIsVirtualCardDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleCardNumber = () => setShowCardNumber(!showCardNumber);
  
  const createVirtualCard = () => {
    toast({
      title: "Virtual Card Created",
      description: "Your new virtual card is ready to use.",
    });
    setIsVirtualCardDialogOpen(false);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Cards</h1>
            <p className="text-muted-foreground">Manage your physical and virtual cards</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Order Physical Card
            </Button>
            <Button onClick={() => setIsVirtualCardDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Virtual Card
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Card details */}
            <div className="relative">
              <div className="w-full p-6 rounded-xl bg-gradient-to-r from-primary to-secondary glow">
                <div className="flex justify-between mb-6">
                  <div className="text-white">
                    <p className="text-sm font-light opacity-80">PayNex Debit</p>
                    <p className="font-bold">Visa Platinum</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
                      <circle cx="12" cy="12" r="7" fill="white" fillOpacity="0.4"/>
                    </svg>
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 15V9H9V15H15Z" fill="white"/>
                    </svg>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs text-white/80 mb-1">Card Number</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg md:text-xl font-medium text-white tracking-wider">
                      {showCardNumber ? "4242 4242 4242 4242" : "•••• •••• •••• 4242"}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                      onClick={toggleCardNumber}
                    >
                      {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-white/80 mb-1">Card Holder</p>
                    <p className="font-medium text-white">JOHN DOE</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80 mb-1">Expires</p>
                    <p className="font-medium text-white">06/26</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80 mb-1">CVV</p>
                    <p className="font-medium text-white">{showCardNumber ? "123" : "•••"}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-white">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Lock className="h-5 w-5 mb-2" />
                <span className="text-xs">Lock Card</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <RefreshCw className="h-5 w-5 mb-2" />
                <span className="text-xs">Change PIN</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Shield className="h-5 w-5 mb-2" />
                <span className="text-xs">Card Limits</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Smartphone className="h-5 w-5 mb-2" />
                <span className="text-xs">Add to Wallet</span>
              </Button>
            </div>
            
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="details">Card Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Recent Card Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Amazon.com</p>
                              <p className="text-xs text-muted-foreground">Apr 3, 2025</p>
                            </div>
                          </div>
                          <p className="font-medium">-$79.99</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Card Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-xs">Card Type</Label>
                          <p>Virtual Debit Card</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Status</Label>
                          <p>Active</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Issued Date</Label>
                          <p>Mar 15, 2025</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Expiry Date</Label>
                          <p>Jun 30, 2026</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Billing Address</Label>
                          <p>123 Main St, New York, NY 10001</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Card Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Online Payments</p>
                          <p className="text-sm text-muted-foreground">Allow online transactions</p>
                        </div>
                        <div className="h-6 w-12 rounded-full bg-primary flex items-center p-1">
                          <div className="h-4 w-4 rounded-full bg-white ml-auto"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">ATM Withdrawals</p>
                          <p className="text-sm text-muted-foreground">Allow ATM withdrawals</p>
                        </div>
                        <div className="h-6 w-12 rounded-full bg-primary flex items-center p-1">
                          <div className="h-4 w-4 rounded-full bg-white ml-auto"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">International Payments</p>
                          <p className="text-sm text-muted-foreground">Allow payments outside your country</p>
                        </div>
                        <div className="h-6 w-12 rounded-full bg-gray-500 flex items-center p-1">
                          <div className="h-4 w-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Contactless Payments</p>
                          <p className="text-sm text-muted-foreground">Allow tap and pay</p>
                        </div>
                        <div className="h-6 w-12 rounded-full bg-primary flex items-center p-1">
                          <div className="h-4 w-4 rounded-full bg-white ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Side content */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Card Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Daily Spending</p>
                      <p className="text-sm font-medium">$1,000 / $5,000</p>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/5 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">Monthly Spending</p>
                      <p className="text-sm font-medium">$5,250 / $20,000</p>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/4 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">ATM Withdrawals</p>
                      <p className="text-sm font-medium">$300 / $1,000</p>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3 rounded-full"></div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Adjust Limits
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Virtual Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Netflix</p>
                      <p className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Active</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Virtual card specifically for Netflix subscription
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Card number:</span> •••• 8523
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Amazon</p>
                      <p className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">Limited</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Limited to $200/month for Amazon purchases
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Card number:</span> •••• 7128
                    </p>
                  </div>
                  
                  <Button onClick={() => setIsVirtualCardDialogOpen(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    New Virtual Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Virtual Card Dialog */}
      <Dialog open={isVirtualCardDialogOpen} onOpenChange={setIsVirtualCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Virtual Card</DialogTitle>
            <DialogDescription>
              Create a new virtual card for specific merchants or purposes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Card Name</Label>
              <Input id="card-name" placeholder="e.g. Netflix, Amazon, etc." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-limit">Monthly Spending Limit</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input 
                  id="card-limit" 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-8"
                  defaultValue="200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Card Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="online-only" className="rounded border-white/20 bg-transparent" />
                  <Label htmlFor="online-only" className="font-normal text-sm">Online payments only</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="single-use" className="rounded border-white/20 bg-transparent" />
                  <Label htmlFor="single-use" className="font-normal text-sm">Single use card</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="intl-payments" className="rounded border-white/20 bg-transparent" />
                  <Label htmlFor="intl-payments" className="font-normal text-sm">Allow international payments</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVirtualCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createVirtualCard}>
              Create Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
