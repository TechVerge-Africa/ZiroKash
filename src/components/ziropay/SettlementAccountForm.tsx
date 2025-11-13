import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SettlementAccountFormProps {
  currentAccount?: any;
  onUpdate?: () => void;
}

export function SettlementAccountForm({ currentAccount, onUpdate }: SettlementAccountFormProps) {
  const [accountType, setAccountType] = useState<'momo' | 'bank'>(
    currentAccount?.type || 'momo'
  );
  const [loading, setLoading] = useState(false);

  // Mobile Money fields
  const [momoProvider, setMomoProvider] = useState(currentAccount?.provider || '');
  const [momoPhone, setMomoPhone] = useState(currentAccount?.phone || '');
  const [momoAccountName, setMomoAccountName] = useState(currentAccount?.account_name || '');

  // Bank fields
  const [bankName, setBankName] = useState(currentAccount?.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(currentAccount?.account_number || '');
  const [bankAccountName, setBankAccountName] = useState(currentAccount?.account_name || '');
  const [branch, setBranch] = useState(currentAccount?.branch || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const settlement_account = accountType === 'momo' 
        ? {
            type: 'momo',
            provider: momoProvider,
            phone: momoPhone,
            account_name: momoAccountName,
          }
        : {
            type: 'bank',
            bank_name: bankName,
            account_number: accountNumber,
            account_name: bankAccountName,
            branch: branch || undefined,
          };

      const { error } = await supabase.functions.invoke('update-settlement-account', {
        body: {
          settlement_type: accountType,
          settlement_account,
        },
      });

      if (error) throw error;

      toast.success('Settlement account updated successfully');
      onUpdate?.();
    } catch (error: any) {
      console.error('Error updating settlement account:', error);
      toast.error(error.message || 'Failed to update settlement account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement Account</CardTitle>
        <CardDescription>
          Update where you want to receive your payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Account Type</Label>
            <RadioGroup value={accountType} onValueChange={(v) => setAccountType(v as 'momo' | 'bank')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="momo" id="momo" />
                <Label htmlFor="momo" className="font-normal cursor-pointer">Mobile Money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="font-normal cursor-pointer">Bank Account</Label>
              </div>
            </RadioGroup>
          </div>

          {accountType === 'momo' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select value={momoProvider} onValueChange={setMomoProvider} required>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                    <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="momo-phone">Phone Number</Label>
                <Input
                  id="momo-phone"
                  type="tel"
                  placeholder="0XXXXXXXXX"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  pattern="^0\d{9}$"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="momo-name">Account Name</Label>
                <Input
                  id="momo-name"
                  type="text"
                  placeholder="John Doe"
                  value={momoAccountName}
                  onChange={(e) => setMomoAccountName(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank">Bank Name</Label>
                <Select value={bankName} onValueChange={setBankName} required>
                  <SelectTrigger id="bank">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GCB Bank">GCB Bank</SelectItem>
                    <SelectItem value="Ecobank Ghana">Ecobank Ghana</SelectItem>
                    <SelectItem value="Stanbic Bank">Stanbic Bank</SelectItem>
                    <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                    <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
                    <SelectItem value="Absa Bank">Absa Bank</SelectItem>
                    <SelectItem value="Standard Chartered">Standard Chartered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  type="text"
                  placeholder="XXXXXXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank-name">Account Name</Label>
                <Input
                  id="bank-name"
                  type="text"
                  placeholder="John Doe Business"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch (Optional)</Label>
                <Input
                  id="branch"
                  type="text"
                  placeholder="Accra Main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Settlement Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
