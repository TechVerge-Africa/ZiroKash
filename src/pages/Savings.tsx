import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Plus, TrendingUp, Shield, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Savings() {
  const [selectedType, setSelectedType] = useState<string>("");

  const savingsPlans = [
    {
      id: '1',
      name: 'Emergency Fund',
      type: 'emergency',
      current: 1500,
      target: 5000,
      icon: Shield,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      id: '2',
      name: 'Business Growth',
      type: 'personal',
      current: 3200,
      target: 10000,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: '3',
      name: 'Community Susu',
      type: 'susu',
      current: 800,
      target: 2000,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const handleCreateSavingsPlan = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Savings plan created successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Savings</h1>
          <p className="text-muted-foreground mt-2">Build your future, one cedi at a time</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Plan</DialogTitle>
              <DialogDescription>
                Choose the type of savings plan that fits your goals
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSavingsPlan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-type">Plan Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="plan-type">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="personal">Personal Savings</SelectItem>
                    <SelectItem value="susu">Online Susu (Community)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input id="plan-name" placeholder="e.g., Wedding Fund" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount (₵)</Label>
                <Input id="target-amount" type="number" placeholder="10000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-contribution">Monthly Contribution (₵)</Label>
                <Input id="monthly-contribution" type="number" placeholder="500" />
              </div>

              {selectedType === 'susu' && (
                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">About Susu</h4>
                  <p className="text-xs text-muted-foreground">
                    Join a trusted community savings group. Members contribute regularly and take turns receiving the pooled amount.
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full">
                Create Savings Plan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Savings Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵5,500</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              All on track
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Goal</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵17,000</div>
            <p className="text-xs text-muted-foreground">
              32% achieved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savingsPlans.map((plan) => {
          const Icon = plan.icon;
          const progress = (plan.current / plan.target) * 100;
          
          return (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${plan.bgColor}`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {plan.type}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{plan.name}</CardTitle>
                <CardDescription>
                  ₵{plan.current.toLocaleString()} of ₵{plan.target.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
                  <Button variant="ghost" size="sm">
                    Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-secondary/50 bg-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              What is Susu?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Susu is a traditional Ghanaian savings method where groups contribute regularly. 
              Each member takes turns receiving the pooled amount, helping everyone save consistently.
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Learn More
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Emergency Fund Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Financial experts recommend saving 3-6 months of expenses. 
              Start small and increase contributions as your income grows.
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
