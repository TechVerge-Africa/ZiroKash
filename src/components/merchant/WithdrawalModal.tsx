
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMerchant } from "@/hooks/useMerchant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const { withdrawToMobileMoney, loading: merchantLoading } = useMerchant();
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || !provider || !phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    setLoading(true);
    try {
      await withdrawToMobileMoney({
        amount: numAmount,
        provider,
        phoneNumber,
        currency: "GHS"
      });
      // Success toast handled in hook
      onClose();
      setAmount("");
      setProvider("");
      setPhoneNumber("");
    } catch (error) {
      // Error toast handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Transfer your earnings to your Mobile Money wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Amount (GHS)</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mobile Money Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                <SelectItem value="tigo">AirtelTigo Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              placeholder="024xxxxxxx" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <Button onClick={handleWithdraw} className="w-full" disabled={loading || merchantLoading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Withdraw Funds
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
