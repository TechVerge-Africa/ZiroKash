import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Globe, 
  Smartphone, 
  Wifi, 
  Bell,
  Lock,
  CreditCard,
  Settings,
  AlertTriangle,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CardSettingsProps {
  cardId: string;
  cardName: string;
  settings: {
    onlineTransactions: boolean;
    internationalTransactions: boolean;
    contactlessPayments: boolean;
    notifications: boolean;
    dailyLimit: number;
    monthlyLimit: number;
  };
  onUpdateSettings: (cardId: string, settings: any) => void;
}

export default function CardManagement({ cardId, cardName, settings, onUpdateSettings }: CardSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    onUpdateSettings(cardId, localSettings);
    setHasChanges(false);
    toast({
      title: "Settings updated",
      description: "Your card settings have been saved successfully.",
    });
  };

  const handleResetSettings = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="online-transactions" className="text-base">Online Transactions</Label>
              <p className="text-sm text-muted-foreground">
                Allow online and e-commerce payments
              </p>
            </div>
            <Switch
              id="online-transactions"
              checked={localSettings.onlineTransactions}
              onCheckedChange={(checked) => handleSettingChange('onlineTransactions', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="international-transactions" className="text-base">International Transactions</Label>
              <p className="text-sm text-muted-foreground">
                Allow payments outside your country
              </p>
            </div>
            <Switch
              id="international-transactions"
              checked={localSettings.internationalTransactions}
              onCheckedChange={(checked) => handleSettingChange('internationalTransactions', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contactless-payments" className="text-base">Contactless Payments</Label>
              <p className="text-sm text-muted-foreground">
                Allow tap-to-pay functionality
              </p>
            </div>
            <Switch
              id="contactless-payments"
              checked={localSettings.contactlessPayments}
              onCheckedChange={(checked) => handleSettingChange('contactlessPayments', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">Transaction Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified for all card transactions
              </p>
            </div>
            <Switch
              id="notifications"
              checked={localSettings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Spending Limits */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Spending Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily-limit">Daily Spending Limit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="daily-limit"
                  type="number"
                  value={localSettings.dailyLimit}
                  onChange={(e) => handleSettingChange('dailyLimit', parseInt(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-limit">Monthly Spending Limit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthly-limit"
                  type="number"
                  value={localSettings.monthlyLimit}
                  onChange={(e) => handleSettingChange('monthlyLimit', parseInt(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Note</p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Setting lower limits helps protect against unauthorized spending. You can adjust these anytime.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card Actions */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Card Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Request Limit Increase
            </Button>

            <Button variant="outline" className="justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Replace Card
            </Button>

            <Button variant="outline" className="justify-start">
              <Lock className="mr-2 h-4 w-4" />
              Change PIN
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Close Card
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently close your {cardName}. You won't be able to use this card for transactions and this action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Close Card
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Save/Reset Actions */}
      {hasChanges && (
        <Card className="glass-card border-white/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">You have unsaved changes</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button size="sm" onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}