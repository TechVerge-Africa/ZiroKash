
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface CryptoCardProps {
  icon: React.ReactNode;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  change: number;
  className?: string;
}

export default function CryptoCard({
  icon,
  name,
  symbol,
  balance,
  value,
  change,
  className,
}: CryptoCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-all cursor-pointer glass-card border-white/10", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            {icon}
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-medium">${value.toLocaleString()}</p>
            <div className="flex items-center justify-end">
              <span className={cn(
                "text-xs",
                isPositive ? "text-green-500" : "text-red-500"
              )}>
                {isPositive ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
                {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Balance: {balance} {symbol}
        </div>
      </CardContent>
    </Card>
  );
}
