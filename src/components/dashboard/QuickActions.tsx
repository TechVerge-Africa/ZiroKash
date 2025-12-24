
import { DollarSign, Receipt, Link2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function QuickActions() {
  const isMobile = useIsMobile();
  
  const quickLinks = [
    { 
      icon: <DollarSign size={20} />, 
      label: "Create Form", 
      link: "/ziropay"
    },
    { 
      icon: <Receipt size={20} />, 
      label: "Transactions", 
      link: "/transactions"
    },
    { 
      icon: <Link2 size={20} />, 
      label: "My Forms", 
      link: "/ziropay"
    },
    { 
      icon: <Eye size={20} />, 
      label: "Analytics", 
      link: "/ziropay"
    },
  ];

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${isMobile ? 'grid-cols-3' : 'flex justify-between'} gap-2`}>
          {quickLinks.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto p-2"
              asChild
            >
              <Link to={action.link}>
                <div className="flex flex-col items-center gap-2 h-auto p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {action.icon}
                  </div>
                  <span className="text-xs">{action.label}</span>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
