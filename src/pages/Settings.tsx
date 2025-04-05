
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BellRing, Globe, Lock, Save, Shield, Smartphone, User } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security settings</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${activeTab === 'profile' ? 'bg-white/5 border-l-2 border-primary' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${activeTab === 'security' ? 'bg-white/5 border-l-2 border-primary' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <Lock className="h-5 w-5" />
                    <span>Security</span>
                  </button>
                  
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${activeTab === 'notifications' ? 'bg-white/5 border-l-2 border-primary' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <BellRing className="h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                  
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${activeTab === 'preferences' ? 'bg-white/5 border-l-2 border-primary' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <Globe className="h-5 w-5" />
                    <span>Preferences</span>
                  </button>
                  
                  <button 
                    className={`flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${activeTab === 'privacy' ? 'bg-white/5 border-l-2 border-primary' : ''}`}
                    onClick={() => setActiveTab('privacy')}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Privacy</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                          J
                        </div>
                        <div>
                          <Button size="sm" variant="outline">Change Avatar</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Smith" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.smith@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main Street" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="San Francisco" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input id="zipCode" defaultValue="94105" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select defaultValue="usa">
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>Manage your connected accounts and social profiles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.5 12.5C22.5 10.92 22.302 9.55 21.9 8.4H12.5V13.47H18.2C18 14.96 17.21 16.22 15.98 17.06V19.56H19.2C21.2 17.83 22.5 15.4 22.5 12.5Z" fill="currentColor"/>
                              <path d="M12.5 23C15.5 23 18 22 19.9 19.57L16.7 17.07C15.8 17.67 14.4 18.08 12.5 18.08C9.62 18.08 7.18 16.17 6.35 13.57H3.03V16.14C4.93 20.24 8.45 23 12.5 23Z" fill="currentColor"/>
                              <path d="M6.35 13.5C6.15 13 6.05 12.45 6.05 11.88C6.05 11.31 6.15 10.76 6.35 10.26V7.69H3.03C2.33 9.25 1.88 10.92 1.88 12.69C1.88 14.46 2.33 16.13 3.03 17.69L6.35 15.12V13.5Z" fill="currentColor"/>
                              <path d="M12.5 5.78C14.04 5.78 15.4 6.33 16.44 7.3L19.2 4.54C17.39 2.87 15.12 1.88 12.5 1.88C8.45 1.88 4.93 4.64 3.03 8.74L6.35 11.31C7.18 8.71 9.62 5.78 12.5 5.78Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-xs text-muted-foreground">Connected as john.smith@gmail.com</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Disconnect</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-green-500/20 flex items-center justify-center">
                            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 7.20001H15V5.40001C15 4.07001 13.93 3 12.6 3H5.4C4.07 3 3 4.07001 3 5.40001V18.6C3 19.93 4.07 21 5.4 21H18.6C19.93 21 21 19.93 21 18.6V10.2C21 8.87001 19.93 7.20001 18 7.20001ZM6 8.40001H12V10.8H6V8.40001ZM18 18H6V15.6H18V18ZM18 13.2H6V12.6H18V13.2ZM18 10.2H15V9.60001H18V10.2Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Bank Account</p>
                            <p className="text-xs text-muted-foreground">Chase ••••1234</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Disconnect</Button>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      
                      <Button type="submit">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Authentication App</div>
                          <div className="text-sm text-muted-foreground">Use an authentication app like Google Authenticator or Authy</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">SMS Authentication</div>
                          <div className="text-sm text-muted-foreground">Receive a code via text message</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Biometric Authentication</div>
                          <div className="text-sm text-muted-foreground">Use fingerprint or face recognition</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Security Keys</CardTitle>
                    <CardDescription>Manage hardware security keys</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">YubiKey 5 NFC</p>
                            <p className="text-xs text-muted-foreground">Added on Apr 2, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Security Key
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-transactions" className="flex-1">Transaction Confirmations</Label>
                          <Switch id="email-transactions" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-security" className="flex-1">Security Alerts</Label>
                          <Switch id="email-security" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-newsletter" className="flex-1">Newsletter and Updates</Label>
                          <Switch id="email-newsletter" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-marketing" className="flex-1">Marketing and Promotions</Label>
                          <Switch id="email-marketing" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Push Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-transactions" className="flex-1">Transaction Alerts</Label>
                          <Switch id="push-transactions" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-security" className="flex-1">Security Alerts</Label>
                          <Switch id="push-security" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-balance" className="flex-1">Balance Updates</Label>
                          <Switch id="push-balance" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-offers" className="flex-1">New Offers and Rewards</Label>
                          <Switch id="push-offers" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">SMS Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-transactions" className="flex-1">Transaction Alerts</Label>
                          <Switch id="sms-transactions" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-security" className="flex-1">Security Alerts</Label>
                          <Switch id="sms-security" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-balance" className="flex-1">Balance Updates</Label>
                          <Switch id="sms-balance" />
                        </div>
                      </div>
                    </div>
                    
                    <Button>Save Notification Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Language and Region</CardTitle>
                    <CardDescription>Set your preferred language and regional settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="ja">日本語</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select defaultValue="america-los_angeles">
                          <SelectTrigger>
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america-los_angeles">Pacific Time (US & Canada)</SelectItem>
                            <SelectItem value="america-denver">Mountain Time (US & Canada)</SelectItem>
                            <SelectItem value="america-chicago">Central Time (US & Canada)</SelectItem>
                            <SelectItem value="america-new_york">Eastern Time (US & Canada)</SelectItem>
                            <SelectItem value="europe-london">London</SelectItem>
                            <SelectItem value="europe-paris">Paris</SelectItem>
                            <SelectItem value="asia-tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
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
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button type="submit">Save Preferences</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the appearance of your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Theme</Label>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="border border-primary rounded-md p-2 flex items-center justify-center flex-col gap-2">
                            <div className="h-12 w-full rounded bg-black"></div>
                            <span className="text-sm">Dark (Default)</span>
                          </div>
                          
                          <div className="border border-gray-600 rounded-md p-2 flex items-center justify-center flex-col gap-2">
                            <div className="h-12 w-full rounded bg-white"></div>
                            <span className="text-sm">Light</span>
                          </div>
                          
                          <div className="border border-gray-600 rounded-md p-2 flex items-center justify-center flex-col gap-2">
                            <div className="h-12 w-full rounded bg-gradient-to-r from-slate-900 to-slate-700"></div>
                            <span className="text-sm">System</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Dashboard Layout</Label>
                        <Select defaultValue="default">
                          <SelectTrigger>
                            <SelectValue placeholder="Select layout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="expanded">Expanded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="animations" className="flex-1">Enable Animations</Label>
                        <Switch id="animations" defaultChecked />
                      </div>
                      
                      <Button>Save Appearance Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your data and privacy preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Analytics and Tracking</div>
                          <div className="text-sm text-muted-foreground">Allow us to collect app usage data to improve our services</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Personalized Recommendations</div>
                          <div className="text-sm text-muted-foreground">Receive personalized offers and suggestions</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Transaction History Visibility</div>
                          <div className="text-sm text-muted-foreground">Make your transaction history visible in blockchain explorers</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Share Account Data with Partners</div>
                          <div className="text-sm text-muted-foreground">Allow trusted partners to access your data for service improvement</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <Button>Save Privacy Settings</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Manage your personal data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h3 className="font-medium mb-2">Download Your Data</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Request a copy of your personal data including transaction history, account details, and preferences.
                        </p>
                        <Button variant="outline">Request Data Export</Button>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5 border border-red-500/20">
                        <h3 className="font-medium mb-2 text-red-500">Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Had to include this to fix the TypeScript error for Plus component
function Plus({ className, ...props }) {
  return (
    <svg
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
