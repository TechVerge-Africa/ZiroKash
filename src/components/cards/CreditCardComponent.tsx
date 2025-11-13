import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Settings, 
  Wifi,
  Lock,
  Unlock,
  Copy,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreditCardProps {
  id: string;
  cardName: string;
  cardNumber: string;
  cardType: string;
  balance: number;
  creditLimit: number;
  expiryDate?: string;
  holderName?: string;
  isFrozen?: boolean;
  isActive?: boolean;
  className?: string;
  onFreeze?: (id: string) => void;
  onUnfreeze?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const cardTypeStyles = {
  visa: {
    gradient: "from-blue-600 via-blue-700 to-blue-900",
    accentColor: "text-blue-200",
    logo: "VISA"
  },
  mastercard: {
    gradient: "from-red-600 via-red-700 to-red-900", 
    accentColor: "text-red-200",
    logo: "Mastercard"
  },
  amex: {
    gradient: "from-green-600 via-green-700 to-green-900",
    accentColor: "text-green-200", 
    logo: "AMEX"
  },
  discover: {
    gradient: "from-purple-600 via-purple-700 to-purple-900",
    accentColor: "text-purple-200",
    logo: "Discover"
  }
};

export default function CreditCardComponent({
  id,
  cardName,
  cardNumber,
  cardType,
  balance,
  creditLimit,
  expiryDate = "06/26",
  holderName = "JOHN DOE",
  isFrozen = false,
  isActive = true,
  className,
  onFreeze,
  onUnfreeze,
  onViewDetails,
}: CreditCardProps) {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cardStyle = cardTypeStyles[cardType as keyof typeof cardTypeStyles] || cardTypeStyles.visa;
  const maskedNumber = `**** **** **** ${cardNumber.slice(-4)}`;
  const utilization = ((balance / creditLimit) * 100).toFixed(1);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(cardNumber);
    toast({
      title: "Card number copied",
      description: "Card number has been copied to clipboard",
    });
  };

  const handleFreeze = () => {
    if (isFrozen) {
      onUnfreeze?.(id);
      toast({
        title: "Card unfrozen",
        description: `${cardName} has been unfrozen`,
      });
    } else {
      onFreeze?.(id);
      toast({
        title: "Card frozen",
        description: `${cardName} has been frozen for security`,
      });
    }
  };

  return (
    <div className={cn("relative w-full max-w-sm mx-auto", className)}>
      {/* Card */}
      <div 
        className={cn(
          "relative w-full h-56 transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <Card className={cn(
          "absolute inset-0 w-full h-full overflow-hidden backface-hidden",
          "bg-gradient-to-br border-0 shadow-2xl",
          cardStyle.gradient,
          isFrozen && "opacity-60 grayscale"
        )}>
          <CardContent className="p-6 h-full flex flex-col justify-between text-white relative">
            {/* Card header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium opacity-90">{cardName}</h3>
                <Badge 
                  variant={isActive ? "default" : "destructive"} 
                  className="mt-1 text-xs bg-white/20 text-white border-white/30"
                >
                  {isFrozen ? "FROZEN" : isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => onViewDetails?.(id)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Card Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyNumber}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Number
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFreeze}>
                    {isFrozen ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                    {isFrozen ? "Unfreeze Card" : "Freeze Card"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* NFC indicator */}
            <div className="absolute top-6 right-16">
              <Wifi className="h-6 w-6 opacity-60" />
            </div>

            {/* Card number */}
            <div className="flex-1 flex items-center">
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xl tracking-wider">
                    {showFullNumber ? cardNumber : maskedNumber}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullNumber(!showFullNumber);
                    }}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    {showFullNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs opacity-75">CARD HOLDER</p>
                <p className="text-sm font-medium tracking-wider">{holderName}</p>
              </div>
              
              <div className="space-y-1 text-right">
                <p className="text-xs opacity-75">EXPIRES</p>
                <p className="text-sm font-medium">{expiryDate}</p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold opacity-90">{cardStyle.logo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className={cn(
          "absolute inset-0 w-full h-full overflow-hidden backface-hidden rotate-y-180",
          "bg-gradient-to-br border-0 shadow-2xl",
          cardStyle.gradient
        )}>
          <CardContent className="p-0 h-full text-white">
            {/* Magnetic stripe */}
            <div className="w-full h-12 bg-black mt-6"></div>
            
            <div className="p-6 space-y-4">
              {/* CVV */}
              <div className="bg-white text-black p-2 rounded text-right">
                <span className="font-mono">***</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <p>This card is property of ZiroKash. If found, please return to any ZiroKash branch or call customer service.</p>
                <p className="mt-4">Customer Service: +1-800-ZIROKASH</p>
              </div>
              
              <div className="flex justify-between items-end mt-8">
                <div>
                  <p className="text-xs opacity-75">AUTHORIZED SIGNATURE</p>
                  <div className="w-32 h-8 border-b border-white/50 mt-2"></div>
                </div>
                <p className="text-lg font-bold opacity-90">{cardStyle.logo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card stats */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Balance</span>
          <span className="font-medium">${balance.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Credit Limit</span>
          <span className="font-medium">${creditLimit.toLocaleString()}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Utilization</span>
            <span className={cn(
              "font-medium",
              parseFloat(utilization) > 80 ? "text-red-500" : 
              parseFloat(utilization) > 60 ? "text-yellow-500" : "text-green-500"
            )}>
              {utilization}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all",
                parseFloat(utilization) > 80 ? "bg-red-500" : 
                parseFloat(utilization) > 60 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${Math.min(parseFloat(utilization), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}