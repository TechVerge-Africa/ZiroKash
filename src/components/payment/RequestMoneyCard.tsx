import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, Share2, Link2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function RequestMoneyCard() {
  const { user } = useAuth();
  const [requestAmount, setRequestAmount] = useState("");
  const [description, setDescription] = useState("");
  
  const generateRequestLink = () => {
    const link = `https://zirokash.com/pay/${user?.id}?amount=${requestAmount}&desc=${encodeURIComponent(description)}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Request link copied",
      description: "Payment request link copied to clipboard",
    });
  };

  const generateQRCode = () => {
    toast({
      title: "QR Code Generated",
      description: "QR code for payment request is ready to share",
    });
  };

  const shareRequest = () => {
    const message = `Pay me $${requestAmount} via ZiroKash${description ? ` for ${description}` : ''}`;
    if (navigator.share) {
      navigator.share({
        title: 'ZiroKash Payment Request',
        text: message,
      });
    } else {
      generateRequestLink();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Request Money
        </CardTitle>
        <CardDescription>
          Create a payment request link or QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="request-amount">Amount</Label>
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

        <div className="space-y-2">
          <Label htmlFor="request-description">Description (Optional)</Label>
          <Input
            id="request-description"
            placeholder="What's this payment for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button 
            onClick={generateRequestLink}
            variant="outline"
            disabled={!requestAmount}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button 
            onClick={generateQRCode}
            variant="outline"
            disabled={!requestAmount}
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </Button>
          <Button 
            onClick={shareRequest}
            disabled={!requestAmount}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {requestAmount && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="w-32 h-32 mx-auto bg-white border-2 border-dashed border-muted-foreground flex items-center justify-center rounded-lg">
              <QrCode className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              QR Code for ${requestAmount}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}