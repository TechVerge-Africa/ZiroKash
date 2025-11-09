import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Phone, Mail, User, Lock, Loader2 } from 'lucide-react';

interface MerchantOnboardingProps {
  onComplete: () => void;
}

export function MerchantOnboarding({ onComplete }: MerchantOnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Step 1: Business Info
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [merchantType, setMerchantType] = useState('');
  
  // Step 2: PIN
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const validateStep1 = () => {
    if (!businessName || businessName.length < 2) {
      toast({
        title: 'Invalid Business Name',
        description: 'Business name must be at least 2 characters',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!businessEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!businessPhone || !/^0\d{9}$/.test(businessPhone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Phone number must be 10 digits starting with 0',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!contactPerson || contactPerson.length < 2) {
      toast({
        title: 'Invalid Contact Person',
        description: 'Contact person name must be at least 2 characters',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!merchantType) {
      toast({
        title: 'Select Organization Type',
        description: 'Please select your organization type',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };
  
  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  const handleSubmit = async () => {
    if (pin !== confirmPin) {
      toast({
        title: 'PIN Mismatch',
        description: 'PINs do not match',
        variant: 'destructive'
      });
      return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      toast({
        title: 'Invalid PIN',
        description: 'PIN must be exactly 4 digits',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      const { error } = await supabase.functions.invoke('merchant-onboarding', {
        body: {
          business_name: businessName,
          business_email: businessEmail,
          business_phone: businessPhone,
          contact_person: contactPerson,
          merchant_type: merchantType,
          pin: pin
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: '🎉 Success!',
        description: 'Your merchant account has been activated! You can now start accepting payments.',
      });
      
      onComplete();
    } catch (error: any) {
      console.error('Merchant onboarding error:', error);
      toast({
        title: 'Onboarding Failed',
        description: error.message || 'Failed to complete onboarding',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Activate ZiroPay</h1>
        <p className="text-muted-foreground">
          Start accepting payments in Ghana in just 2 simple steps
        </p>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <div className={`h-1 w-20 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
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
            
            <Button onClick={handleStep1Next} className="w-full" size="lg">
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
                onClick={handleSubmit}
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
