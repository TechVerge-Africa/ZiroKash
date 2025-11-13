import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Phone, 
  MessageSquare,
  Info,
  HelpCircle,
  Copy
} from "lucide-react";

export default function OfflineUSSD() {
  const ussdCodes = [
    {
      code: "*123*1#",
      function: "Check Balance",
      description: "View your ZiroKash wallet balance"
    },
    {
      code: "*123*2*[amount]*[phone]#",
      function: "Send Money",
      description: "Send money to another user by phone number"
    },
    {
      code: "*123*3*[amount]#",
      function: "Request Money",
      description: "Generate a payment request"
    },
    {
      code: "*123*4#",
      function: "Transaction History",
      description: "View your last 5 transactions"
    },
    {
      code: "*123*5*[amount]#",
      function: "Buy Airtime",
      description: "Purchase airtime for your phone"
    },
    {
      code: "*123*6*[amount]*[meter]#",
      function: "Pay Electricity",
      description: "Pay electricity bills using meter number"
    },
    {
      code: "*123*0#",
      function: "Help Menu",
      description: "Access the full USSD menu"
    }
  ];

  const smsCommands = [
    {
      keyword: "BAL",
      function: "Check Balance",
      format: "Send 'BAL' to 1234",
      description: "Get your current wallet balance via SMS"
    },
    {
      keyword: "SEND",
      function: "Send Money",
      format: "Send 'SEND [amount] [phone]' to 1234",
      description: "Transfer money to another ZiroKash user"
    },
    {
      keyword: "REQ",
      function: "Request Money",
      format: "Send 'REQ [amount] [phone]' to 1234",
      description: "Request money from another user"
    },
    {
      keyword: "HIST",
      function: "Transaction History",
      format: "Send 'HIST' to 1234",
      description: "Get your recent transaction history"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offline & USSD Services</h1>
        <p className="text-muted-foreground mt-2">
          Access ZiroKash services even without internet connection
        </p>
      </div>

      {/* Connection Status */}
      <Card className="border-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <WifiOff className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">No Internet? No Problem!</h3>
                <p className="text-sm text-muted-foreground">
                  Use USSD codes or SMS to access your ZiroKash services offline
                </p>
              </div>
            </div>
            <Badge variant="outline">Always Available</Badge>
          </div>
        </CardContent>
      </Card>

      {/* USSD Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>USSD Codes</span>
          </CardTitle>
          <CardDescription>
            Dial these codes from any mobile phone to access ZiroKash services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ussdCodes.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <code className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded font-mono text-xs sm:text-sm break-all">
                      {item.code}
                    </code>
                    <span className="font-semibold text-sm sm:text-base">{item.function}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.code)}
                  className="self-end sm:self-center"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>SMS Commands</span>
          </CardTitle>
          <CardDescription>
            Send SMS messages to access ZiroKash services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {smsCommands.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <Badge variant="outline" className="w-fit">{item.keyword}</Badge>
                    <span className="font-semibold text-sm sm:text-base">{item.function}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{item.description}</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all block">
                    {item.format}
                  </code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.format)}
                  className="self-end sm:self-start mt-2 sm:mt-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
            <Info className="h-5 w-5" />
            <span>Important Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-yellow-800 dark:text-yellow-200">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              USSD and SMS services are available 24/7 on all mobile networks
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              Standard SMS and USSD rates may apply depending on your mobile plan
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              For security, transaction limits apply to offline services
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              Always verify transaction details before confirming
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Need Help?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            If you're having trouble with offline services, try these options:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 sm:p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Customer Support</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Call our 24/7 customer support line
              </p>
              <code className="text-primary text-xs sm:text-sm break-all">+234 800 ZIROKASH</code>
            </div>
            <div className="p-3 sm:p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Help via SMS</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Send 'HELP' for assistance
              </p>
              <code className="text-primary text-xs sm:text-sm break-all">Send 'HELP' to 1234</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}