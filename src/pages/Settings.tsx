
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { BellRing, CreditCard, Globe, Key, Lock, LogOut, Shield, User } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>
        <Button variant="destructive" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter your address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" placeholder="Zip Code" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button className="mt-2">Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline">Set Up 2FA</Button>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-medium">Sessions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-xs text-muted-foreground">Chrome on macOS • 192.168.1.1</p>
                        </div>
                        <p className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Active</p>
                      </div>
                    </div>
                    <Button variant="outline">Sign Out All Other Sessions</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <BellRing className="h-5 w-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Payment Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified about incoming and outgoing payments</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Account Updates</p>
                          <p className="text-sm text-muted-foreground">Receive updates about your account status</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Card Activity</p>
                          <p className="text-sm text-muted-foreground">Get alerts for card transactions</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Security Alerts</p>
                          <p className="text-sm text-muted-foreground">Be notified about suspicious activities</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Email Notifications</p>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">SMS Notifications</p>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Push Notifications</p>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Display</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h3 className="text-lg font-medium">Language & Region</h3>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select id="language" className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <select id="currency" className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5">
                          <option value="usd">USD - US Dollar</option>
                          <option value="eur">EUR - Euro</option>
                          <option value="gbp">GBP - British Pound</option>
                          <option value="jpy">JPY - Japanese Yen</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h3 className="text-lg font-medium">Privacy</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Usage Analytics</p>
                          <p className="text-sm text-muted-foreground">Share anonymous usage data to help improve our services</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Communications</p>
                          <p className="text-sm text-muted-foreground">Receive news and special offers</p>
                        </div>
                        <Switch />
                      </div>
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
              <CardTitle className="text-lg font-medium">Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="font-medium">Apr 2025</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <p className="text-xs text-muted-foreground">Account Type</p>
                    <p className="font-medium">Premium</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Key className="mr-2 h-4 w-4" />
                  Security Keys
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Globe className="mr-2 h-4 w-4" />
                  Language Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-red-500">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10">
                  Deactivate Account
                </Button>
                <Button variant="destructive" className="w-full" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
