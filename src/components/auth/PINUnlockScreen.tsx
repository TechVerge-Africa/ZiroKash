import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Lock, LogOut, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PINUnlockScreenProps {
  onUnlock: () => void;
}

export function PINUnlockScreen({ onUnlock }: PINUnlockScreenProps) {
  const { user, signOut } = useAuth();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUnlock = async (enteredPin: string) => {
    if (enteredPin.length < 4) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pin_code')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if ((data as any).pin_code === enteredPin) {
        onUnlock();
      } else {
        setPin("");
        setErrorCount(prev => prev + 1);
        toast({
          title: "Incorrect PIN",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-md px-6 text-center space-y-8">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-secondary flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary/20 rotate-3 transform mb-8">
            Z
          </div>
          <h1 className="text-3xl font-black tracking-tight gradient-text mb-2">ZiroPay</h1>
          <p className="text-muted-foreground">Session Locked • Enter PIN to continue</p>
        </div>

        <div className="p-8 rounded-3xl glass-card border-white/10 space-y-6">
          <div className="flex justify-center flex-col items-center space-y-6">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            
            <InputOTP 
              maxLength={4} 
              value={pin} 
              onChange={(val) => {
                setPin(val);
                if (val.length === 4) handleUnlock(val);
              }}
              autoFocus
              disabled={isVerifying}
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot index={0} className="w-14 h-16 text-2xl border-white/20 focus:ring-primary shadow-inner" />
                <InputOTPSlot index={1} className="w-14 h-16 text-2xl border-white/20 focus:ring-primary shadow-inner" />
                <InputOTPSlot index={2} className="w-14 h-16 text-2xl border-white/20 focus:ring-primary shadow-inner" />
                <InputOTPSlot index={3} className="w-14 h-16 text-2xl border-white/20 focus:ring-primary shadow-inner" />
              </InputOTPGroup>
            </InputOTP>

            {isVerifying && (
              <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </div>
            )}
            
            {errorCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive animate-bounce">
                <ShieldAlert className="h-4 w-4" />
                Invalid PIN. {errorCount} failed attempts.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out & Switch Account
          </Button>
          <p className="text-xs text-muted-foreground">
            © 2025 ZiroPay. Accra, Ghana.
          </p>
        </div>
      </div>
    </div>
  );
}
