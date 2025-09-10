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
          <h1 className="text-4xl font-bold gradient-text">ZiroKash</h1>
        </div>
        <h2 className="text-2xl font-semibold">Empowering Financial Freedom for Everyone</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          ZiroKash is a next-generation digital wallet and fintech platform that makes 
          financial services accessible, affordable, and secure for users across the globe.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To democratize financial services by providing everyone with access to 
              fast, secure, and affordable digital banking solutions, regardless of 
              their location or economic status.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-blue-500" />
              <span>Our Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To become the leading financial super-app that connects people globally, 
              enabling seamless cross-border transactions and fostering financial 
              inclusion worldwide.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>What Makes ZiroKash Special</CardTitle>
          <CardDescription>
            The features that set us apart in the digital finance landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
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
      <Card>
        <CardHeader>
          <CardTitle>By the Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">$500M+</div>
              <div className="text-sm text-muted-foreground">Transactions Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Our Journey</CardTitle>
          <CardDescription>
            Key milestones in ZiroKash's growth story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">{milestone.year}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leadership Team */}
      <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
          <CardDescription>
            Meet the visionaries behind ZiroKash
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Awards & Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <span>Awards & Recognition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold">Best Fintech Startup 2023</h3>
              <p className="text-sm text-muted-foreground">African Tech Awards</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold">Innovation in Finance</h3>
              <p className="text-sm text-muted-foreground">Global Fintech Conference</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold">Customer Choice Award</h3>
              <p className="text-sm text-muted-foreground">Digital Banking Summit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>
            Have questions? We'd love to hear from you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">hello@zirokash.com</p>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">+234 800 ZIROKASH</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Address</h3>
              <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button className="mr-3">
              Contact Sales
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}