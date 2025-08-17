import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function ReceiveMoneyCard() {
  const { user } = useAuth();
  const [requestAmount, setRequestAmount] = useState("");
  
  // Generate a mock wallet address for demo purposes
  const walletAddress = user ? `paynex_${user.id.slice(0, 8)}...${user.id.slice(-8)}` : "";
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address copied successfully",
    });
  };

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PayNex Wallet Address',
        text: `Send money to my PayNex wallet: ${walletAddress}`,
      });
    } else {
      copyToClipboard(walletAddress);
    }
  };

  const generateQRCode = () => {
    toast({
      title: "QR Code Generated",
      description: "QR code for your wallet address is ready to share",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Receive Money
        </CardTitle>
        <CardDescription>
          Share your wallet address to receive payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet-address">Your Wallet Address</Label>
          <div className="flex gap-2">
            <Input
              id="wallet-address"
              value={walletAddress}
              readOnly
              className="font-mono text-sm"
            />
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => copyToClipboard(walletAddress)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="request-amount">Request Amount (Optional)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
            <Input
              id="request-amount"
              placeholder="0.00"
              className="pl-8"
              value={requestAmount}
              onChange={(e) => setRequestAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateQRCode}
            className="flex-1"
            variant="outline"
          >
            <QrCode className="mr-2 h-4 w-4" />
            Generate QR
          </Button>
          <Button 
            onClick={shareAddress}
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Address
          </Button>
        </div>

        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="w-32 h-32 mx-auto bg-white border-2 border-dashed border-muted-foreground flex items-center justify-center rounded-lg">
            <QrCode className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            QR Code will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}