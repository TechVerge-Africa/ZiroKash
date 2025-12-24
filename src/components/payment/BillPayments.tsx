import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, Phone, Wifi, Home, Car, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  providers: { id: string; name: string; logo: string }[];
}

const billCategories: BillCategory[] = [
  {
    id: "airtime",
    name: "Airtime & Data",
    icon: <Phone className="h-4 w-4" />,
    providers: [
      { id: "mtn", name: "MTN", logo: "📱" },
      { id: "telecel", name: "Telecel", logo: "📲" },
      { id: "cell-c", name: "Cell C", logo: "📞" },
      { id: "telkom", name: "Telkom", logo: "☎️" },
    ]
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: <Zap className="h-4 w-4" />,
    providers: [
      { id: "eskom", name: "Eskom", logo: "⚡" },
      { id: "city-power", name: "City Power", logo: "🔌" },
      { id: "joburg-city", name: "City of Joburg", logo: "🏢" },
    ]
  },
  {
    id: "water",
    name: "Water",
    icon: <Home className="h-4 w-4" />,
    providers: [
      { id: "joburg-water", name: "Johannesburg Water", logo: "💧" },
      { id: "rand-water", name: "Rand Water", logo: "🌊" },
      { id: "ghana-water", name: "Ghana Water", logo: "🌊" },
    ]
  },
  {
    id: "internet",
    name: "Internet",
    icon: <Wifi className="h-4 w-4" />,
    providers: [
      { id: "rain", name: "Rain", logo: "🌧️" },
      { id: "axxess", name: "Axxess", logo: "🌐" },
      { id: "webafrica", name: "WebAfrica", logo: "🌍" },
    ]
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: <Car className="h-4 w-4" />,
    providers: [
      { id: "discovery", name: "Discovery", logo: "🛡️" },
      { id: "santam", name: "Santam", logo: "🏠" },
      { id: "old-mutual", name: "Old Mutual", logo: "🔒" },
    ]
  },
];

export function BillPayments() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"category" | "provider" | "details">("category");

  const currentCategory = billCategories.find(cat => cat.id === selectedCategory);
  const currentProvider = currentCategory?.providers.find(prov => prov.id === selectedProvider);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep("provider");
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setStep("details");
  };

  const handlePayment = () => {
    toast({
      title: "Bill Payment Initiated",
      description: `Payment of $${amount} to ${currentProvider?.name} initiated`,
    });
    // Reset form
    setSelectedCategory("");
    setSelectedProvider("");
    setAccountNumber("");
    setAmount("");
    setStep("category");
  };

  const goBack = () => {
    if (step === "details") {
      setStep("provider");
      setSelectedProvider("");
    } else if (step === "provider") {
      setStep("category");
      setSelectedCategory("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Bill Payments
        </CardTitle>
        <CardDescription>
          Pay utilities, airtime, and other bills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "category" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {billCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.icon}
                <span className="text-sm">{category.name}</span>
              </Button>
            ))}
          </div>
        )}

        {step === "provider" && currentCategory && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goBack}>
                ← Back
              </Button>
              <Badge variant="secondary">
                {currentCategory.icon}
                <span className="ml-1">{currentCategory.name}</span>
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currentCategory.providers.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="h-auto p-3 flex items-center gap-3 justify-start"
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <span className="text-xl">{provider.logo}</span>
                  <span>{provider.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && currentProvider && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goBack}>
                ← Back
              </Button>
              <Badge variant="secondary">
                <span className="mr-1">{currentProvider.logo}</span>
                {currentProvider.name}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-number">
                  {selectedCategory === "airtime" ? "Phone Number" : "Account Number"}
                </Label>
                <Input
                  id="account-number"
                  placeholder={selectedCategory === "airtime" ? "0XX XXX XXXX" : "Enter account number"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bill-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="bill-amount"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {selectedCategory === "airtime" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setAmount("10")}
                  >
                    $10
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setAmount("25")}
                  >
                    $25
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setAmount("50")}
                  >
                    $50
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setAmount("100")}
                  >
                    $100
                  </Button>
                </div>
              )}

              <Button 
                className="w-full"
                onClick={handlePayment}
                disabled={!accountNumber || !amount}
              >
                Pay ${amount}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}