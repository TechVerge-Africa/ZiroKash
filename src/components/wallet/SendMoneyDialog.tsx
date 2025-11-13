import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SendMoneyForm } from "@/components/payment/SendMoneyForm";

interface SendMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SendMoneyDialog({ open, onOpenChange, onSuccess }: SendMoneyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
        </DialogHeader>
        <SendMoneyForm 
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
