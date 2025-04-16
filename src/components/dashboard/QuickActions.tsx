
import { Send, CreditCard, Wallet, Globe, Coins, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FormDialog } from "@/components/modals/FormDialogs";
import { useIsMobile } from "@/hooks/use-mobile";

export default function QuickActions() {
  const isMobile = useIsMobile();
  
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
      icon: <PiggyBank size={20} />, 
      label: "Save", 
      link: null,
      hasDialog: true,
      dialogProps: {
        title: "Start Saving",
        description: "Create a new savings plan",
        formType: "deposit"
      }
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
        <div className={`grid ${isMobile ? 'grid-cols-3' : 'flex justify-between'} gap-2`}>
          {quickLinks.map((action, index) => {
            const buttonContent = (
              <div className="flex flex-col items-center gap-2 h-auto p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {action.icon}
                </div>
                <span className="text-xs">{action.label}</span>
              </div>
            );

            const actionButton = (
              <Button 
                key={index}
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto p-2"
              >
                {buttonContent}
              </Button>
            );

            if (action.hasDialog && action.dialogProps) {
              return (
                <FormDialog
                  key={index}
                  trigger={actionButton}
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
