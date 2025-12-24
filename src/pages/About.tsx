import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Award,
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

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former Goldman Sachs executive with 15+ years in fintech"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Ex-Google engineer specializing in blockchain and distributed systems"
    },
    {
      name: "Amira Hassan",
      role: "Head of Product",
      bio: "Product leader with experience at PayPal and Stripe"
    },
    {
      name: "David Rodriguez",
      role: "Head of Security",
      bio: "Cybersecurity expert with background in banking and fintech"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Company Founded",
      description: "ZiroKash was founded with a vision to democratize financial services"
    },
    {
      year: "2023",
      title: "Series A Funding",
      description: "Raised $10M Series A to expand across Africa and Southeast Asia"
    },
    {
      year: "2024",
      title: "1M+ Users",
      description: "Reached 1 million active users across 15 countries"
    },
    {
      year: "2024",
      title: "Banking License",
      description: "Obtained digital banking license to offer enhanced services"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
            Z
          </div>
          <h1 className="text-4xl font-bold gradient-text">ZiroPay</h1>
        </div>
        <h2 className="text-2xl font-semibold">The Future of Merchant Payments in Africa</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          ZiroPay is a premium financial technology platform designed to empower businesses 
          and individuals with seamless, secure, and boundary-less payment infrastructure.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To build the financial rails that power the next generation of African commerce, 
              providing merchants with the tools they need to collect, manage, and grow their wealth.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-secondary" />
              <span>Our Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the most trusted financial partner for businesses across the continent, 
              connecting African trade to the global economy through innovative payment solutions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Why Businesses Choose ZiroPay</CardTitle>
          <CardDescription>
            State-of-the-art infrastructure for modern commerce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Company Stats */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Our Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text">50k+</div>
              <div className="text-sm text-muted-foreground">Active Merchants</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">GH₵500M+</div>
              <div className="text-sm text-muted-foreground">Monthly Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">10+</div>
              <div className="text-sm text-muted-foreground">Markets Active</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">99.99%</div>
              <div className="text-sm text-muted-foreground">API Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Connect With Us</CardTitle>
          <CardDescription>
            Based in the heart of Africa's tech hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/5">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@ziropay.com</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/5">
              <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Hotline</h3>
              <p className="text-sm text-muted-foreground">+233 24 000 ZIRO</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/5">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Headquarters</h3>
              <p className="text-sm text-muted-foreground">Airport Residential, Accra</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button className="mr-3 px-8 shadow-lg shadow-primary/20">
              Partner With Us
            </Button>
            <Button variant="outline" className="px-8 border-white/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              Developer Hub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}