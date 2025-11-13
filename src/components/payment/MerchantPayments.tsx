import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Store, Search, MapPin, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Merchant {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  logo: string;
}

const merchants: Merchant[] = [
  { id: "1", name: "Shoprite", category: "Grocery", rating: 4.5, distance: "0.5km", logo: "🛒" },
  { id: "2", name: "KFC", category: "Food", rating: 4.2, distance: "1.2km", logo: "🍗" },
  { id: "3", name: "Shell Station", category: "Fuel", rating: 4.0, distance: "0.8km", logo: "⛽" },
  { id: "4", name: "MTN Store", category: "Telecom", rating: 4.3, distance: "2.1km", logo: "📱" },
  { id: "5", name: "Game Store", category: "Electronics", rating: 4.1, distance: "1.5km", logo: "🎮" },
];

export function MerchantPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [amount, setAmount] = useState("");

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayment = () => {
    if (!selectedMerchant || !amount) return;
    
    toast({
      title: "Payment Initiated",
      description: `Payment of $${amount} to ${selectedMerchant.name} initiated`,
    });
    setSelectedMerchant(null);
    setAmount("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Merchant Payments
        </CardTitle>
        <CardDescription>
          Pay at stores and businesses near you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="merchant-search">Search Merchants</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="merchant-search"
              placeholder="Search by name or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedMerchant ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedMerchant.logo}</span>
                <div>
                  <h3 className="font-semibold">{selectedMerchant.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{selectedMerchant.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {selectedMerchant.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedMerchant.distance}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="payment-amount"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedMerchant(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={!amount}
                className="flex-1"
              >
                Pay ${amount}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setSelectedMerchant(merchant)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{merchant.logo}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{merchant.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">{merchant.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {merchant.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {merchant.distance}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}