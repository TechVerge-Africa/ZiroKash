import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Shield, Lock } from "lucide-react";

export function MerchantPinSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const merchantId = location.state?.merchantId;
  
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [loading, setLoading] = useState(false);

  const handlePinComplete = async (value: string) => {
    if (step === "create") {
      setPin(value);
      setStep("confirm");
      setConfirmPin("");
    } else {
      setConfirmPin(value);
      
      if (value !== pin) {
        toast({
          title: "PINs Don't Match",
          description: "Please try again",
          variant: "destructive",
        });
        setStep("create");
        setPin("");
        setConfirmPin("");
        return;
      }

      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Hash and store PIN
        const encoder = new TextEncoder();
        const data = encoder.encode(value);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const pinHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const { error } = await supabase
          .from('user_pins')
          .upsert({
            user_id: user.id,
            pin_hash: pinHash,
          });

        if (error) throw error;

        toast({
          title: "PIN Setup Successful! 🎉",
          description: "Your ZiroPay account is now secure. You'll receive an email once your application is approved.",
        });

        navigate('/ziropay');
      } catch (error: any) {
        console.error('PIN setup error:', error);
        toast({
          title: "Setup Failed",
          description: error.message || "Failed to set up PIN",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
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
          <CardTitle className="text-2xl">
            {step === "create" ? "Create Your Security PIN" : "Confirm Your PIN"}
          </CardTitle>
          <CardDescription>
            {step === "create" 
              ? "Choose a 4-digit PIN to secure your ZiroPay merchant account"
              : "Re-enter your PIN to confirm"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={step === "create" ? pin : confirmPin}
              onChange={step === "create" ? setPin : setConfirmPin}
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

          {step === "confirm" && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep("create");
                setPin("");
                setConfirmPin("");
              }}
            >
              Start Over
            </Button>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-primary" />
              Security Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Choose a PIN you can remember but others can't guess</li>
              <li>✓ Don't use obvious numbers like 1234 or your birth year</li>
              <li>✓ Keep your PIN private and secure</li>
              <li>✓ You'll need this PIN to access merchant features</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
