import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, DollarSign, Copy, ArrowRight, ArrowLeft, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FormBuilder } from "@/components/zirokash/FormBuilder";
import { FormPreview } from "@/components/zirokash/FormPreview";
import { ReceiptDesigner } from "@/components/zirokash/ReceiptDesigner";
import { ThemePicker } from "@/components/zirokash/ThemePicker";
import { supabase } from "@/integrations/supabase/client";
import { usePaymentForms } from "@/hooks/usePaymentForms";
import { useMerchant } from "@/hooks/useMerchant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

interface FieldMapping {
  formFieldId: string;
  receiptLabel: string;
  showOnReceipt: boolean;
}

interface ReceiptTemplate {
  headerText: string;
  footerText: string;
  showLogo: boolean;
  showSignature: boolean;
  showQRCode: boolean;
  customFields: string[];
  fieldMappings?: FieldMapping[];
  securityFeatures?: {
    showWatermark: boolean;
    watermarkText: string;
    showSecurityBorder: boolean;
    showBarcodeBottom: boolean;
    enableNumbering: boolean;
    receiptNumberPrefix?: string;
  };
}

// Quick start templates
const QUICK_TEMPLATES = [
  {
    name: "School Fees",
    icon: "🎓",
    templateDescription: "Collect school fees from students",
    fields: [
      { type: "text" as const, label: "Student Name", required: true },
      { type: "text" as const, label: "Student ID", required: true },
      { type: "email" as const, label: "Email Address", required: true },
      { type: "amount" as const, label: "Amount", required: true, defaultValue: "0" },
    ],
    title: "School Fees Payment",
    formDescription: "Please fill in your details to complete the payment",
  },
  {
    name: "Event Registration",
    icon: "🎫",
    templateDescription: "Collect payments for events",
    fields: [
      { type: "text" as const, label: "Full Name", required: true },
      { type: "email" as const, label: "Email", required: true },
      { type: "text" as const, label: "Phone Number", required: true },
      { type: "dropdown" as const, label: "Ticket Type", required: true, options: ["VIP - ₵500", "Standard - ₵200", "Early Bird - ₵150"] },
    ],
    title: "Event Registration",
    formDescription: "Register and pay for the event",
  },
  {
    name: "Donation",
    icon: "❤️",
    templateDescription: "Collect donations",
    fields: [
      { type: "text" as const, label: "Donor Name", required: true },
      { type: "email" as const, label: "Email", required: false },
      { type: "amount" as const, label: "Donation Amount", required: true, defaultValue: "0" },
    ],
    title: "Make a Donation",
    formDescription: "Your contribution makes a difference",
  },
  {
    name: "Custom",
    icon: "✨",
    templateDescription: "Start from scratch",
    fields: [],
    title: "",
    formDescription: "",
  },
];

export default function ZiroKash() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { forms, stats, isLoading, refetch } = usePaymentForms();
  const { isMerchant, hasSubaccount, loading: merchantLoading } = useMerchant();

  const checkMerchantStatus = () => {
    if (merchantLoading) return false;
    if (!isMerchant || !hasSubaccount) {
      toast.error("Merchant Setup Required", {
        description: "You need to complete your business profile and bank setup before creating payment forms.",
        action: {
          label: "Complete Setup",
          onClick: () => navigate("/settings?tab=business")
        }
      });
      navigate("/settings?tab=business");
      return false;
    }
    return true;
  };
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Template, 2: Form, 3: Design, 4: Receipt
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [themeColor, setThemeColor] = useState("#0056D2");
  const [logoUrl, setLogoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [feeBearer, setFeeBearer] = useState<'customer' | 'merchant'>('customer');
  const [receiptTemplate, setReceiptTemplate] = useState<ReceiptTemplate>({
    headerText: "Official Payment Receipt",
    footerText: "Thank you for your payment",
    showLogo: true,
    showSignature: true,
    showQRCode: false,
    customFields: [],
    fieldMappings: [],
    securityFeatures: {
      showWatermark: false,
      watermarkText: "OFFICIAL",
      showSecurityBorder: true,
      showBarcodeBottom: true,
      enableNumbering: true,
      receiptNumberPrefix: "REC",
    },
  });

  // Calculate overall stats
  const totalCollected = Object.values(stats).reduce((sum, s) => sum + s.totalCollected, 0);
  const totalSubmissions = Object.values(stats).reduce((sum, s) => sum + s.totalSubmissions, 0);
  const totalPaid = Object.values(stats).reduce((sum, s) => sum + s.paidSubmissions, 0);
  const activeForms = forms.filter(f => f.is_active).length;

  // Check for edit parameter in URL
  useEffect(() => {
    const editFormId = searchParams.get("edit");
    if (editFormId && forms.length > 0) {
      const formToEdit = forms.find(f => f.id === editFormId);
      if (formToEdit) {
        setEditingFormId(formToEdit.id);
        setFormTitle(formToEdit.title);
        setFormDescription(formToEdit.description || "");
        setFormFields(formToEdit.fields || []);
        setThemeColor(formToEdit.theme_color || "#0056D2");
        setLogoUrl(formToEdit.logo_url || "");
        setSignatureUrl(formToEdit.signature_url || "");
        setFeeBearer((formToEdit as any).fee_bearer || 'customer');
        setReceiptTemplate(formToEdit.receipt_template || {
          headerText: "Official Payment Receipt",
          footerText: "Thank you for your payment",
          showLogo: true,
          showSignature: true,
          showQRCode: false,
          customFields: [],
          fieldMappings: [],
          securityFeatures: {
            showWatermark: false,
            watermarkText: "OFFICIAL",
            showSecurityBorder: true,
            showBarcodeBottom: true,
            enableNumbering: true,
          },
        });
        setIsEditing(true);
        // Clean up the URL
        navigate("/zirokash", { replace: true });
      }
    }
  }, [searchParams, forms, navigate]);

  const handleCreateForm = async () => {
    if (!formTitle.trim()) {
      toast.error("Please enter a form title", {
        description: "Your form needs a title so people know what they're paying for"
      });
      setCurrentStep(2);
      return;
    }

    if (formFields.length === 0) {
      toast.error("Please add at least one field to your form", {
        description: "Add fields like Amount, Name, or Email to collect information"
      });
      setCurrentStep(2);
      return;
    }

    // Check if there's an amount field
    const hasAmountField = formFields.some(f => f.type === "amount");
    if (!hasAmountField) {
      const confirm = window.confirm(
        "You don't have an Amount field. Without it, you won't be able to collect payments. Would you like to add one now?"
      );
      if (confirm) {
        setCurrentStep(2);
        return;
      }
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
        fee_bearer: feeBearer,
        receipt_template: receiptTemplate as any,
      });

      if (error) throw error;

      toast.success("Payment form created! Share the link to start collecting.");
      setIsCreating(false);
      resetFormState();
      refetch();
    } catch (error: any) {
      console.error("Error creating form:", error);
      toast.error(error.message || "Failed to create form");
    }
  };

  const handleEditForm = async () => {
    if (!editingFormId) return;
    
    if (!formTitle.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    try {
      const { error } = await supabase
        .from("payment_forms")
        .update({
          title: formTitle,
          description: formDescription || null,
          fields: formFields as any,
          theme_color: themeColor,
          logo_url: logoUrl || null,
          signature_url: signatureUrl || null,
          fee_bearer: feeBearer,
          receipt_template: receiptTemplate as any,
        })
        .eq("id", editingFormId);

      if (error) throw error;

      toast.success("Payment form updated successfully!");
      setIsEditing(false);
      resetFormState();
      refetch();
    } catch (error: any) {
      console.error("Error updating form:", error);
      toast.error(error.message || "Failed to update form");
    }
  };

  const resetFormState = () => {
    setFormTitle("");
    setFormDescription("");
    setFormFields([]);
    setThemeColor("#0056D2");
    setLogoUrl("");
    setSignatureUrl("");
    setFeeBearer('customer');
    setEditingFormId(null);
    setCurrentStep(1);
    setSelectedTemplate(null);
    setReceiptTemplate({
      headerText: "Official Payment Receipt",
      footerText: "Thank you for your payment",
      showLogo: true,
      showSignature: true,
      showQRCode: false,
      customFields: [],
      fieldMappings: [],
      securityFeatures: {
        showWatermark: false,
        watermarkText: "OFFICIAL",
        showSecurityBorder: true,
        showBarcodeBottom: true,
        enableNumbering: true,
      },
    });
  };

  const applyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    if (template.name === "Custom") {
      // Start with basic amount and email fields
      setFormFields([
        {
          id: `field-${Date.now()}-1`,
          type: "text",
          label: "Full Name",
          required: true,
        },
        {
          id: `field-${Date.now()}-2`,
          type: "email",
          label: "Email Address",
          required: true,
        },
        {
          id: `field-${Date.now()}-3`,
          type: "amount",
          label: "Amount",
          required: true,
          defaultValue: "0",
        },
      ]);
    } else {
      setFormTitle(template.title);
      setFormDescription(template.formDescription || "");
      setFormFields(
        template.fields.map((field, index) => ({
          id: `field-${Date.now()}-${index}`,
          ...field,
          options: field.type === "dropdown" ? (field.options || []) : undefined,
        }))
      );
    }
    setSelectedTemplate(template.name);
    setCurrentStep(2);
  };

  const getStepProgress = () => {
    if (isEditing) return 100;
    return (currentStep / 4) * 100;
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return formTitle.trim() !== "" && formFields.length > 0;
      case 3:
        return true; // Design is optional
      case 4:
        return true; // Receipt is optional
      default:
        return false;
    }
  };

  const openEditForm = (form: any) => {
    setEditingFormId(form.id);
    setFormTitle(form.title);
    setFormDescription(form.description || "");
    setFormFields(form.fields || []);
    setThemeColor(form.theme_color || "#0056D2");
    setLogoUrl(form.logo_url || "");
    setSignatureUrl(form.signature_url || "");
    setFeeBearer((form as any).fee_bearer || 'customer');
    setReceiptTemplate(form.receipt_template || {
      headerText: "Official Payment Receipt",
      footerText: "Thank you for your payment",
      showLogo: true,
      showSignature: true,
      showQRCode: false,
      customFields: [],
      fieldMappings: [],
      securityFeatures: {
        showWatermark: false,
        watermarkText: "OFFICIAL",
        showSecurityBorder: true,
        showBarcodeBottom: true,
        enableNumbering: true,
      },
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Payment Forms</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Create forms, collect payments, and generate receipts</p>
        </div>
        
        <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            resetFormState();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => {
              if (!checkMerchantStatus()) return;
              resetFormState();
              setIsCreating(true);
            }}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Payment Form</span>
              <span className="sm:hidden">Create Form</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-5xl xl:max-w-7xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isEditing ? "Edit Payment Form" : "Create Payment Form"}
                {!isEditing && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Follow the steps to create your payment form. You can customize everything or use a quick template!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Update your form fields, design, and receipt settings"
                  : "Create a payment form in minutes. Choose a template or build your own."
                }
              </DialogDescription>
            </DialogHeader>

            {!isEditing && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Step {currentStep} of 4</span>
                  <span className="text-muted-foreground">{Math.round(getStepProgress())}% Complete</span>
                </div>
                <Progress value={getStepProgress()} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Template</span>
                  <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Form Fields</span>
                  <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Design</span>
                  <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Receipt</span>
                </div>
              </div>
            )}

            {!isEditing && currentStep === 1 ? (
              // Step 1: Template Selection
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Choose a Quick Start Template</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Select a template to get started quickly, or choose Custom to build from scratch
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {QUICK_TEMPLATES.map((template) => (
                    <Card
                      key={template.name}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedTemplate === template.name ? "border-primary border-2" : ""
                      }`}
                      onClick={() => applyTemplate(template)}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="text-3xl sm:text-4xl flex-shrink-0">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-1 text-sm sm:text-base">{template.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3">{template.templateDescription}</p>
                            {template.fields.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {template.fields.slice(0, 3).map((field, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {field.label}
                                  </Badge>
                                ))}
                                {template.fields.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.fields.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          {selectedTemplate === template.name && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(2)} 
                    disabled={!canProceedToNextStep()}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Panel - Builder */}
                <div className="space-y-4 sm:space-y-6">
                  {!isEditing && (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Step {currentStep} of 4
                      </Badge>
                    </div>
                  )}
                  <Tabs 
                    value={isEditing ? undefined : (currentStep === 2 ? "form" : currentStep === 3 ? "design" : "receipt")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                      <TabsTrigger 
                        value="form"
                        onClick={() => !isEditing && setCurrentStep(2)}
                        className={cn(
                          !isEditing && currentStep === 2 ? "ring-2 ring-primary" : "",
                          "text-xs sm:text-sm py-2 sm:py-2.5"
                        )}
                      >
                        Form
                      </TabsTrigger>
                      <TabsTrigger 
                        value="design"
                        onClick={() => !isEditing && setCurrentStep(3)}
                        className={cn(
                          !isEditing && currentStep === 3 ? "ring-2 ring-primary" : "",
                          "text-xs sm:text-sm py-2 sm:py-2.5"
                        )}
                      >
                        Design
                      </TabsTrigger>
                      <TabsTrigger 
                        value="receipt"
                        onClick={() => !isEditing && setCurrentStep(4)}
                        className={cn(
                          !isEditing && currentStep === 4 ? "ring-2 ring-primary" : "",
                          "text-xs sm:text-sm py-2 sm:py-2.5"
                        )}
                      >
                        Receipt
                      </TabsTrigger>
                    </TabsList>

                  <TabsContent value="form" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Form Title *</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Give your form a clear, descriptive title that tells users what they're paying for</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g., School Fees Payment"
                          className="text-base"
                        />
                        {formTitle.trim() === "" && (
                          <p className="text-xs text-muted-foreground">This will be displayed at the top of your payment form</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Description (Optional)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add instructions or additional information about the payment</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="e.g., Please fill in your details to complete the payment. Payment confirmation will be sent to your email."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-base">Form Fields</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add fields to collect information from payers. Drag to reorder.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {formFields.length === 0 && (
                          <p className="text-sm text-muted-foreground mb-4">
                            💡 Tip: Start with an Amount field to collect payments. Add Name and Email fields to identify payers.
                          </p>
                        )}
                      </div>
                      <FormBuilder fields={formFields} onFieldsChange={setFormFields} />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="mt-4 space-y-6">
                    <ThemePicker color={themeColor} onColorChange={setThemeColor} />
                    
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Pass processing fee to customer</Label>
                          <p className="text-sm text-muted-foreground">
                            When enabled, a 1.95% processing fee (max GHS 100) will be added to the customer's payment. 
                            You will receive 100% of the intended amount.
                          </p>
                        </div>
                        <Switch 
                          checked={feeBearer === 'customer'}
                          onCheckedChange={(checked) => setFeeBearer(checked ? 'customer' : 'merchant')}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="receipt" className="mt-4">
                    <ReceiptDesigner
                      template={receiptTemplate}
                      onTemplateChange={setReceiptTemplate}
                      logoUrl={logoUrl}
                      signatureUrl={signatureUrl}
                      onLogoUpload={setLogoUrl}
                      onSignatureUpload={setSignatureUrl}
                      formFields={formFields}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  {!isEditing && currentStep < 4 ? (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="gap-2 order-2 sm:order-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={() => {
                          if (currentStep < 4) {
                            setCurrentStep(currentStep + 1);
                          } else {
                            handleCreateForm();
                          }
                        }}
                        disabled={!canProceedToNextStep()}
                        className="flex-1 gap-2 order-1 sm:order-2"
                      >
                        <span className="hidden sm:inline">{currentStep === 4 ? "Save & Publish Form" : "Continue"}</span>
                        <span className="sm:hidden">{currentStep === 4 ? "Save" : "Next"}</span>
                        {currentStep < 4 && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={isEditing ? handleEditForm : handleCreateForm} 
                        className="flex-1 order-1 sm:order-1"
                        disabled={!formTitle.trim() || formFields.length === 0}
                      >
                        <span className="hidden sm:inline">{isEditing ? "Update Form" : "Save & Publish Form"}</span>
                        <span className="sm:hidden">{isEditing ? "Update" : "Save"}</span>
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        resetFormState();
                      }} className="order-2 sm:order-2">
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Panel - Live Preview */}
              <div className="lg:sticky lg:top-6 h-fit">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Live Preview</h3>
                    <Badge variant="outline" className="text-xs">Real-time</Badge>
                  </div>
                  <div className="border rounded-lg p-4 sm:p-6 bg-muted/20">
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
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Forms List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Payment Forms</CardTitle>
          <CardDescription>Manage and track all your payment collection forms</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <DollarSign className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No payment forms yet</h3>
              <p className="text-muted-foreground mb-6">Create your first payment form to start collecting payments</p>
              <Button onClick={() => {
                if (!checkMerchantStatus()) return;
                resetFormState();
                setIsCreating(true);
              }} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Form
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => {
                const formStats = stats[form.id] || { totalSubmissions: 0, paidSubmissions: 0, totalCollected: 0 };
                
                return (
                  <div 
                    key={form.id} 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-sm sm:text-base truncate">{form.title}</h3>
                        <Badge variant={form.is_active ? "default" : "secondary"} className="text-xs flex-shrink-0">
                          {form.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span>{formStats.totalSubmissions} submissions</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formStats.paidSubmissions} paid</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-semibold text-primary">
                          GHS {formStats.totalCollected.toLocaleString()} collected
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 flex-1 sm:flex-initial"
                        onClick={() => {
                          if (!checkMerchantStatus()) return;
                          const link = `${window.location.origin}/pay/${form.id}`;
                          navigator.clipboard.writeText(link);
                          toast.success('Payment link copied!');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                        <span className="sm:hidden">Copy</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 flex-1 sm:flex-initial"
                        onClick={() => navigate(`/zirokash/${form.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
