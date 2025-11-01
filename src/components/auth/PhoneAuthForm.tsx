import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AuthStep = 'phone' | 'otp' | 'pin-setup' | 'pin-enter';

export function PhoneAuthForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('+233');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('phone-auth', {
        body: { action: 'send-otp', phone }
      });

      if (error) throw error;

      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${phone}`,
      });
      setStep('otp');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('phone-auth', {
        body: { action: 'verify-otp', phone, otp }
      });

      if (error) throw error;

      setIsNewUser(data.isNewUser);
      setUserId(data.userId);
      
      if (data.isNewUser) {
        toast({
          title: "Welcome to ZiroKash!",
          description: "Please set up your secure PIN",
        });
        setStep('pin-setup');
      } else {
        toast({
          title: "Welcome back!",
          description: "Please enter your PIN",
        });
        setStep('pin-enter');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPIN = async () => {
    if (pin.length < 4 || pin.length > 6) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 4-6 digits",
        variant: "destructive",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure both PINs are the same",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('phone-auth', {
        body: { action: 'create-account', phone, pin }
      });

      if (error) throw error;

      toast({
        title: "Account Created!",
        description: "Redirecting to dashboard...",
      });
      
      // Redirect will be handled by auth state change
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPIN = async () => {
    if (pin.length < 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your PIN",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('phone-auth', {
        body: { action: 'verify-pin', phone, pin, userId }
      });

      if (error) throw error;

      if (data.attemptsLeft !== undefined) {
        toast({
          title: "Invalid PIN",
          description: `${data.attemptsLeft} attempts remaining`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login Successful!",
        description: "Redirecting to dashboard...",
      });
      
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to ZiroKash</CardTitle>
        <CardDescription>
          {step === 'phone' && 'Enter your phone number to continue'}
          {step === 'otp' && 'Enter the code sent to your phone'}
          {step === 'pin-setup' && 'Create your secure PIN'}
          {step === 'pin-enter' && 'Enter your PIN to sign in'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'phone' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+233 24 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSendOTP} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
            </Button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <Button 
              onClick={handleVerifyOTP} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setStep('phone')}
              className="w-full"
            >
              Change Phone Number
            </Button>
          </>
        )}

        {step === 'pin-setup' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="pin">Create PIN (4-6 digits)</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="****"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pin">Confirm PIN</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-pin"
                  type="password"
                  placeholder="****"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1"
                />
              </div>
            </div>
            <Button 
              onClick={handleSetupPIN} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
          </>
        )}

        {step === 'pin-enter' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="pin">Enter PIN</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="****"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1"
                />
              </div>
            </div>
            <Button 
              onClick={handleVerifyPIN} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
            <Button 
              variant="link" 
              onClick={() => {
                setStep('phone');
                setOtp('');
                setPin('');
              }}
              className="w-full"
            >
              Forgot PIN? Reset via OTP
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}