
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { CardForm } from "@/components/forms/CardForm";
import { InvestmentForm } from "@/components/forms/InvestmentForm";
import { CreditApplicationForm } from "@/components/forms/CreditApplicationForm";
import { SavingsPlanForm } from "@/components/forms/SavingsPlanForm";

interface FormDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  formType: "deposit" | "withdraw" | "card" | "investment" | "credit" | "savings";
}

export function FormDialog({
  trigger,
  title,
  description,
  formType,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {formType === "deposit" && <PaymentForm type="deposit" onClose={() => setOpen(false)} />}
          {formType === "withdraw" && <PaymentForm type="withdraw" onClose={() => setOpen(false)} />}
          {formType === "card" && <CardForm onClose={() => setOpen(false)} />}
          {formType === "investment" && <InvestmentForm onClose={() => setOpen(false)} />}
          {formType === "credit" && <CreditApplicationForm onClose={() => setOpen(false)} />}
          {formType === "savings" && <SavingsPlanForm onClose={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {formType === "deposit" && <PaymentForm type="deposit" onClose={() => setOpen(false)} />}
          {formType === "withdraw" && <PaymentForm type="withdraw" onClose={() => setOpen(false)} />}
          {formType === "card" && <CardForm onClose={() => setOpen(false)} />}
          {formType === "investment" && <InvestmentForm onClose={() => setOpen(false)} />}
          {formType === "credit" && <CreditApplicationForm onClose={() => setOpen(false)} />}
          {formType === "savings" && <SavingsPlanForm onClose={() => setOpen(false)} />}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
