import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DepositDialog({ open, onOpenChange, onSuccess }: DepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        <PaymentMethodForm 
          type="deposit" 
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
