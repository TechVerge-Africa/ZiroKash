import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone } from "lucide-react";
import { useDeposit } from "@/hooks/useDeposit";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodFormProps {
  type: 'deposit' | 'withdraw';
  onSuccess?: () => void;
}

export function PaymentMethodForm({ type, onSuccess }: PaymentMethodFormProps) {
  const [amount, setAmount] = useState("");
  const { depositMomo, depositBank, loading: depositLoading } = useDeposit();
  const { withdrawMomo, withdrawBank, loading: withdrawLoading } = useWithdraw();
  const { userCurrency } = useCurrency();
  const { toast } = useToast();
  
  const loading = depositLoading || withdrawLoading;

  const BankForm = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [bankCode, setBankCode] = useState("");

    const handleBankSubmit = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      try {
        if (type === 'deposit') {
          const { error } = await depositBank({
            amount: parseFloat(amount),
            currency: userCurrency,
          });
          
          if (error) throw error;
        } else {
          if (!accountNumber || !accountName || !bankCode) {
            toast({
              title: "Missing information",
              description: "Please fill in all bank details",
              variant: "destructive",
            });
            return;
          }

          const { error } = await withdrawBank({
            amount: parseFloat(amount),
            currency: userCurrency,
            bankCode,
            accountNumber,
            accountName,
          });
          
          if (error) throw error;
        }

        toast({
          title: "Success",
          description: type === 'deposit' 
            ? "Deposit initiated successfully" 
            : "Withdrawal initiated successfully",
        });
        
        setAmount("");
        setAccountNumber("");
        setAccountName("");
        setBankCode("");
        onSuccess?.();
      } catch (error: any) {
        toast({
          title: "Transaction failed",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="space-y-4">
        {type === 'withdraw' && (
          <>
            <div>
              <Label htmlFor="bankCode">Bank Code</Label>
              <Input
                id="bankCode"
                placeholder="Enter bank code"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="Enter account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
          </>
        )}
        <Button 
          onClick={handleBankSubmit}
          disabled={loading || !amount}
          className="w-full"
        >
          {loading ? 'Processing...' : `${type === 'deposit' ? 'Deposit' : 'Withdraw'} ${amount}`}
        </Button>
      </div>
    );
  };

  const MomoForm = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [provider, setProvider] = useState("");

    const handleMomoSubmit = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      if (!phoneNumber || !provider) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      try {
        if (type === 'deposit') {
          const { error } = await depositMomo({
            amount: parseFloat(amount),
            phoneNumber,
            provider,
            currency: userCurrency,
          });
          
          if (error) throw error;
        } else {
          const { error } = await withdrawMomo({
            amount: parseFloat(amount),
            phoneNumber,
            provider,
            currency: userCurrency,
          });
          
          if (error) throw error;
        }

        toast({
          title: "Success",
          description: type === 'deposit' 
            ? "Deposit initiated successfully" 
            : "Withdrawal initiated successfully",
        });
        
        setAmount("");
        setPhoneNumber("");
        setProvider("");
        onSuccess?.();
      } catch (error: any) {
        toast({
          title: "Transaction failed",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="provider">Mobile Money Provider</Label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtn">MTN Mobile Money</SelectItem>
              <SelectItem value="vodafone">Vodafone Cash</SelectItem>
              <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleMomoSubmit}
          disabled={loading || !phoneNumber || !provider}
          className="w-full"
        >
          {loading ? 'Processing...' : `${type === 'deposit' ? 'Deposit' : 'Withdraw'} ${amount}`}
        </Button>
      </div>
    );
  };


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Tabs defaultValue="momo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="momo">
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile Money
              </TabsTrigger>
              <TabsTrigger value="bank">
                <CreditCard className="mr-2 h-4 w-4" />
                Bank
              </TabsTrigger>
            </TabsList>

            <TabsContent value="momo">
              <MomoForm />
            </TabsContent>

            <TabsContent value="bank">
              <BankForm />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}