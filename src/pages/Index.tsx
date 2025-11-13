
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, CreditCard, ChartLine, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = 'ZiroPay — Payment forms and settlements';
    const desc = 'Build and collect payments fast with ZiroPay. Create forms, embed, and track settlements.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-5xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">ZiroPay</h1>
          <p className="mt-4 text-lg text-gray-300">Create payment forms, embed anywhere, and track settlements.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Forms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Design flexible payment forms with custom fields and themes.</p>
              <Button asChild className="w-full">
                <Link to="/ziropay">
                  Build a Form <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Embed Anywhere
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Copy a snippet and embed on your website or share a link.</p>
              <Button asChild className="w-full">
                <Link to="/ziropay">
                  Get Embed Code <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine className="h-5 w-5" />
                Real-time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Track collections and settlements in real-time dashboards.</p>
              <Button asChild className="w-full">
                <Link to="/ziropay">
                  View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Quick Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Developer-friendly onboarding to get you collecting payments fast.</p>
              <Button asChild className="w-full">
                <Link to="/auth">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button size="lg" asChild>
            <Link to="/ziropay">
              Open ZiroPay <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
