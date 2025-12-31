import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMerchant, Bank } from "@/hooks/useMerchant";
import { toast } from "sonner";
import { Loader2, Banknote, UserCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Step = 'bank' | 'verify' | 'complete';

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

  const [step, setStep] = useState<Step>('bank');
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Bank form
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountVerified, setAccountVerified] = useState(false);

  useEffect(() => {
    if (merchant) {
      if (merchant.paystack_subaccount_code) {
        setStep('complete');
      } else {
        setStep('bank');
      }
    }
  }, [merchant]);

  useEffect(() => {
    if (step === 'bank' && banks.length === 0) {
      fetchBanks();
    }
  }, [step]);

  // Auto-verify account when user stops typing (debounced)
  useEffect(() => {
    const trimmedAccountNumber = accountNumber.trim();
    
    // Only auto-verify if account number is between 10-16 digits
    if (trimmedAccountNumber.length >= 10 && trimmedAccountNumber.length <= 16 && selectedBank && !accountVerified && !verifying) {
      const timeoutId = setTimeout(() => {
        handleVerifyAccount(true); // true = auto mode (no validation errors)
      }, 1000); // Wait 1 second after user stops typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [accountNumber, selectedBank]);

  const handleVerifyAccount = async (isAuto = false) => {
    if (!accountNumber || !selectedBank) {
      toast.error('Please enter account details');
      return;
    }

    const trimmedAccountNumber = accountNumber.trim();
    
    // Validate account number length (typically 10-16 digits for Ghana banks)
    if (!isAuto && (trimmedAccountNumber.length < 10 || trimmedAccountNumber.length > 16)) {
      toast.error('Account number must be between 10-16 digits');
      return;
    }
    
    // For auto mode, silently return if not in valid range
    if (isAuto && (trimmedAccountNumber.length < 10 || trimmedAccountNumber.length > 16)) {
      return;
    }

    setVerifying(true);
    try {
      const result = await verifyBankAccount(trimmedAccountNumber, selectedBank);
      if (result && result.verified) {
        setAccountName(result.accountName);
        setAccountVerified(true);
        toast.success(`Account verified: ${result.accountName}`);
      } else {
        toast.error(result?.message || 'Account verification failed');
        setAccountVerified(false);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Verification failed. Please try again.');
      setAccountVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleCompleteSetup = async () => {
    if (!accountVerified || !accountName) {
      toast.error('Please verify your account first');
      return;
    }

    setSubmitting(true);
    try {
      let currentMerchant = merchant;

      // 1. Create merchant record if it doesn't exist
      if (!currentMerchant) {
        try {
          currentMerchant = await createMerchant({
            businessName: user?.email || 'ZiroPay Merchant',
            businessEmail: user?.email || '',
          });
          
          if (!currentMerchant) {
            throw new Error("Failed to create merchant profile");
          }
          // Refresh to ensure we have the latest state
          await fetchMerchant(); 
        } catch (err: any) {
           console.error("Merchant creation failed", err);
           // If error is regarding "approved" enum, give specific advice
           if (err.message?.includes("approved") || err.details?.includes("approved")) {
             throw new Error("Database configuration error. Please contact support to reset merchant status.");
           }
           throw err;
        }
      }

      // 2. Setup Paystack subaccount (Requires merchant record to exist)
      await setupPaystackSubaccount(
        user?.email || 'ZiroPay Merchant',
        selectedBank,
        accountNumber.trim(),
        accountName
      );
      
      toast.success('Merchant setup complete! You can now receive payments.');
      setStep('complete');
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to complete setup. Please try again.');
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

      {step === 'bank' && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Settlement Bank Account</CardTitle>
            <CardDescription>
              Add your bank account to receive payments from your payment forms.
              You can create multiple forms for different businesses without needing to add business details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingBanks ? "Loading banks..." : "Select your bank"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {banks.length === 0 && loadingBanks && (
                    <div className="p-2 text-sm text-muted-foreground">Loading banks...</div>
                  )}
                  {banks.length === 0 && !loadingBanks && (
                    <div className="p-2 text-sm text-muted-foreground">No banks available</div>
                  )}
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
              />
            </div>
            {accountVerified && accountName && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm font-medium text-green-600">✓ Account Verified</p>
                <p className="text-sm text-muted-foreground mt-1">{accountName}</p>
              </div>
            )}
            {verifying && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <p className="text-sm text-blue-600">Verifying account...</p>
              </div>
            )}
            {accountVerified && accountName ? (
              <Button 
                onClick={() => setStep('verify')} 
                className="w-full"
              >
                Continue
              </Button>
            ) : (
              <Button 
              onClick={() => handleVerifyAccount(false)} 
              disabled={verifying || !selectedBank || !accountNumber}
              className="w-full"
            >
              {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify Account
            </Button>
            )}
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
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Tip: Create payment forms in the ZiroPay section. Each form can have its own business name and branding.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
