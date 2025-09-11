
import { PiggyBank, Plus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SavingsCardProps {
  totalSavings: number;
  targetAmount: number;
  savingsName: string;
}

export default function SavingsCard({ totalSavings, targetAmount, savingsName }: SavingsCardProps) {
  const progressPercentage = Math.min(100, (totalSavings / targetAmount) * 100);
  
  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-md font-medium">Savings Goal</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
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
            
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
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
