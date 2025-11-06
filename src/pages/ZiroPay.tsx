import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link2, Eye, Download, DollarSign, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FormBuilder } from "@/components/ziropay/FormBuilder";
import { FormPreview } from "@/components/ziropay/FormPreview";
import { ReceiptDesigner } from "@/components/ziropay/ReceiptDesigner";
import { ThemePicker } from "@/components/ziropay/ThemePicker";
import { supabase } from "@/integrations/supabase/client";

interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

interface ReceiptTemplate {
  headerText: string;
  footerText: string;
  showLogo: boolean;
  showSignature: boolean;
  showQRCode: boolean;
  customFields: string[];
}

export default function ZiroPay() {
  const [isInstitution, setIsInstitution] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [themeColor, setThemeColor] = useState("#0056D2");
  const [logoUrl, setLogoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [receiptTemplate, setReceiptTemplate] = useState<ReceiptTemplate>({
    headerText: "Official Payment Receipt",
    footerText: "Thank you for your payment",
    showLogo: true,
    showSignature: true,
    showQRCode: false,
    customFields: [],
  });

  // Sample payment forms
  const paymentForms = [
    {
      id: '1',
      title: 'School Fees Payment',
      amount: 5000,
      collected: 125000,
      responses: 25,
      status: 'active'
    },
    {
      id: '2',
      title: 'Event Registration',
      amount: 200,
      collected: 8000,
      responses: 40,
      status: 'active'
    }
  ];

  const handleCreateForm = async () => {
    if (!formTitle.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    if (formFields.length === 0) {
      toast.error("Please add at least one field to your form");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to create forms");
        return;
      }

      const { error } = await supabase.from("payment_forms").insert({
        user_id: user.id,
        title: formTitle,
        description: formDescription || null,
        fields: formFields as any,
        theme_color: themeColor,
        logo_url: logoUrl || null,
        signature_url: signatureUrl || null,
        receipt_template: receiptTemplate as any,
      });

      if (error) throw error;

      toast.success("Payment form created! Share the link to start collecting.");
      setIsCreating(false);
      
      // Reset form
      setFormTitle("");
      setFormDescription("");
      setFormFields([]);
      setThemeColor("#0056D2");
    } catch (error: any) {
      console.error("Error creating form:", error);
      toast.error(error.message || "Failed to create form");
    }
  };

  const handleBecomeInstitution = () => {
    setIsInstitution(true);
    toast.success("Institution mode activated! You can now create payment forms.");
  };

  if (!isInstitution) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <DollarSign className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">ZiroPay - Institutional Payments</CardTitle>
            <CardDescription>
              Create payment forms, collect fees, and auto-generate receipts for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Create custom payment forms</p>
              <p>✓ Collect payments from students, customers, or members</p>
              <p>✓ Auto-generate branded receipts</p>
              <p>✓ Track all payments in one dashboard</p>
            </div>
            <Button onClick={handleBecomeInstitution} className="w-full" size="lg">
              Activate Institution Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ZiroPay</h1>
          <p className="text-muted-foreground mt-2">Collect payments with ease</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Payment Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Payment Form</DialogTitle>
              <DialogDescription>
                Build a custom form with drag-and-drop fields, preview in real-time, and design branded receipts
              </DialogDescription>
            </DialogHeader>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Panel - Builder */}
              <div className="space-y-6">
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="receipt">Receipt</TabsTrigger>
                  </TabsList>

                  <TabsContent value="form" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Form Title *</Label>
                        <Input
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g., School Fees Payment"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Provide payment instructions or details..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <FormBuilder fields={formFields} onFieldsChange={setFormFields} />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="mt-4">
                    <ThemePicker color={themeColor} onColorChange={setThemeColor} />
                  </TabsContent>

                  <TabsContent value="receipt" className="mt-4">
                    <ReceiptDesigner
                      template={receiptTemplate}
                      onTemplateChange={setReceiptTemplate}
                      logoUrl={logoUrl}
                      signatureUrl={signatureUrl}
                      onLogoUpload={setLogoUrl}
                      onSignatureUpload={setSignatureUrl}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3">
                  <Button onClick={handleCreateForm} className="flex-1">
                    Save & Publish Form
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Right Panel - Live Preview */}
              <div className="lg:sticky lg:top-6 h-fit">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Live Preview</h3>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                  <div className="border rounded-lg p-6 bg-muted/20">
                    <FormPreview
                      title={formTitle}
                      description={formDescription}
                      fields={formFields}
                      themeColor={themeColor}
                      logoUrl={logoUrl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵133,000</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground">
              Successful transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵3,200</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Forms List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Forms</CardTitle>
          <CardDescription>Manage all your payment collection forms</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentForms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payment forms yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentForms.map((form) => (
                <div 
                  key={form.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{form.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {form.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>₵{form.amount} per payment</span>
                      <span>•</span>
                      <span>{form.responses} payments received</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        ₵{form.collected.toLocaleString()} collected
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Link2 className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
