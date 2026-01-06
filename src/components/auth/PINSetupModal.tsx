import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface PINSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PINSetupModal({ isOpen, onClose, onSuccess }: PINSetupModalProps) {
  const { user } = useAuth();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (pin.length < 4) return;
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("enter");
    setConfirmPin("");
  };


  const handleSavePin = async () => {
    if (pin !== confirmPin) {
      toast({
        title: "Error",
        description: "PINs do not match. Please try again.",
        variant: "destructive",
      });
      handleBack();
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.rpc('set_user_pin', { 
        p_pin: pin
      });

      if (error) throw error;

      toast({
        title: "PIN Set Successfully",
        description: "You can now use your PIN for quick access.",
      });
      onSuccess();
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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md glass-card border-white/10">
        <DialogHeader className="items-center text-center">
          <img 
            src="/zirokash-logo.png" 
            alt="ZiroKash Logo" 
            className="h-16 w-auto mb-4"
          />
          <DialogTitle className="text-2xl font-bold">
            {step === "enter" ? "Set Security PIN" : "Confirm Security PIN"}
          </DialogTitle>
          <DialogDescription>
            {step === "enter" 
              ? "Create a 4-digit PIN for quick and secure access to your ZiroKash account."
              : "Please re-enter your PIN to confirm."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <InputOTP 
            maxLength={4} 
            value={step === "enter" ? pin : confirmPin}
            onChange={(val) => step === "enter" ? setPin(val) : setConfirmPin(val)}
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-12 h-14 text-xl border-white/20 focus:ring-primary" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl border-white/20 focus:ring-primary" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl border-white/20 focus:ring-primary" />
              <InputOTPSlot index={3} className="w-12 h-14 text-xl border-white/20 focus:ring-primary" />
            </InputOTPGroup>
          </InputOTP>

          {step === "enter" ? (
            <p className="text-sm text-muted-foreground">
              A PIN makes it easier to log in on this device.
            </p>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                Go Back
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          {step === "enter" ? (
            <Button onClick={handleNext} disabled={pin.length < 4 || loading}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSavePin} disabled={confirmPin.length < 4 || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save PIN
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
