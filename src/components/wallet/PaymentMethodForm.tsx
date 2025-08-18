import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Bitcoin, DollarSign } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodFormProps {
  type: 'deposit' | 'withdraw';
  onSuccess?: () => void;
}

export function PaymentMethodForm({ type, onSuccess }: PaymentMethodFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { createTransaction, updateWalletBalance, getWalletByType } = useWallet();
  const { toast } = useToast();

  const handleSubmit = async (method: string, formData: any) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transactionAmount = parseFloat(amount);
      const mainWallet = getWalletByType('main');
      
      if (type === 'withdraw' && mainWallet && mainWallet.balance < transactionAmount) {
        toast({
          title: "Insufficient funds",
          description: "You don't have enough balance for this withdrawal",
          variant: "destructive",
        });
        return;
      }

      // Create transaction record
      await createTransaction(
        type === 'deposit' ? 'deposit' : 'withdraw',
        transactionAmount,
        formData.address || formData.accountNumber,
        `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} via ${method}`
      );

      // Update wallet balance
      if (mainWallet) {
        const newBalance = type === 'deposit' 
          ? mainWallet.balance + transactionAmount
          : mainWallet.balance - transactionAmount;
        
        await updateWalletBalance('main', newBalance);
      }

      toast({
        title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful`,
        description: `$${amount} has been ${type === 'deposit' ? 'added to' : 'withdrawn from'} your wallet`,
      });

      setAmount("");
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const BankForm = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [bankName, setBankName] = useState("");

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Select value={bankName} onValueChange={setBankName}>
            <SelectTrigger>
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chase">Chase Bank</SelectItem>
              <SelectItem value="wells-fargo">Wells Fargo</SelectItem>
              <SelectItem value="bank-of-america">Bank of America</SelectItem>
              <SelectItem value="citibank">Citibank</SelectItem>
            </SelectContent>
          </Select>
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
        <Button 
          onClick={() => handleSubmit('Bank Account', { accountNumber, bankName })}
          disabled={loading || !accountNumber || !bankName}
          className="w-full"
        >
          {loading ? 'Processing...' : `${type === 'deposit' ? 'Deposit' : 'Withdraw'} $${amount}`}
        </Button>
      </div>
    );
  };

  const MomoForm = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [provider, setProvider] = useState("");

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
              <SelectItem value="airtel">Airtel Money</SelectItem>
              <SelectItem value="tigo">Tigo Cash</SelectItem>
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
          onClick={() => handleSubmit('Mobile Money', { phoneNumber, provider })}
          disabled={loading || !phoneNumber || !provider}
          className="w-full"
        >
          {loading ? 'Processing...' : `${type === 'deposit' ? 'Deposit' : 'Withdraw'} $${amount}`}
        </Button>
      </div>
    );
  };

  const CryptoForm = () => {
    const [address, setAddress] = useState("");
    const [currency, setCurrency] = useState("");

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="currency">Cryptocurrency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
              <SelectItem value="eth">Ethereum (ETH)</SelectItem>
              <SelectItem value="usdt">Tether (USDT)</SelectItem>
              <SelectItem value="sol">Solana (SOL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address">Wallet Address</Label>
          <Input
            id="address"
            placeholder="Enter wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleSubmit('Cryptocurrency', { address, currency })}
          disabled={loading || !address || !currency}
          className="w-full"
        >
          {loading ? 'Processing...' : `${type === 'deposit' ? 'Deposit' : 'Withdraw'} $${amount}`}
        </Button>
      </div>
    );
  };

  const ForexForm = () => {
    const [fromCurrency, setFromCurrency] = useState("");
    const [toCurrency, setToCurrency] = useState("USD");

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="fromCurrency">From Currency</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eur">Euro (EUR)</SelectItem>
              <SelectItem value="gbp">British Pound (GBP)</SelectItem>
              <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
              <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="toCurrency">To Currency</Label>
          <Input
            id="toCurrency"
            value="USD"
            disabled
          />
        </div>
        <Button 
          onClick={() => handleSubmit('Forex Exchange', { fromCurrency, toCurrency })}
          disabled={loading || !fromCurrency}
          className="w-full"
        >
          {loading ? 'Processing...' : `Exchange to $${amount} USD`}
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

          <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bank">
                <CreditCard className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="momo">
                <Smartphone className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="crypto">
                <Bitcoin className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="forex">
                <DollarSign className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank">
              <BankForm />
            </TabsContent>

            <TabsContent value="momo">
              <MomoForm />
            </TabsContent>

            <TabsContent value="crypto">
              <CryptoForm />
            </TabsContent>

            <TabsContent value="forex">
              <ForexForm />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}