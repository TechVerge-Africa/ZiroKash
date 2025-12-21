import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useMerchant } from "@/hooks/useMerchant";
import { toast } from "sonner";
import { Loader2, Smartphone, Building2 } from "lucide-react";

interface WithdrawalFormProps {
  onSuccess?: () => void;
}

const MOMO_PROVIDERS = [
  { code: 'MTN', name: 'MTN Mobile Money' },
  { code: 'VOD', name: 'Vodafone Cash' },
  { code: 'ATL', name: 'AirtelTigo Money' },
];

export function WithdrawalForm({ onSuccess }: WithdrawalFormProps) {
  const { merchant, banks, loadingBanks, fetchBanks } = useMerchant();
  const [method, setMethod] = useState<'momo' | 'bank'>('momo');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // MoMo fields
  const [momoProvider, setMomoProvider] = useState('');
  const [momoNumber, setMomoNumber] = useState('');

  // Bank fields
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [useSavedBank, setUseSavedBank] = useState(true);

  useEffect(() => {
    if (method === 'bank' && banks.length === 0) {
      fetchBanks();
    }
  }, [method]);

  useEffect(() => {
    if (merchant && useSavedBank) {
      setBankCode(merchant.settlement_bank_code || '');
      setAccountNumber(merchant.settlement_account_number || '');
      setAccountName(merchant.settlement_account_name || '');
    }
  }, [merchant, useSavedBank]);

  const handleSubmit = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 1) {
      toast.error('Please enter a valid amount (minimum GHS 1)');
      return;
    }

    setSubmitting(true);
    try {
      if (method === 'momo') {
        if (!momoProvider || !momoNumber) {
          toast.error('Please fill in all MoMo details');
          setSubmitting(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('withdraw-momo', {
          body: {
            amount: amountNum,
            phone: momoNumber,
            provider: momoProvider,
            reason: 'Merchant withdrawal',
          }
        });

        if (error) throw error;
        toast.success('MoMo withdrawal initiated successfully');
      } else {
        if (!bankCode || !accountNumber) {
          toast.error('Please fill in all bank details');
          setSubmitting(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('withdraw-bank', {
          body: {
            amount: amountNum,
            accountNumber,
            bankCode,
            accountName: accountName || 'Merchant',
            reason: 'Merchant withdrawal',
          }
        });

        if (error) throw error;
        toast.success('Bank transfer initiated successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast.error(error.message || 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Withdrawal Method</Label>
        <RadioGroup
          value={method}
          onValueChange={(value) => setMethod(value as 'momo' | 'bank')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="momo" id="momo" />
            <Label htmlFor="momo" className="flex items-center gap-2 cursor-pointer">
              <Smartphone className="h-4 w-4" />
              Mobile Money
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
              <Building2 className="h-4 w-4" />
              Bank Transfer
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (GHS)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
        />
      </div>

      {method === 'momo' ? (
        <>
          <div className="space-y-2">
            <Label>Mobile Money Provider</Label>
            <Select value={momoProvider} onValueChange={setMomoProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {MOMO_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.code} value={provider.code}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="momoNumber">Phone Number</Label>
            <Input
              id="momoNumber"
              placeholder="0XX XXX XXXX"
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
            />
          </div>
        </>
      ) : (
        <>
          {merchant?.settlement_bank_code && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useSaved"
                checked={useSavedBank}
                onChange={(e) => setUseSavedBank(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="useSaved" className="cursor-pointer">
                Use saved bank account ({merchant.settlement_account_name})
              </Label>
            </div>
          )}
          
          {!useSavedBank && (
            <>
              <div className="space-y-2">
                <Label>Bank</Label>
                <Select value={bankCode} onValueChange={setBankCode}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingBanks ? "Loading..." : "Select bank"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  placeholder="Account holder name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
            </>
          )}
        </>
      )}

      <Button onClick={handleSubmit} disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Withdraw {amount ? `GHS ${amount}` : ''}
      </Button>
    </div>
  );
}
