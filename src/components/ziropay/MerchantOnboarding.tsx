import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, MapPin, FileText, Shield } from "lucide-react";

export function MerchantOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessRegistration: "",
    description: "",
  });

  const businessTypes = [
    "Educational Institution",
    "Religious Organization",
    "Charity/NGO",
    "Association/Union",
    "Healthcare Facility",
    "Government Agency",
    "Private Company",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        return;
      }

      // Submit merchant application
      const { data, error } = await supabase.functions.invoke('merchant-onboarding', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully! 🎉",
        description: "Your ZiroPay merchant application has been received. We'll review and send confirmation via email within 24 hours.",
      });

      navigate('/ziropay/setup-pin', { state: { merchantId: data.merchantId } });
    } catch (error: any) {
      console.error('Merchant onboarding error:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Activate ZiroPay for Your Organization</CardTitle>
            <CardDescription>
              Accept payments from students, members, donors, and customers across Ghana with ease and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">
                  <Building2 className="inline h-4 w-4 mr-2" />
                  Organization Name *
                </Label>
                <Input
                  id="businessName"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g., University of Ghana, ABC Church"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Organization Type *
                </Label>
                <Select
                  required
                  value={formData.businessType}
                  onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Official Email *
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  required
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  placeholder="contact@yourorganization.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number *
                </Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  required
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  placeholder="0XX XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Physical Address *
                </Label>
                <Input
                  id="businessAddress"
                  required
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  placeholder="e.g., Legon, Accra"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessRegistration">
                  <Shield className="inline h-4 w-4 mr-2" />
                  Registration Number (Optional)
                </Label>
                <Input
                  id="businessRegistration"
                  value={formData.businessRegistration}
                  onChange={(e) => setFormData({ ...formData, businessRegistration: e.target.value })}
                  placeholder="Company/Organization registration number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your organization and how you plan to use ZiroPay"
                  rows={4}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Security Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Secure PIN protection for account access</li>
                  <li>✓ Real-time payment notifications</li>
                  <li>✓ Fraud detection and monitoring</li>
                  <li>✓ Encrypted data storage</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to ZiroPay's Terms of Service and Privacy Policy
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
