import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Smartphone, 
  Fingerprint, 
  Lock, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Snowflake
} from "lucide-react";

export default function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [accountFrozen, setAccountFrozen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security and authentication methods
        </p>
      </div>

      <div className="grid gap-6">
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </div>
              </div>
              <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable 2FA</Label>
                <p className="text-sm text-muted-foreground">
                  Secure your account with SMS or authenticator app
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            {twoFactorEnabled && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm mb-2">Scan this QR code with your authenticator app:</p>
                <div className="w-32 h-32 bg-white rounded border flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biometric Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Fingerprint className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Biometric Authentication</CardTitle>
                  <CardDescription>
                    Use fingerprint or face recognition for quick access
                  </CardDescription>
                </div>
              </div>
              <Badge variant={biometricEnabled ? "default" : "secondary"}>
                {biometricEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Biometric Login</Label>
                <p className="text-sm text-muted-foreground">
                  Use your device's biometric features for authentication
                </p>
              </div>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* PIN Setup */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Transaction PIN</CardTitle>
                <CardDescription>
                  Set up a PIN for secure transactions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentPin">Current PIN</Label>
                <Input
                  id="currentPin"
                  type="password"
                  placeholder="Enter current PIN"
                  maxLength={6}
                />
              </div>
              <div>
                <Label htmlFor="newPin">New PIN</Label>
                <Input
                  id="newPin"
                  type="password"
                  placeholder="Enter new PIN"
                  maxLength={6}
                />
              </div>
            </div>
            <Button>Update PIN</Button>
          </CardContent>
        </Card>

        {/* Account Freeze */}
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Snowflake className="h-6 w-6 text-destructive" />
                <div>
                  <CardTitle className="text-destructive">Account Freeze</CardTitle>
                  <CardDescription>
                    Temporarily freeze your account for security
                  </CardDescription>
                </div>
              </div>
              <Badge variant={accountFrozen ? "destructive" : "secondary"}>
                {accountFrozen ? "Frozen" : "Active"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium">Security Warning</p>
                <p className="text-sm text-muted-foreground">
                  Freezing your account will block all transactions until you unfreeze it.
                </p>
              </div>
            </div>
            <Button
              variant={accountFrozen ? "default" : "destructive"}
              onClick={() => setAccountFrozen(!accountFrozen)}
            >
              {accountFrozen ? "Unfreeze Account" : "Freeze Account"}
            </Button>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-500" />
              <div>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>
                  Your account security score
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Password strength</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-factor authentication</span>
                {twoFactorEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Biometric login</span>
                {biometricEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Security Score</span>
                <span className="text-lg font-bold text-green-500">
                  {twoFactorEnabled && biometricEnabled ? "100%" : "75%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}