import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

interface MerchantPinVerifyProps {
  onVerified: () => void;
}

export function MerchantPinVerify({ onVerified }: MerchantPinVerifyProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinComplete = async (value: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Hash entered PIN
      const encoder = new TextEncoder();
      const data = encoder.encode(value);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const pinHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Verify PIN
      const { data: userPin, error } = await supabase
        .from('user_pins')
        .select('pin_hash, failed_attempts, locked_until')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Check if account is locked
      if (userPin.locked_until && new Date(userPin.locked_until) > new Date()) {
        toast({
          title: "Account Locked",
          description: "Too many failed attempts. Please try again later.",
          variant: "destructive",
        });
        setPin("");
        setLoading(false);
        return;
      }

      if (userPin.pin_hash === pinHash) {
        // Reset failed attempts on success
        await supabase
          .from('user_pins')
          .update({ failed_attempts: 0, locked_until: null })
          .eq('user_id', user.id);

        toast({
          title: "Access Granted",
          description: "Welcome to your ZiroPay merchant dashboard",
        });
        onVerified();
      } else {
        // Increment failed attempts
        const newFailedAttempts = (userPin.failed_attempts || 0) + 1;
        const updates: any = { failed_attempts: newFailedAttempts };

        // Lock account after 5 failed attempts
        if (newFailedAttempts >= 5) {
          const lockUntil = new Date();
          lockUntil.setMinutes(lockUntil.getMinutes() + 30);
          updates.locked_until = lockUntil.toISOString();
        }

        await supabase
          .from('user_pins')
          .update(updates)
          .eq('user_id', user.id);

        toast({
          title: "Incorrect PIN",
          description: `${5 - newFailedAttempts} attempts remaining`,
          variant: "destructive",
        });
        setPin("");
      }
    } catch (error: any) {
      console.error('PIN verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify PIN",
        variant: "destructive",
      });
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Enter Your Security PIN</CardTitle>
          <CardDescription>
            Enter your 4-digit PIN to access ZiroPay merchant features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={setPin}
              onComplete={handlePinComplete}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            variant="link"
            className="w-full text-sm"
            onClick={() => {
              toast({
                title: "Contact Support",
                description: "Please contact support to reset your PIN",
              });
            }}
          >
            Forgot PIN?
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
