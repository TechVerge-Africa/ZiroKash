import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormBuilder } from "@/components/ziropay/FormBuilder";
import { MerchantOnboarding } from "@/components/ziropay/MerchantOnboarding";
import { MerchantPinVerify } from "@/components/ziropay/MerchantPinVerify";
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Eye, Plus, DollarSign, FileText, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function ZiroPay() {
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [merchantStatus, setMerchantStatus] = useState<'loading' | 'none' | 'pending' | 'approved' | 'locked'>('loading');
  const [pinVerified, setPinVerified] = useState(false);
  const { forms, stats, isLoading, refetch } = usePaymentForms();
  const navigate = useNavigate();

  useEffect(() => {
    checkMerchantStatus();
  }, []);

  const checkMerchantStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMerchantStatus('none');
        return;
      }

      // Check merchant record
      const { data: merchant } = await supabase
        .from('merchants')
        .select('verification_status, is_active')
        .eq('user_id', user.id)
        .single();

      if (!merchant) {
        setMerchantStatus('none');
      } else if (merchant.verification_status === 'pending') {
        setMerchantStatus('pending');
      } else if (merchant.verification_status === 'verified' && merchant.is_active) {
        // Check if PIN exists
        const { data: userPin } = await supabase
          .from('user_pins')
          .select('id')
          .eq('user_id', user.id)
          .single();

        setMerchantStatus(userPin ? 'approved' : 'pending');
      } else {
        setMerchantStatus('none');
      }
    } catch (error) {
      console.error('Error checking merchant status:', error);
      setMerchantStatus('none');
    }
  };

  const copyPaymentLink = (formId: string) => {
    const link = `${window.location.origin}/pay/${formId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Payment form link copied to clipboard",
    });
  };

  // Show onboarding if no merchant account
  if (merchantStatus === 'none') {
    return <MerchantOnboarding />;
  }

  // Show pending message
  if (merchantStatus === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Under Review</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for applying! We're reviewing your application and will send you an email within 24 hours.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Our team reviews your application</li>
              <li>✓ You'll receive an approval email</li>
              <li>✓ Set up your security PIN</li>
              <li>✓ Start accepting payments!</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }

  // Show PIN verification if not verified
  if (merchantStatus === 'approved' && !pinVerified) {
    return <MerchantPinVerify onVerified={() => setPinVerified(true)} />;
  }

  if (isLoading || merchantStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate overall stats
  const totalCollected = Object.values(stats).reduce((sum, s) => sum + s.totalCollected, 0);
  const totalSubmissions = Object.values(stats).reduce((sum, s) => sum + s.totalSubmissions, 0);
  const totalPaid = Object.values(stats).reduce((sum, s) => sum + s.paidSubmissions, 0);
  const activeForms = forms.filter(f => f.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ZiroPay Merchant Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your payment forms and collections</p>
        </div>
        
        <Button onClick={() => setShowFormBuilder(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Payment Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">GHS {totalCollected.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">From {totalPaid} paid submissions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Active Forms</p>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{activeForms}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently accepting payments</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalSubmissions}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalSubmissions - totalPaid}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
        </Card>
      </div>

      {/* Payment Forms List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Forms</h2>
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No payment forms yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => {
              const formStats = stats[form.id] || { totalSubmissions: 0, paidSubmissions: 0, totalCollected: 0 };
              
              return (
                <div 
                  key={form.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{form.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formStats.totalSubmissions} submissions</span>
                      <span>•</span>
                      <span>{formStats.paidSubmissions} paid</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        GHS {formStats.totalCollected.toLocaleString()} collected
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyPaymentLink(form.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/ziropay/${form.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
