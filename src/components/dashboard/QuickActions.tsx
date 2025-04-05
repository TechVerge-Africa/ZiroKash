
import { Send, CreditCard, Wallet, Globe, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions() {
  const actions = [
    { icon: <Send size={20} />, label: "Send" },
    { icon: <CreditCard size={20} />, label: "Pay" },
    { icon: <Wallet size={20} />, label: "Deposit" },
    { icon: <Globe size={20} />, label: "Forex" },
    { icon: <Coins size={20} />, label: "Crypto" },
  ];

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto p-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
