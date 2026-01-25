import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, QrCode, Phone, Mail, CheckCircle2 } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useWallet } from "@/hooks/useWallet";
import { useLookup } from "@/hooks/useLookup";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const sendMoneySchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  recipient: z.string().min(1, "Recipient is required"),
  fromWallet: z.string().min(1, "Please select a wallet"),
  description: z.string().optional(),
});

interface SendMoneyFormProps {
  onSuccess?: () => void;
}

export function SendMoneyForm({ onSuccess }: SendMoneyFormProps = {}) {
  const { wallets, getWalletByType } = useWallet();
  const { lookupRecipient, recipient, loading: lookupLoading } = useLookup();
  const [isLoading, setIsLoading] = useState(false);
  const [sendMethod, setSendMethod] = useState<"address" | "phone" | "email" | "qr">("phone");

  const form = useForm<z.infer<typeof sendMoneySchema>>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      amount: "",
      recipient: "",
      fromWallet: "main",
      description: "",
    },
  });

  // Debounced recipient lookup
  useEffect(() => {
    const timer = setTimeout(() => {
      const recipientValue = form.watch('recipient');
      if (recipientValue && recipientValue.length > 3 && (sendMethod === 'phone' || sendMethod === 'email')) {
        lookupRecipient(recipientValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.watch('recipient'), sendMethod]);

  const onSubmit = async (values: z.infer<typeof sendMoneySchema>) => {
    setIsLoading(true);
    try {
      const amount = Number(values.amount);
      const wallet = getWalletByType(values.fromWallet as any);
      
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      
      // Convert wallet balance from cents to dollars for comparison
      const walletBalanceInDollars = wallet.balance / 100;
      if (walletBalanceInDollars < amount) {
        throw new Error(`Insufficient balance. Available: $${walletBalanceInDollars.toFixed(2)}`);
      }

      // If recipient is a ZiroKash user, use wallet-transfer
      if (recipient?.is_zirokash_user) {
        const { error } = await supabase.functions.invoke('wallet-transfer', {
          body: {
            recipient_user_id: recipient.user_id,
            amount: Math.round(amount * 100), // Convert to cents
            description: values.description || `Transfer to ${recipient.full_name}`,
            currency: wallet.currency
          }
        });

        if (error) throw error;

        toast({
          title: "Transfer Successful",
          description: `$${amount.toFixed(2)} sent to ${recipient.full_name}`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // External transfer (blockchain or other methods)
        toast({
          title: "External Transfer",
          description: "External transfers will be implemented soon",
          variant: "destructive"
        });
        return;
      }

      form.reset();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Money
        </CardTitle>
        <CardDescription>
          Send money to anyone using multiple methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fromWallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Wallet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.wallet_type}>
                          {wallet.wallet_type.charAt(0).toUpperCase() + wallet.wallet_type.slice(1)} - 
                          ${(wallet.balance / 100).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Send To</FormLabel>
              <Tabs value={sendMethod} onValueChange={(value) => setSendMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="address" className="flex items-center gap-1">
                    <Send className="h-3 w-3" />
                    Address
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    QR
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="address" className="mt-2">
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter wallet address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="phone" className="mt-2">
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            <Input placeholder="Enter phone number" {...field} />
                            {lookupLoading && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Loader variant="dots" size="sm" className="mr-2" />
                                Looking up recipient...
                              </p>
                            )}
                            {recipient && (
                              <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">{recipient.full_name}</span>
                                <Badge variant="secondary" className="ml-auto">ZiroKash User</Badge>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="email" className="mt-2">
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="qr" className="mt-2">
                  <div className="text-center p-4 border-2 border-dashed border-muted-foreground rounded-lg">
                    <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Tap to scan QR code</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        toast({
                          title: "QR Scanner",
                          description: "QR code scanner would open here",
                        });
                      }}
                    >
                      Open Scanner
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input placeholder="0.00" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="What's this payment for?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader variant="dots" size="sm" className="mr-2" />}
              Send Payment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}