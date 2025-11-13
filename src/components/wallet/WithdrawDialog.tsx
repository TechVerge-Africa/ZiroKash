import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WithdrawDialog({ open, onOpenChange, onSuccess }: WithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        <PaymentMethodForm 
          type="withdraw" 
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
