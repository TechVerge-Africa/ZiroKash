
import { PiggyBank, Plus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SavingsCardProps {
  totalSavings: number;
  targetAmount: number;
  savingsName: string;
}

export default function SavingsCard({ totalSavings, targetAmount, savingsName }: SavingsCardProps) {
  const progressPercentage = Math.min(100, (totalSavings / targetAmount) * 100);
  
  return (
    <Card className={cn(
        "overflow-hidden transition-all duration-200",
        "dark:glass-card dark:border-white/10",
        "bg-white border-border/50 shadow-sm", // Light mode styles
        "hover:shadow-md hover:border-primary/20" // Interactive hover effect
      )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-md font-medium">Savings Goal</CardTitle>
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "bg-primary/10 dark:bg-primary/10",
          "text-primary dark:text-primary",
          "border border-primary/20 dark:border-transparent" // Light mode border
        )}>
          <PiggyBank size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">{savingsName}</p>
            <div className="flex items-baseline mb-1 mt-2">
              <span className="text-2xl font-bold mr-2">${totalSavings.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/ ${targetAmount.toLocaleString()}</span>
            </div>
            
            <div className={cn(
              "h-2 w-full rounded-full overflow-hidden mt-2",
              "bg-muted/50 dark:bg-white/10", // Light mode background
              "border border-border/50 dark:border-transparent" // Light mode border
            )}>
              <div 
                className={cn(
                  "h-full bg-primary rounded-full",
                  "transition-all duration-500 ease-in-out",
                  "shadow-sm" // Added depth to progress bar
                )}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button className="flex-1" asChild>
              <Link to="/wallet">
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </Link>
            </Button>
            
            <Button variant="outline" className="flex-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
