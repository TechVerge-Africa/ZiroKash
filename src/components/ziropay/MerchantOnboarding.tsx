import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Phone, Mail, User, Lock, Loader2 } from 'lucide-react';

interface MerchantOnboardingProps {
  onComplete: () => void;
}

export function MerchantOnboarding({ onComplete }: MerchantOnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Business Info
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [merchantType, setMerchantType] = useState('');
  
  // Step 2: PIN
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  // Step 3: Settlement Account
  const [settlementType, setSettlementType] = useState<'momo' | 'bank'>('momo');
  const [momoProvider, setMomoProvider] = useState('');
  const [momoPhone, setMomoPhone] = useState('');
  const [momoAccountName, setMomoAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [branch, setBranch] = useState('');
  
  const validateStep1 = () => {
    if (!businessName || businessName.length < 2) {
      toast.error('Business name must be at least 2 characters');
      return false;
    }
    
    if (!businessEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!businessPhone || !/^0\d{9}$/.test(businessPhone)) {
      toast.error('Phone number must be 10 digits starting with 0');
      return false;
    }
    
    if (!contactPerson || contactPerson.length < 2) {
      toast.error('Contact person name must be at least 2 characters');
      return false;
    }
    
    if (!merchantType) {
      toast.error('Please select your organization type');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (pin !== confirmPin) {
      toast.error('PINs do not match');
      return false;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      toast.error('PIN must be exactly 4 digits');
      return false;
    }
    
    return true;
  };
  
  const validateStep3 = () => {
    if (settlementType === 'momo') {
      if (!momoProvider) {
        toast.error('Please select a mobile money provider');
        return false;
      }
      if (!momoPhone || !/^0\d{9}$/.test(momoPhone)) {
        toast.error('Please enter a valid Ghana phone number');
        return false;
      }
      if (!momoAccountName) {
        toast.error('Please enter account name');
        return false;
      }
    } else {
      if (!bankName) {
        toast.error('Please select a bank');
        return false;
      }
      if (!accountNumber) {
        toast.error('Please enter account number');
        return false;
      }
      if (!bankAccountName) {
        toast.error('Please enter account name');
        return false;
      }
    }
    return true;
  };
  
  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3) {
      if (!validateStep3()) return;
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      const settlement_account = settlementType === 'momo' 
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
      
      const { error } = await supabase.functions.invoke('merchant-onboarding', {
        body: {
          business_name: businessName,
          business_email: businessEmail,
          business_phone: businessPhone,
          contact_person: contactPerson,
          merchant_type: merchantType,
          pin: pin,
          settlement_type: settlementType,
          settlement_account,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      toast.success('🎉 Success! Your ZiroPay account is now active and ready to receive payments.');
      
      onComplete();
    } catch (error: any) {
      console.error('Merchant onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Activate ZiroPay</h1>
        <p className="text-muted-foreground">
          Start accepting payments in Ghana in just 3 simple steps
        </p>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            3
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Tell us about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business/Organization Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  placeholder="e.g., Accra High School"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="merchantType">Organization Type *</Label>
              <Select value={merchantType} onValueChange={setMerchantType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="church">Church</SelectItem>
                  <SelectItem value="ngo">NGO/Charity</SelectItem>
                  <SelectItem value="association">Association</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPerson"
                  placeholder="Your full name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Business Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="business@example.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Business Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessPhone"
                  placeholder="0XXXXXXXXX"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground">Ghana phone number (10 digits)</p>
            </div>
            
            <Button onClick={handleNext} className="w-full" size="lg">
              Continue to Security Setup →
            </Button>
          </CardContent>
        </Card>
      )}
      
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Security PIN Setup</CardTitle>
            <CardDescription>
              Create a 4-digit PIN to secure your ZiroPay account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Create 4-Digit PIN *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="****"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="pl-10"
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="****"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="pl-10"
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">PIN Security Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use a unique 4-digit code</li>
                <li>• Don't use obvious numbers (1234, 0000)</li>
                <li>• Keep your PIN confidential</li>
                <li>• After 3 wrong attempts, your account locks for 30 minutes</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                ← Back
              </Button>
              <Button
                onClick={handleNext}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                Continue to Settlement Account →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Settlement Account</CardTitle>
            <CardDescription>
              Where should we send your payments?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Account Type</Label>
              <RadioGroup value={settlementType} onValueChange={(v) => setSettlementType(v as 'momo' | 'bank')}>
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

            {settlementType === 'momo' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider *</Label>
                  <Select value={momoProvider} onValueChange={setMomoProvider}>
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
                  <Label htmlFor="momo-phone">Phone Number *</Label>
                  <Input
                    id="momo-phone"
                    type="tel"
                    placeholder="0XXXXXXXXX"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="momo-name">Account Name *</Label>
                  <Input
                    id="momo-name"
                    type="text"
                    placeholder="John Doe"
                    value={momoAccountName}
                    onChange={(e) => setMomoAccountName(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank Name *</Label>
                  <Select value={bankName} onValueChange={setBankName}>
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
                  <Label htmlFor="account-number">Account Number *</Label>
                  <Input
                    id="account-number"
                    type="text"
                    placeholder="XXXXXXXXXXXX"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-name">Account Name *</Label>
                  <Input
                    id="bank-name"
                    type="text"
                    placeholder="John Doe Business"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
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
            
            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                ← Back
              </Button>
              <Button
                onClick={handleNext}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'Activate ZiroPay 🎉'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
