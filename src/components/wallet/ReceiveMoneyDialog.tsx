import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReceiveMoneyCard } from "@/components/payment/ReceiveMoneyCard";

interface ReceiveMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiveMoneyDialog({ open, onOpenChange }: ReceiveMoneyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Money</DialogTitle>
        </DialogHeader>
        <ReceiveMoneyCard />
      </DialogContent>
    </Dialog>
  );
}
