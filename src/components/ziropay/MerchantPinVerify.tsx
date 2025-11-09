import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Loader2 } from 'lucide-react';

interface PinVerifyProps {
  onVerified: () => void;
}

export function MerchantPinVerify({ onVerified }: PinVerifyProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async () => {
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
      
      const { data, error } = await supabase.functions.invoke('verify-pin', {
        body: { pin },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      if (data.verified) {
        toast({
          title: 'Access Granted',
          description: 'Welcome to ZiroPay!',
        });
        onVerified();
      }
    } catch (error: any) {
      console.error('PIN verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Incorrect PIN. Please try again.',
        variant: 'destructive'
      });
      setPin('');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handleSubmit();
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 mt-20">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Enter Your PIN</CardTitle>
          <CardDescription>
            Enter your 4-digit security PIN to access ZiroPay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Security PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyPress={handleKeyPress}
              maxLength={4}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={loading || pin.length !== 4}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Unlock ZiroPay'
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Your account will be locked for 30 minutes after 3 failed attempts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
