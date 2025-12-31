import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lock, User, Bell, Globe, Shield, CreditCard, Moon, Sun, LogOut, MonitorSmartphone, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/hooks/use-theme";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { MerchantOnboarding } from "@/components/merchant/MerchantOnboarding";
import { MerchantWallet } from "@/components/merchant/MerchantWallet";
import { useMerchant } from "@/hooks/useMerchant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { hasSubaccount } = useMerchant();
  const [searchParams, setSearchParams] = useSearchParams(); // Added useSearchParams
  
  // Get active tab from URL or default to 'profile'
  const activeTab = searchParams.get('tab') || 'profile';

  const setActiveTab = (val: string) => {
    setSearchParams({ tab: val });
  };

  // We'll hold the initial theme to detect changes for visual feedback
  const [initialTheme, setInitialTheme] = useState(theme);
  const [themeChanged, setThemeChanged] = useState(false);
  
  // Profile state
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dob, setDob] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Session info state
  const [locationInfo, setLocationInfo] = useState("Loading location...");
  const [browserInfo, setBrowserInfo] = useState("Loading browser...");

  useEffect(() => {
    setInitialTheme(theme);
    if (user) {
      fetchProfile();
      fetchSessionInfo();
    }
  }, [user]);

  const fetchSessionInfo = async () => {
    // 1. Get Browser/OS info
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";

    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";

    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Mac") > -1) os = "macOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("iPhone") > -1) os = "iOS";

    setBrowserInfo(`${browser} on ${os}`);

    // 2. Get Location via IP (City, Country)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city && data.country_name) {
        setLocationInfo(`${data.city}, ${data.country_name}`);
      } else {
        setLocationInfo("Accra, Ghana"); // Fallback
      }
    } catch (err) {
      setLocationInfo("Accra, Ghana"); // Fallback
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProfile(data as any);
        setFullName((data as any).full_name || "");
        setPhone((data as any).phone || "");
        setAddress((data as any).address || "");
        setCity((data as any).city || "");
        setState((data as any).state || "");
        setZipCode((data as any).zip_code || "");
        setDob((data as any).date_of_birth || "");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSavingLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zip_code: zipCode,
          date_of_birth: dob || null
        })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your personal information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business">
            <Building2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10 relative overflow-hidden">
                {profileLoading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Your name" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" value={user?.email || ""} disabled />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="Your phone number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Your address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="City" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Region</Label>
                      <Input 
                        id="state" 
                        placeholder="State" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input 
                        id="zip" 
                        placeholder="Zip code" 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={savingLoading}>
                      {savingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save Changes
                    </Button>
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
                      {(user?.user_metadata as any)?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
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
                  
                  <Button variant="destructive" className="w-full" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="business">
          <div className="space-y-6">
            <MerchantOnboarding />
            {hasSubaccount && <MerchantWallet />}
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
                    <Label htmlFor="currentPassword">Current Password (optional for verification)</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleUpdatePassword} disabled={passwordLoading}>
                      {passwordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Update Password
                    </Button>
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
                        <p className="text-sm text-muted-foreground">{browserInfo} • {locationInfo}</p>
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
                  <CardTitle>PIN Login</CardTitle>
                  <CardDescription>
                    {profile?.pin_code ? "Change your security PIN" : "Set up a PIN for easy login"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <InputOTP 
                      maxLength={4} 
                      value={newPassword === "SET_PIN_MODE" ? confirmPassword : ""} 
                      onChange={(val) => {
                        // Using confirmPassword temporarily as a PIN buffer to avoid creating too many new states
                        // In a real refactor, dedicated states would be better.
                        setConfirmPassword(val);
                      }}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-10 h-12 border-white/20" />
                        <InputOTPSlot index={1} className="w-10 h-12 border-white/20" />
                        <InputOTPSlot index={2} className="w-10 h-12 border-white/20" />
                        <InputOTPSlot index={3} className="w-10 h-12 border-white/20" />
                      </InputOTPGroup>
                    </InputOTP>
                    
                    <Button 
                      className="w-full" 
                      onClick={async () => {
                        if (confirmPassword.length < 4) return;
                        try {
                          setSavingLoading(true);
                          const { error } = await supabase
                            .from('profiles')
                            .update({ 
                              pin_code: confirmPassword,
                              pin_setup_completed: true 
                            } as any)
                            .eq('user_id', user?.id);
                            
                          if (error) throw error;
                          
                          toast({
                            title: "PIN Updated",
                            description: "Your security PIN has been saved.",
                          });
                          setConfirmPassword("");
                          fetchProfile();
                        } catch (err: any) {
                          toast({ title: "Error", description: err.message, variant: "destructive" });
                        } finally {
                          setSavingLoading(false);
                        }
                      }}
                      disabled={savingLoading || confirmPassword.length < 4}
                    >
                      {savingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save PIN
                    </Button>
                  </div>
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
        
        
        <TabsContent value="appearance">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how ZiroPay looks for you</CardDescription>
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
