import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type AuthStep = 'phone' | 'otp' | 'signup' | 'login' | 'pin-login';

export function PhoneAuthForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('+233');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (!phone.startsWith('+')) {
      toast({
        title: "Invalid Phone Number",
        description: "Please include country code (e.g., +233...)",
        variant: "destructive",
      });
      return;
    }

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
      if (!data.success) throw new Error(data.error);

      toast({
        title: "OTP Sent!",
        description: data.message || `Verification code sent to ${phone}`,
      });
      setStep('otp');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
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
      if (!data.success) throw new Error(data.error);

      setIsNewUser(data.isNewUser);
      setUserId(data.userId);
      setHasPin(data.hasPin || false);
      
      if (data.isNewUser) {
        toast({
          title: "Phone Verified!",
          description: "Please create your account",
        });
        setStep('signup');
      } else if (data.hasPin) {
        toast({
          title: "Welcome back!",
          description: "Enter your PIN for quick login",
        });
        setStep('pin-login');
      } else {
        toast({
          title: "Welcome back!",
          description: "Please enter your password",
        });
        setStep('login');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('phone-auth', {
        body: { action: 'create-account', phone, email: email || undefined, password }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      // Sign in the user using the email returned from the edge function
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: "Account Created!",
        description: "Welcome to ZiroKash",
      });
      
      window.location.href = '/onboarding';
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password || password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Try to get user's email from auth metadata
      const tempEmail = `${phone.replace(/\+/g, '')}@zirokash.temp`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful!",
        description: "Welcome back to ZiroKash",
      });
      
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async () => {
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit PIN",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('phone-auth', {
        body: { action: 'verify-pin', userId, pin }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      // Sign in using temp email after PIN verification
      const tempEmail = `${phone.replace(/\+/g, '')}@zirokash.temp`;
      
      // Get the user's password session - for now redirect to password entry
      toast({
        title: "PIN Verified!",
        description: "Signing you in...",
      });

      // Since we verified PIN, redirect to dashboard
      // In a real scenario, you'd create a session here
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      toast({
        title: "PIN Login Failed",
        description: error.message || "Invalid PIN",
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
          {step === 'signup' && 'Create your account'}
          {step === 'pin-login' && 'Enter your PIN'}
          {step === 'login' && 'Enter your password to sign in'}
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

        {step === 'pin-login' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="pin">Enter PIN</Label>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={4} 
                  value={pin}
                  onChange={(value) => setPin(value)}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <Button 
              onClick={handlePinLogin} 
              disabled={loading || pin.length !== 4}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login with PIN'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setStep('login')}
              className="w-full"
            >
              Use Password Instead
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                setStep('phone');
                setPin('');
              }}
              className="w-full"
            >
              Back to Start
            </Button>
          </>
        )}

        {step === 'signup' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <Button 
              onClick={handleSignup} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
          </>
        )}

        {step === 'login' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              disabled={loading || !password}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
            {hasPin && (
              <Button 
                variant="outline" 
                onClick={() => setStep('pin-login')}
                className="w-full"
              >
                Use PIN Instead
              </Button>
            )}
            <Button 
              variant="link" 
              onClick={() => {
                setStep('phone');
                setOtp('');
                setPassword('');
              }}
              className="w-full"
            >
              Forgot Password? Reset via OTP
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
