
import { Send, CreditCard, Wallet, Globe, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FormDialog } from "@/components/modals/FormDialogs";

export default function QuickActions() {
  const quickLinks = [
    { 
      icon: <Send size={20} />, 
      label: "Send", 
      link: "/payments",
      hasDialog: false
    },
    { 
      icon: <CreditCard size={20} />, 
      label: "Add Card", 
      link: null,
      hasDialog: true,
      dialogProps: {
        title: "Add New Card",
        description: "Enter your card details to add a new payment method",
        formType: "card"
      }
    },
    { 
      icon: <Wallet size={20} />, 
      label: "Deposit", 
      link: null,
      hasDialog: true,
      dialogProps: {
        title: "Deposit Funds",
        description: "Add funds to your account",
        formType: "deposit"
      }
    },
    { 
      icon: <Globe size={20} />, 
      label: "Forex", 
      link: "/wallet",
      hasDialog: false
    },
    { 
      icon: <Coins size={20} />, 
      label: "Invest", 
      link: null,
      hasDialog: true,
      dialogProps: {
        title: "New Investment",
        description: "Create a new investment plan",
        formType: "investment"
      }
    },
  ];

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {quickLinks.map((action, index) => {
            const buttonContent = (
              <div className="flex flex-col items-center gap-2 h-auto p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {action.icon}
                </div>
                <span className="text-xs">{action.label}</span>
              </div>
            );

            if (action.hasDialog && action.dialogProps) {
              return (
                <FormDialog
                  key={index}
                  trigger={<Button variant="ghost">{buttonContent}</Button>}
                  title={action.dialogProps.title}
                  description={action.dialogProps.description}
                  formType={action.dialogProps.formType as any}
                />
              );
            }

            return (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto p-2"
                asChild
              >
                <Link to={action.link || "#"}>{buttonContent}</Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
