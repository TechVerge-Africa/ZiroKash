import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Shield, CheckCircle2, X, Plus, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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

interface ReceiptDesignerProps {
  template: ReceiptTemplate;
  onTemplateChange: (template: ReceiptTemplate) => void;
  logoUrl?: string;
  signatureUrl?: string;
  onLogoUpload: (url: string) => void;
  onSignatureUpload: (url: string) => void;
  formFields?: FormField[];
}

// Generate unique receipt number (non-sequential, hard to guess)
const generateUniqueReceiptNumber = (prefix: string = "REC"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const hash = btoa(`${timestamp}-${random}`).substring(0, 8).replace(/[^A-Z0-9]/g, '');
  return `${prefix}-${hash}-${random}`;
};

// Generate verification code
const generateVerificationCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export function ReceiptDesigner({
  template,
  onTemplateChange,
  logoUrl,
  signatureUrl,
  onLogoUpload,
  onSignatureUpload,
  formFields = [],
}: ReceiptDesignerProps) {
  const [previewMode, setPreviewMode] = useState(false);
  
  // Initialize field mappings if not exists
  const fieldMappings = template.fieldMappings || formFields.map(field => ({
    formFieldId: field.id,
    receiptLabel: field.label,
    showOnReceipt: field.type === "amount" || field.type === "email" || field.type === "text",
  }));

  const updateFieldMapping = (formFieldId: string, updates: Partial<FieldMapping>) => {
    const updatedMappings = fieldMappings.map(mapping =>
      mapping.formFieldId === formFieldId ? { ...mapping, ...updates } : mapping
    );
    onTemplateChange({
      ...template,
      fieldMappings: updatedMappings,
    });
  };

  const addCustomField = () => {
    const newMapping: FieldMapping = {
      formFieldId: `custom-${Date.now()}`,
      receiptLabel: "Custom Field",
      showOnReceipt: true,
    };
    onTemplateChange({
      ...template,
      fieldMappings: [...fieldMappings, newMapping],
    });
  };

  const removeFieldMapping = (formFieldId: string) => {
    onTemplateChange({
      ...template,
      fieldMappings: fieldMappings.filter(m => m.formFieldId !== formFieldId),
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "signature"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === "logo") {
        onLogoUpload(base64String);
      } else {
        onSignatureUpload(base64String);
      }
      toast.success(`${type === "logo" ? "Logo" : "Signature"} uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Receipt Design</h3>
        <Button
          variant="outline"
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Edit" : "Preview"}
        </Button>
      </div>

      {!previewMode ? (
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Institution Logo</Label>
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
              )}
              <div className="flex-1">
                <label htmlFor="logo-upload">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload logo (Max 2MB)
                    </p>
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "logo")}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="show-logo"
                checked={template.showLogo}
                onCheckedChange={(checked) =>
                  onTemplateChange({ ...template, showLogo: checked as boolean })
                }
              />
              <Label htmlFor="show-logo" className="cursor-pointer">Show logo on receipt</Label>
            </div>
          </div>

          {/* Signature Upload */}
          <div className="space-y-2">
            <Label>Authorized Signature</Label>
            <div className="flex items-center gap-4">
              {signatureUrl && (
                <img src={signatureUrl} alt="Signature" className="h-16 w-auto object-contain border rounded p-2" />
              )}
              <div className="flex-1">
                <label htmlFor="signature-upload">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <ImageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload signature (Max 2MB)
                    </p>
                  </div>
                  <input
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "signature")}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="show-signature"
                checked={template.showSignature}
                onCheckedChange={(checked) =>
                  onTemplateChange({ ...template, showSignature: checked as boolean })
                }
              />
              <Label htmlFor="show-signature" className="cursor-pointer">Show signature on receipt</Label>
            </div>
          </div>

          {/* Header Text */}
          <div className="space-y-2">
            <Label>Receipt Header Text</Label>
            <Input
              value={template.headerText}
              onChange={(e) =>
                onTemplateChange({ ...template, headerText: e.target.value })
              }
              placeholder="e.g., Official Payment Receipt"
            />
          </div>

          {/* Footer Text */}
          <div className="space-y-2">
            <Label>Receipt Footer Text</Label>
            <Textarea
              value={template.footerText}
              onChange={(e) =>
                onTemplateChange({ ...template, footerText: e.target.value })
              }
              placeholder="e.g., Thank you for your payment. For inquiries, contact support@institution.com"
              rows={3}
            />
          </div>

          {/* Form Fields Mapping */}
          {formFields.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Include Form Fields on Receipt</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select which form fields should appear on the receipt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="space-y-3">
                {fieldMappings.map((mapping) => {
                  const formField = formFields.find(f => f.id === mapping.formFieldId);
                  const isCustom = !formField;
                  
                  return (
                    <Card key={mapping.formFieldId} className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={mapping.showOnReceipt}
                            onCheckedChange={(checked) =>
                              updateFieldMapping(mapping.formFieldId, { showOnReceipt: checked as boolean })
                            }
                          />
                          <div className="flex-1">
                            {isCustom ? (
                              <Input
                                value={mapping.receiptLabel}
                                onChange={(e) =>
                                  updateFieldMapping(mapping.formFieldId, { receiptLabel: e.target.value })
                                }
                                placeholder="Field label"
                                className="h-8"
                              />
                            ) : (
                              <>
                                <Label className="font-medium">{formField.label}</Label>
                                <Input
                                  value={mapping.receiptLabel}
                                  onChange={(e) =>
                                    updateFieldMapping(mapping.formFieldId, { receiptLabel: e.target.value })
                                  }
                                  placeholder="Label on receipt"
                                  className="h-8 mt-1"
                                />
                              </>
                            )}
                            {formField && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {formField.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFieldMapping(mapping.formFieldId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Field
                </Button>
              </div>
            </div>
          )}

          {/* Security Features */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Security Features</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enable security features to prevent receipt forgery</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-numbering">Unique Receipt Numbering</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate non-sequential, unique receipt numbers
                  </p>
                </div>
                <Checkbox
                  id="enable-numbering"
                  checked={template.securityFeatures?.enableNumbering ?? true}
                  onCheckedChange={(checked) =>
                    onTemplateChange({
                      ...template,
                      securityFeatures: {
                        ...template.securityFeatures,
                        enableNumbering: checked as boolean,
                        receiptNumberPrefix: template.securityFeatures?.receiptNumberPrefix || "REC",
                      },
                    })
                  }
                />
              </div>

              {template.securityFeatures?.enableNumbering && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="receipt-prefix">Receipt Number Prefix</Label>
                  <Input
                    id="receipt-prefix"
                    value={template.securityFeatures?.receiptNumberPrefix || "REC"}
                    onChange={(e) =>
                      onTemplateChange({
                        ...template,
                        securityFeatures: {
                          ...template.securityFeatures,
                          receiptNumberPrefix: e.target.value,
                        },
                      })
                    }
                    placeholder="REC"
                    className="max-w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: {generateUniqueReceiptNumber(template.securityFeatures?.receiptNumberPrefix || "REC")}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-watermark">Watermark</Label>
                  <p className="text-xs text-muted-foreground">
                    Add a watermark to prevent copying
                  </p>
                </div>
                <Checkbox
                  id="show-watermark"
                  checked={template.securityFeatures?.showWatermark ?? false}
                  onCheckedChange={(checked) =>
                    onTemplateChange({
                      ...template,
                      securityFeatures: {
                        ...template.securityFeatures,
                        showWatermark: checked as boolean,
                        watermarkText: template.securityFeatures?.watermarkText || "OFFICIAL",
                      },
                    })
                  }
                />
              </div>

              {template.securityFeatures?.showWatermark && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="watermark-text">Watermark Text</Label>
                  <Input
                    id="watermark-text"
                    value={template.securityFeatures?.watermarkText || "OFFICIAL"}
                    onChange={(e) =>
                      onTemplateChange({
                        ...template,
                        securityFeatures: {
                          ...template.securityFeatures,
                          watermarkText: e.target.value,
                        },
                      })
                    }
                    placeholder="OFFICIAL"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-border">Security Border</Label>
                  <p className="text-xs text-muted-foreground">
                    Add a decorative border to prevent tampering
                  </p>
                </div>
                <Checkbox
                  id="show-border"
                  checked={template.securityFeatures?.showSecurityBorder ?? true}
                  onCheckedChange={(checked) =>
                    onTemplateChange({
                      ...template,
                      securityFeatures: {
                        ...template.securityFeatures,
                        showSecurityBorder: checked as boolean,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-barcode">Barcode at Bottom</Label>
                  <p className="text-xs text-muted-foreground">
                    Add a barcode for quick verification
                  </p>
                </div>
                <Checkbox
                  id="show-barcode"
                  checked={template.securityFeatures?.showBarcodeBottom ?? false}
                  onCheckedChange={(checked) =>
                    onTemplateChange({
                      ...template,
                      securityFeatures: {
                        ...template.securityFeatures,
                        showBarcodeBottom: checked as boolean,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* QR Code Option */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="show-qr">QR Code for Verification</Label>
              <p className="text-xs text-muted-foreground">
                Include QR code that links to verification page
              </p>
            </div>
            <Checkbox
              id="show-qr"
              checked={template.showQRCode}
              onCheckedChange={(checked) =>
                onTemplateChange({ ...template, showQRCode: checked as boolean })
              }
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const receiptElement = document.getElementById('receipt-preview');
                if (receiptElement) {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    // Clone the element to preserve styles
                    const clonedElement = receiptElement.cloneNode(true) as HTMLElement;
                    
                    // Get computed styles
                    const styles = Array.from(document.styleSheets)
                      .map(sheet => {
                        try {
                          return Array.from(sheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('\n');
                        } catch (e) {
                          return '';
                        }
                      })
                      .join('\n');

                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Receipt - ${template.headerText || 'Payment Receipt'}</title>
                          <meta charset="utf-8">
                          <style>
                            ${styles}
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body { 
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                              padding: 20px; 
                              background: white; 
                              color: #000;
                            }
                            @media print { 
                              body { padding: 0; margin: 0; }
                              @page { margin: 0.5in; size: letter; }
                              * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                            }
                            img { max-width: 100%; height: auto; }
                            svg { max-width: 100%; height: auto; }
                          </style>
                        </head>
                        <body>
                          ${clonedElement.outerHTML}
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    setTimeout(() => {
                      printWindow.focus();
                      printWindow.print();
                    }, 250);
                  }
                }
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
          <ReceiptPreview
            template={template}
            logoUrl={logoUrl}
            signatureUrl={signatureUrl}
            formFields={formFields}
            fieldMappings={fieldMappings}
          />
        </div>
      )}
    </div>
  );
}

function ReceiptPreview({
  template,
  logoUrl,
  signatureUrl,
  formFields = [],
  fieldMappings = [],
}: {
  template: ReceiptTemplate;
  logoUrl?: string;
  signatureUrl?: string;
  formFields?: FormField[];
  fieldMappings?: FieldMapping[];
}) {
  const receiptNumber = generateUniqueReceiptNumber(template.securityFeatures?.receiptNumberPrefix || "REC");
  const verificationCode = generateVerificationCode();
  const visibleMappings = fieldMappings.filter(m => m.showOnReceipt);
  const transactionId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  const now = new Date();
  const verificationUrl = `https://ziropay.com/verify/${receiptNumber}?code=${verificationCode}`;

  // Generate barcode pattern based on receipt number
  const generateBarcodePattern = (text: string) => {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bars = [];
    for (let i = 0; i < 50; i++) {
      const seed = (hash + i * 7) % 100;
      bars.push({
        width: (seed % 3) + 1,
        height: 20 + (seed % 15),
        spacing: (seed % 2) + 1,
      });
    }
    return bars;
  };

  const barcodeBars = generateBarcodePattern(receiptNumber);

  return (
    <Card 
      id="receipt-preview"
      className={`bg-white relative overflow-hidden shadow-lg print:shadow-none ${
        template.securityFeatures?.showSecurityBorder 
          ? "border-4 border-dashed border-primary/40 print:border-primary" 
          : "border-2 border-border"
      }`}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      {/* Watermark */}
      {template.securityFeatures?.showWatermark && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] print:opacity-[0.05]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg, 
              transparent, 
              transparent 50px, 
              currentColor 50px, 
              currentColor 100px
            )`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p 
              className="text-7xl font-black transform -rotate-45 text-gray-400 print:text-gray-300 select-none"
              style={{ 
                letterSpacing: '0.1em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {template.securityFeatures?.watermarkText || "OFFICIAL"}
            </p>
          </div>
        </div>
      )}
      
      <CardContent className="p-8 print:p-6 space-y-6 relative z-10 text-gray-900 print:text-black">
        {/* Logo */}
        {template.showLogo && logoUrl && (
          <div className="flex justify-center mb-2">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-24 w-auto object-contain print:h-20" 
            />
          </div>
        )}

        {/* Header */}
        <div className="text-center border-b border-gray-300 print:border-gray-400 pb-5 print:pb-4">
          <h2 className="text-3xl font-bold tracking-tight mb-3 print:text-2xl text-gray-900 print:text-black">
            {template.headerText || "Payment Receipt"}
          </h2>
          {template.securityFeatures?.enableNumbering !== false && (
            <div className="mt-3 space-y-2">
              <p className="text-base font-mono font-bold text-primary print:text-blue-600 tracking-wide">
                Receipt #{receiptNumber}
              </p>
              <p className="text-xs text-gray-600 print:text-gray-700 font-medium">
                Verification Code: <span className="font-mono text-gray-800 print:text-black">{verificationCode}</span>
              </p>
            </div>
          )}
        </div>

        {/* Payment Details - Standard Fields */}
        <div className="grid grid-cols-2 gap-6 text-sm print:gap-4">
          <div className="space-y-1">
            <p className="text-gray-600 print:text-gray-700 text-xs font-medium uppercase tracking-wide">Date</p>
            <p className="font-semibold text-base text-gray-900 print:text-black">
              {now.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-gray-600 print:text-gray-700">
              {now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 print:text-gray-700 text-xs font-medium uppercase tracking-wide">Transaction ID</p>
            <p className="font-semibold font-mono text-sm break-all text-gray-900 print:text-black">{transactionId}</p>
          </div>
        </div>

        {/* Form Fields Data */}
        {visibleMappings.length > 0 && (
          <div className="border-t border-gray-300 print:border-gray-400 pt-5 print:pt-4">
            <h3 className="font-semibold text-base mb-4 print:text-sm uppercase tracking-wide text-gray-700 print:text-gray-800">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm print:gap-3">
              {visibleMappings.map((mapping) => {
                const formField = formFields.find(f => f.id === mapping.formFieldId);
                let sampleValue = "Sample Data";
                
                if (formField) {
                  if (formField.type === "amount") {
                    sampleValue = "₵1,000.00";
                  } else if (formField.type === "email") {
                    sampleValue = "payer@example.com";
                  } else if (formField.type === "text") {
                    sampleValue = formField.label.includes("Name") ? "John Doe" : "Sample Text";
                  } else if (formField.type === "dropdown" && formField.options) {
                    sampleValue = formField.options[0];
                  }
                } else {
                  sampleValue = "Custom Value";
                }

                return (
                  <div key={mapping.formFieldId} className="flex justify-between items-start py-2 border-b border-gray-200 print:border-gray-300 last:border-0">
                    <p className="text-gray-600 print:text-gray-700 font-medium">{mapping.receiptLabel}</p>
                    <p className="font-semibold text-right max-w-[60%] break-words text-gray-900 print:text-black">{sampleValue}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Amount - Highlighted */}
        <div className="border-y-2 border-primary/20 print:border-gray-400 py-5 print:py-4 bg-primary/5 print:bg-transparent rounded-lg print:rounded-none">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold print:text-lg text-gray-900 print:text-black">Amount Paid</span>
            <span className="text-3xl font-extrabold text-primary print:text-blue-600 print:text-2xl">₵1,000.00</span>
          </div>
        </div>

        {/* Signature */}
        {template.showSignature && signatureUrl && (
          <div className="flex justify-end pt-2">
            <div className="text-center space-y-2">
              <div className="border-t-2 border-gray-300 print:border-gray-400 pt-3 inline-block">
                <img 
                  src={signatureUrl} 
                  alt="Signature" 
                  className="h-20 w-auto object-contain mb-2 print:h-16" 
                />
                <p className="text-xs text-gray-600 print:text-gray-700 font-medium">
                  Authorized Signature
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QR Code */}
        {template.showQRCode && (
          <div className="flex flex-col items-center space-y-3 border-t border-gray-300 print:border-gray-400 pt-6 print:pt-4">
            <div className="p-3 bg-white border-2 border-gray-300 print:border-gray-400 rounded-lg print:p-2 print:p-1">
              <div className="w-32 h-32 print:w-24 print:h-24">
                <QRCodeSVG
                  value={verificationUrl}
                  size={128}
                  level="M"
                  includeMargin={true}
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-gray-900 print:text-black">
                Scan to verify receipt authenticity
              </p>
              <p className="text-[10px] text-gray-600 print:text-gray-700 font-mono break-all max-w-[200px] print:text-[8px]">
                {verificationUrl}
              </p>
            </div>
          </div>
        )}

        {/* Barcode at Bottom */}
        {template.securityFeatures?.showBarcodeBottom && (
          <div className="border-t border-gray-300 print:border-gray-400 pt-6 print:pt-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-20 w-full bg-white border-2 border-gray-300 print:border-gray-400 rounded print:h-16 flex items-center justify-center px-4">
                <div className="flex items-end gap-[2px] h-full">
                  {barcodeBars.map((bar, i) => (
                    <div
                      key={i}
                      className="bg-gray-900 print:bg-black"
                      style={{
                        width: `${bar.width}px`,
                        height: `${bar.height}px`,
                        minWidth: '1px',
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-700 print:text-gray-800 font-mono font-semibold tracking-wider">
                {receiptNumber}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {template.footerText && (
          <div className="text-center text-xs text-gray-600 print:text-gray-700 border-t border-gray-300 print:border-gray-400 pt-5 print:pt-4 leading-relaxed">
            <p className="whitespace-pre-line">{template.footerText}</p>
          </div>
        )}

        {/* Print-only footer note */}
        <div className="hidden print:block text-center text-[10px] text-gray-600 print:text-gray-700 mt-4 pt-4 border-t border-gray-300 print:border-gray-400">
          <p>This is an official receipt. Keep for your records.</p>
        </div>
      </CardContent>
    </Card>
  );
}
