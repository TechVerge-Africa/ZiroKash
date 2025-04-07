import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lock, User, Bell, Globe, Shield, CreditCard, Moon, Sun, LogOut, MonitorSmartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/hooks/use-theme";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // We'll hold the initial theme to detect changes for visual feedback
  const [initialTheme, setInitialTheme] = useState(theme);
  const [themeChanged, setThemeChanged] = useState(false);

  useEffect(() => {
    setInitialTheme(theme);
  }, []);

  useEffect(() => {
    // Check if the theme has changed from initial state
    setThemeChanged(initialTheme !== theme);
  }, [theme, initialTheme]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="Your name" defaultValue={user?.name || ""} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" defaultValue={user?.email || ""} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your phone number" />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Your address" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" />
                    </div>
                    <div>
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" placeholder="Zip code" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <Button variant="outline">Upload</Button>
                    <Button variant="outline">Remove</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground">Standard Account</p>
                    </div>
                    <Button variant="outline" size="sm">Upgrade</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Joined</p>
                      <p className="text-sm text-muted-foreground">April 2025</p>
                    </div>
                  </div>
                  
                  <Button variant="destructive" className="w-full" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Secure your account with two-factor authentication
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <div>
                    <Button variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Setup Two-Factor Authentication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Web Browser • California, USA</p>
                      </div>
                      <div className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full h-fit">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out All Sessions
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { title: 'Password changed', date: 'Apr 5, 2025', time: '10:32 AM' },
                      { title: 'Login successful', date: 'Apr 5, 2025', time: '10:30 AM' },
                      { title: 'Login successful', date: 'Apr 3, 2025', time: '2:15 PM' }
                    ].map((log, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{log.title}</p>
                          <p className="text-xs text-muted-foreground">{log.date}, {log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="w-full text-xs">
                    View Full Activity Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Account Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about account activity
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Text Message</p>
                      <p className="text-sm text-muted-foreground">
                        Receive text messages for important updates
                      </p>
                    </div>
                    <Switch id="text-notifications" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Transaction Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Payment Confirmations</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a payment is made
                      </p>
                    </div>
                    <Switch id="payment-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Deposit Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive money
                      </p>
                    </div>
                    <Switch id="deposit-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Low Balance Alert</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your balance is low
                      </p>
                    </div>
                    <Switch id="balance-notifications" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Marketing Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Special Offers</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about special offers and promotions
                      </p>
                    </div>
                    <Switch id="marketing-notifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Receive our monthly newsletter
                      </p>
                    </div>
                    <Switch id="newsletter-notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
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
                    
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Mastercard ending in 8731</p>
                            <p className="text-xs text-muted-foreground">Expires 08/27</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">Make Default</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                  <CardDescription>Your billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="billingName">Full Name</Label>
                    <Input id="billingName" placeholder="Name on card" />
                  </div>
                  
                  <div>
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input id="billingAddress" placeholder="Billing address" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City</Label>
                      <Input id="billingCity" placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State</Label>
                      <Input id="billingState" placeholder="State" />
                    </div>
                    <div>
                      <Label htmlFor="billingZip">Zip Code</Label>
                      <Input id="billingZip" placeholder="Zip code" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Address</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { title: 'Premium Subscription', date: 'Apr 1, 2025', amount: '$19.99' },
                      { title: 'Premium Subscription', date: 'Mar 1, 2025', amount: '$19.99' },
                      { title: 'Premium Subscription', date: 'Feb 1, 2025', amount: '$19.99' }
                    ].map((bill, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{bill.title}</p>
                          <p className="text-xs text-muted-foreground">{bill.date}</p>
                        </div>
                        <p className="text-sm font-medium">{bill.amount}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full text-xs">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-medium">Premium Plan</p>
                    <p className="text-sm text-muted-foreground mb-2">$19.99/month</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Next billing: May 1, 2025</span>
                      <span>Auto-renew: On</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full">Upgrade</Button>
                    <Button variant="outline" className="w-full text-destructive">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how PayNex looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Theme</h3>
                
                <div className="flex flex-col gap-4">
                  <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value as "light" | "dark" | "system")} className="justify-start">
                    <ToggleGroupItem value="light" className="flex gap-2 w-full sm:w-auto">
                      <Sun className="h-5 w-5" />
                      <span>Light</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" className="flex gap-2 w-full sm:w-auto">
                      <Moon className="h-5 w-5" />
                      <span>Dark</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" className="flex gap-2 w-full sm:w-auto">
                      <MonitorSmartphone className="h-5 w-5" />
                      <span>System</span>
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {themeChanged && (
                    <p className="text-sm text-secondary animate-pulse">
                      Theme updated to {theme.charAt(0).toUpperCase() + theme.slice(1)} mode
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Language</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="font-medium">English (United States)</p>
                        <p className="text-sm text-muted-foreground">
                          Use English as the default language
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Display Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Make the UI more compact
                      </p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Show Balance on Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        Display your account balance on the dashboard
                      </p>
                    </div>
                    <Switch id="show-balance" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">Animations</p>
                      <p className="text-sm text-muted-foreground">
                        Enable UI animations and transitions
                      </p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
