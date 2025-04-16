
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Search, SendHorizontal, UserPlus, ArrowDown, ArrowUp, CreditCard, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Payments() {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Send, receive, and manage payments</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none justify-center" asChild>
            <Link to="/payments">
              <Calendar className="mr-2 h-4 w-4" />
              {!isMobile && "Scheduled"}
            </Link>
          </Button>
          <Button className="flex-1 md:flex-none justify-center" asChild>
            <Link to="/payments">
              <SendHorizontal className="mr-2 h-4 w-4" />
              {!isMobile && "New Payment"}
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/10 transform-card">
            <CardHeader>
              <CardTitle>Quick Transfer</CardTitle>
              <CardDescription>Send money to your contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search contact or enter email..." 
                    className="pl-8 h-10"
                  />
                </div>
                
                <div className="flex overflow-x-auto py-2 gap-4 pb-4 scrollbar-none">
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                    <Button size="icon" variant="outline" className="h-12 w-12 rounded-full hover:scale-105 transition-transform">
                      <Plus className="h-6 w-6" />
                    </Button>
                    <span className="text-xs">Add</span>
                  </div>
                  
                  {['Alex', 'Sarah', 'Michael', 'Emma', 'David'].map((name) => (
                    <div key={name} className="flex flex-col items-center space-y-1 flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium hover:scale-105 transition-transform cursor-pointer">
                        {name[0]}
                      </div>
                      <span className="text-xs">{name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input 
                        placeholder="0.00" 
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message (optional)</p>
                    <Input placeholder="Add a note..." />
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link to="/payments">Send Money</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Johnson', amount: '$45.00', date: 'Today', type: 'sent' },
                      { name: 'David Chen', amount: '$120.00', date: 'Yesterday', type: 'received' },
                      { name: 'Emma Watson', amount: '$35.50', date: 'Apr 2', type: 'sent' },
                      { name: 'Michael Brown', amount: '$200.00', date: 'Mar 28', type: 'received' },
                      { name: 'Alex Rodriguez', amount: '$75.25', date: 'Mar 25', type: 'sent' }
                    ].map((payment, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                            {payment.name.split(' ')[0][0]}
                          </div>
                          <div>
                            <p className="font-medium">{payment.name}</p>
                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                          </div>
                        </div>
                        <p className={`font-medium ${payment.type === 'received' ? 'text-green-500' : ''}`}>
                          {payment.type === 'sent' ? '-' : '+'}{payment.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scheduled" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Scheduled Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Rent Payment</p>
                          <p className="text-xs text-muted-foreground">Monthly, on the 1st</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$1,200.00</p>
                        <p className="text-xs text-muted-foreground">Next: May 1, 2025</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule New Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <CardTitle>Payment Contacts</CardTitle>
                    <Button size="sm" variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search contacts..." 
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {['Sarah Johnson', 'David Chen', 'Emma Watson', 'Michael Brown', 'Alex Rodriguez'].map((name, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                              {name.split(' ')[0][0]}
                            </div>
                            <p className="font-medium">{name}</p>
                          </div>
                          <Button size="sm">Send</Button>
                        </div>
                      ))}
                    </div>
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
                    <ArrowUp className="h-5 w-5 mb-2 text-primary" />
                    <span className="text-xs">Send</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/payments">
                    <ArrowDown className="h-5 w-5 mb-2 text-green-500" />
                    <span className="text-xs">Receive</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/wallet">
                    <Wallet className="h-5 w-5 mb-2 text-blue-500" />
                    <span className="text-xs">Wallet</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/cards">
                    <CreditCard className="h-5 w-5 mb-2 text-purple-400" />
                    <span className="text-xs">Cards</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Main Wallet</p>
                    <p className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Default</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Balance: $12,450.75
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-xs bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full">Card</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Expires: 06/26
                  </p>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/wallet">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Money sent to Sarah', date: 'Today, 10:32 AM', amount: '-$45.00' },
                  { title: 'Received from David', date: 'Yesterday, 3:15 PM', amount: '+$120.00' },
                  { title: 'Money sent to Emma', date: 'Apr 2, 9:00 AM', amount: '-$35.50' }
                ].map((activity, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <p className={`text-sm font-medium ${activity.amount.startsWith('+') ? 'text-green-500' : ''}`}>
                      {activity.amount}
                    </p>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full text-xs">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
