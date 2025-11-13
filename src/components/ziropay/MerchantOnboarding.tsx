import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Phone, Mail, User, Loader2 } from 'lucide-react';

interface MerchantOnboardingProps {
  onComplete: () => void;
}

export function MerchantOnboarding({ onComplete }: MerchantOnboardingProps) {
  const [loading, setLoading] = useState(false);
  
  // Business Info
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [merchantType, setMerchantType] = useState('');
  
  // Settlement Account
  const [settlementType, setSettlementType] = useState<'momo' | 'bank'>('momo');
  const [momoProvider, setMomoProvider] = useState('');
  const [momoPhone, setMomoPhone] = useState('');
  const [momoAccountName, setMomoAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [branch, setBranch] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !businessEmail || !businessPhone || !contactPerson || !merchantType) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (settlementType === 'momo') {
      if (!momoProvider || !momoPhone || !momoAccountName) {
        toast.error('Please fill all settlement account fields');
        return;
      }
    } else {
      if (!bankName || !accountNumber || !bankAccountName) {
        toast.error('Please fill all settlement account fields');
        return;
      }
    }
    
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
          settlement_type: settlementType,
          settlement_account,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      toast.success('🎉 Success! Your ZiroPay account is now active!');
      
      onComplete();
    } catch (error: any) {
      console.error('Merchant onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Activate ZiroPay</CardTitle>
          <CardDescription>
            Start accepting payments in Ghana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Business Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="e.g., Accra High School"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchantType">Organization Type *</Label>
                <Select value={merchantType} onValueChange={setMerchantType} required>
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
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Settlement Account */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Settlement Account</h3>
              <p className="text-sm text-muted-foreground">Where should we send your payments?</p>
              
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
                    <Label htmlFor="momo-phone">Phone Number *</Label>
                    <Input
                      id="momo-phone"
                      type="tel"
                      placeholder="0XXXXXXXXX"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      maxLength={10}
                      required
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
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Bank Name *</Label>
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
                    <Label htmlFor="account-number">Account Number *</Label>
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
                    <Label htmlFor="bank-name">Account Name *</Label>
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
            </div>
            
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                'Activate ZiroPay 🎉'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
