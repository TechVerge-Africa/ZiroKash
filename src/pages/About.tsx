import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Heart,
  Mail,
  MapPin,
  Phone,
  ExternalLink
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant transfers and real-time processing across all platforms"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Military-grade encryption and multi-layer security protocols"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Send money anywhere in the world with competitive exchange rates"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Designed with simplicity and user experience at the forefront"
    }
  ];

  /* Team data removed for brevity as it's not being used in the rendered output anyway? 
     Wait, the original file did not use 'team' or 'milestones' in the return JSX?
     Checking lines 87-231... 
     Heroes, Mission, Features, Stats, Contact.
     It seems 'team' and 'milestones' were defined but unused variables in the original file I viewed.
     I should keep them removed if they are unused to clean up code, OR keep them if I want to be safe.
     Since I am rewriting the file content, I'll check if I should include them.
     The viewed file showed them defined but not used in the render?
     Let's check lines 106-231 of the original file content provided in Step 2440.
     It renders: Hero, Mission & Vision, Key Features, Company Stats, Contact Info.
     It does NOT render Team or Milestones.
     So I can safely remove them.
  */

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-6">
            <img 
              src="/zirokash-logo.png" 
              alt="ZiroKash Logo" 
              className="h-24 w-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              ZiroKash
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
            The Future of Merchant Payments in Africa
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ZiroKash is a premium financial technology platform designed to empower businesses 
            and individuals with seamless, secure, and boundary-less payment infrastructure.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-background/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To build the financial rails that power the next generation of African commerce, 
                providing merchants with the tools they need to collect, manage, and grow their wealth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                 <div className="p-2 bg-secondary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted financial partner for businesses across the continent, 
                connecting African trade to the global economy through innovative payment solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="space-y-8">
          <div className="text-center">
             <h2 className="text-3xl font-bold mb-2">Why Businesses Choose ZiroKash</h2>
             <p className="text-muted-foreground">State-of-the-art infrastructure for modern commerce</p>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-background/50 border-border/40 hover:border-primary/20 transition-all">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Company Stats */}
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">50k+</div>
                <div className="text-sm font-medium text-muted-foreground">Active Merchants</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">GH₵500M+</div>
                <div className="text-sm font-medium text-muted-foreground">Monthly Volume</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm font-medium text-muted-foreground">Markets Active</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">99.99%</div>
                <div className="text-sm font-medium text-muted-foreground">API Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@zirokash.com</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-1">Hotline</h3>
              <p className="text-sm text-muted-foreground">+233 24 000 ZIRO</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-md transition-shadow">
             <CardContent className="pt-6">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-1">Headquarters</h3>
              <p className="text-sm text-muted-foreground">Airport Residential, Accra</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center pb-12">
          <Button className="mr-3 px-8 h-12 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            Partner With Us
          </Button>
          <Button variant="outline" className="px-8 h-12 text-base border-primary/20 hover:bg-primary/5">
            <ExternalLink className="h-4 w-4 mr-2" />
            Developer Hub
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}