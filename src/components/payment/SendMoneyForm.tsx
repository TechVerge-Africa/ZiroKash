import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Loader2, QrCode, Phone, Mail } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

const sendMoneySchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  recipient: z.string().min(1, "Recipient is required"),
  fromWallet: z.string().min(1, "Please select a wallet"),
  description: z.string().optional(),
});

export function SendMoneyForm() {
  const { wallets, createTransaction, updateWalletBalance, getWalletByType } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [sendMethod, setSendMethod] = useState<"address" | "phone" | "email" | "qr">("address");

  const form = useForm<z.infer<typeof sendMoneySchema>>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      amount: "",
      recipient: "",
      fromWallet: "main",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sendMoneySchema>) => {
    setIsLoading(true);
    try {
      const amount = Number(values.amount);
      const wallet = getWalletByType(values.fromWallet as any);
      
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      
      if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Create transaction
      await createTransaction(
        'send',
        amount,
        values.recipient,
        values.description
      );

      // Update wallet balance
      await updateWalletBalance(values.fromWallet, wallet.balance - amount);

      const recipientLabel = sendMethod === "phone" ? "phone number" : 
                           sendMethod === "email" ? "email" : 
                           sendMethod === "qr" ? "QR code" : "address";

      toast({
        title: "Payment Sent Successfully",
        description: `$${amount} has been sent to ${recipientLabel}: ${values.recipient}`,
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
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
                          ${wallet.balance.toFixed(2)}
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
                          <Input placeholder="Enter phone number" {...field} />
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Payment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}