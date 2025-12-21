import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMerchant, Bank } from "@/hooks/useMerchant";
import { toast } from "sonner";
import { Loader2, Building2, CheckCircle2, Banknote, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Step = 'business' | 'bank' | 'verify' | 'complete';

export function MerchantOnboarding() {
  const { user } = useAuth();
  const { 
    merchant, 
    loading, 
    banks, 
    loadingBanks, 
    fetchBanks, 
    verifyBankAccount, 
    createMerchant, 
    setupPaystackSubaccount 
  } = useMerchant();

  const [step, setStep] = useState<Step>('business');
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Business form
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Bank form
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountVerified, setAccountVerified] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setBusinessEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (merchant) {
      if (merchant.paystack_subaccount_code) {
        setStep('complete');
      } else {
        setStep('bank');
        setBusinessName(merchant.business_name);
      }
    }
  }, [merchant]);

  useEffect(() => {
    if (step === 'bank' && banks.length === 0) {
      fetchBanks();
    }
  }, [step]);

  const handleBusinessSubmit = async () => {
    if (!businessName || !businessEmail) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      await createMerchant({
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
      });
      toast.success('Business details saved');
      setStep('bank');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save business details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!accountNumber || !selectedBank) {
      toast.error('Please enter account details');
      return;
    }

    setVerifying(true);
    try {
      const result = await verifyBankAccount(accountNumber, selectedBank);
      if (result.verified) {
        setAccountName(result.account_name);
        setAccountVerified(true);
        toast.success(`Account verified: ${result.account_name}`);
        setStep('verify');
      } else {
        toast.error('Account verification failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleCompleteSetup = async () => {
    setSubmitting(true);
    try {
      await setupPaystackSubaccount(businessName, selectedBank, accountNumber, accountName);
      toast.success('Merchant setup complete! You can now receive payments.');
      setStep('complete');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete setup');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Step indicators
  const steps = [
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'bank', label: 'Bank', icon: Banknote },
    { id: 'verify', label: 'Verify', icon: UserCheck },
    { id: 'complete', label: 'Done', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = index === currentStepIndex;
          const isComplete = index < currentStepIndex;
          
          return (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                isComplete ? 'bg-primary border-primary text-primary-foreground' :
                isActive ? 'border-primary text-primary' :
                'border-muted text-muted-foreground'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-1 ${
                  index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {step === 'business' && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>Tell us about your business to start accepting payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="business@example.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Phone Number</Label>
                <Input
                  id="businessPhone"
                  placeholder="+233 XX XXX XXXX"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  placeholder="Your business address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleBusinessSubmit} disabled={submitting} className="w-full mt-4">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue to Bank Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'bank' && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Settlement Bank Account</CardTitle>
            <CardDescription>Add your bank account to receive payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingBanks ? "Loading banks..." : "Select your bank"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {banks.map((bank: Bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setAccountVerified(false);
                }}
                maxLength={15}
              />
            </div>
            <Button 
              onClick={handleVerifyAccount} 
              disabled={verifying || !selectedBank || !accountNumber}
              className="w-full"
            >
              {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify Account
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'verify' && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Confirm Account Details</CardTitle>
            <CardDescription>Review and confirm your settlement account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Name</span>
                <span className="font-medium">{businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium">
                  {banks.find(b => b.code === selectedBank)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium text-green-600">{accountName}</span>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ Please confirm these details are correct. Payments will be settled to this account.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('bank')} className="flex-1">
                Change Bank
              </Button>
              <Button onClick={handleCompleteSetup} disabled={submitting} className="flex-1">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && merchant && (
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Merchant Setup Complete!</CardTitle>
            <CardDescription>You're all set to receive payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business</span>
                <span className="font-medium">{merchant.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Settlement Account</span>
                <span className="font-mono text-sm">
                  {merchant.settlement_account_name} - {merchant.settlement_account_number?.slice(-4).padStart(10, '•')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
