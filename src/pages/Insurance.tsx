import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Heart, 
  Car, 
  Home, 
  Plane, 
  FileText, 
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

export default function Insurance() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const insurancePlans = [
    {
      id: "health",
      name: "Health Insurance",
      icon: Heart,
      price: "$29/month",
      coverage: "Up to $50,000",
      features: ["Medical expenses", "Emergency care", "Prescription drugs", "Dental coverage"],
      color: "text-red-500"
    },
    {
      id: "travel",
      name: "Travel Insurance",
      icon: Plane,
      price: "$15/month",
      coverage: "Up to $25,000",
      features: ["Trip cancellation", "Medical emergencies", "Lost luggage", "Flight delays"],
      color: "text-blue-500"
    },
    {
      id: "device",
      name: "Device Protection",
      icon: Shield,
      price: "$9/month",
      coverage: "Up to $2,000",
      features: ["Screen damage", "Water damage", "Theft protection", "Extended warranty"],
      color: "text-green-500"
    }
  ];

  const activePolicies = [
    {
      id: "1",
      name: "Device Protection Plan",
      status: "Active",
      premium: "$9/month",
      coverage: "$2,000",
      nextPayment: "2024-02-15"
    }
  ];

  const recentClaims = [
    {
      id: "CLM001",
      type: "Device Protection",
      amount: "$450",
      status: "Approved",
      date: "2024-01-20",
      description: "Screen replacement for iPhone"
    },
    {
      id: "CLM002",
      type: "Travel Insurance",
      amount: "$1,200",
      status: "Processing",
      date: "2024-01-15",
      description: "Flight cancellation refund"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insurance Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Protect what matters most with our comprehensive insurance plans
        </p>
      </div>

      {/* Active Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>My Policies</span>
          </CardTitle>
          <CardDescription>
            Your active insurance coverage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activePolicies.length > 0 ? (
            <div className="space-y-4">
              {activePolicies.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{policy.name}</h3>
                    <p className="text-sm text-muted-foreground">Coverage: {policy.coverage}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">{policy.status}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Next payment: {policy.nextPayment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active policies</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Insurance Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {insurancePlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-8 w-8 ${plan.color}`} />
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.coverage} coverage</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-primary">{plan.price}</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Claims</span>
          </CardTitle>
          <CardDescription>
            Track your insurance claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentClaims.length > 0 ? (
            <div className="space-y-4">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{claim.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {claim.type} • Claim ID: {claim.id}
                    </p>
                    <p className="text-sm text-muted-foreground">{claim.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{claim.amount}</div>
                    <Badge 
                      variant={claim.status === "Approved" ? "default" : "secondary"}
                    >
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button className="w-full">File New Claim</Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No claims filed yet</p>
              <Button>File Your First Claim</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}