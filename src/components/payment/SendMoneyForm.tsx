import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, QrCode } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

const sendMoneySchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  fromWallet: z.string().min(1, "Please select a wallet"),
  description: z.string().optional(),
});

export function SendMoneyForm() {
  const { wallets, createTransaction, updateWalletBalance, getWalletByType } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof sendMoneySchema>>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      amount: "",
      recipientAddress: "",
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
        values.recipientAddress,
        values.description
      );

      // Update wallet balance
      await updateWalletBalance(values.fromWallet, wallet.balance - amount);

      toast({
        title: "Payment Sent Successfully",
        description: `$${amount} has been sent to ${values.recipientAddress}`,
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
          Send cryptocurrency or digital assets instantly
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

            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter wallet address or email" 
                        {...field} 
                      />
                      <Button type="button" size="icon" variant="outline">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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