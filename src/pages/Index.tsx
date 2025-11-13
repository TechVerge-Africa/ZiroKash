
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, CreditCard, ChartLine, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">ZiroKash</h1>
          <p className="mt-4 text-lg text-gray-300">Your modern African financial platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Digital Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Manage all your finances in one place with our digital wallet solution.</p>
              <Button asChild className="w-full">
                <Link to="/wallet">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cards Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Manage your physical and virtual cards with advanced security features.</p>
              <Button asChild className="w-full">
                <Link to="/cards">
                  Explore Cards <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine className="h-5 w-5" />
                Investments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Grow your wealth with our range of investment opportunities and tools.</p>
              <Button asChild className="w-full">
                <Link to="/investments">
                  Start Investing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Secure Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Send and receive money securely with our advanced payment system.</p>
              <Button asChild className="w-full">
                <Link to="/payments">
                  Make Payments <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
