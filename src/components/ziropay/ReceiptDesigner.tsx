import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, Shield, X, Plus, Printer, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Receipt, 
  ReceiptTemplate, 
  FormField, 
  FieldMapping, 
  generateUniqueReceiptNumber, 
  generateVerificationCode 
} from "./Receipt";

interface ReceiptDesignerProps {
  template: ReceiptTemplate;
  onTemplateChange: (template: ReceiptTemplate) => void;
  logoUrl?: string;
  signatureUrl?: string;
  onLogoUpload: (url: string) => void;
  onSignatureUpload: (url: string) => void;
  formFields?: FormField[];
}

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

  const handlePrint = () => {
    const receiptElement = document.getElementById('designer-receipt-preview');
    if (!receiptElement) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get all style sheets
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt Preview</title>
          <style>
            ${styles}
            body { background: white; padding: 20px; }
            @media print { 
              body { padding: 0; margin: 0; }
              @page { size: auto; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto;">
            ${receiptElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Receipt Design</h3>
        <Button
          variant="outline"
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Edit Design" : "View Preview"}
        </Button>
      </div>

      {!previewMode ? (
        <div className="space-y-6">
          {/* Logo & Signature Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Institution Logo</Label>
              <div className="flex items-center gap-4">
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain border rounded" />
                )}
                <div className="flex-1">
                  <label htmlFor="logo-upload">
                    <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors text-xs">
                      <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      Upload Logo
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-logo"
                  checked={template.showLogo}
                  onCheckedChange={(checked) =>
                    onTemplateChange({ ...template, showLogo: checked as boolean })
                  }
                />
                <Label htmlFor="show-logo" className="text-xs cursor-pointer">Show logo</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Signature</Label>
              <div className="flex items-center gap-4">
                {signatureUrl && (
                  <img src={signatureUrl} alt="Signature" className="h-12 w-auto object-contain border rounded" />
                )}
                <div className="flex-1">
                  <label htmlFor="signature-upload">
                    <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors text-xs">
                      <ImageIcon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      Upload Signature
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-signature"
                  checked={template.showSignature}
                  onCheckedChange={(checked) =>
                    onTemplateChange({ ...template, showSignature: checked as boolean })
                  }
                />
                <Label htmlFor="show-signature" className="text-xs cursor-pointer">Show signature</Label>
              </div>
            </div>
          </div>

          {/* Texts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Header Text</Label>
              <Input
                value={template.headerText}
                onChange={(e) =>
                  onTemplateChange({ ...template, headerText: e.target.value })
                }
                placeholder="Official Receipt"
              />
            </div>
            <div className="space-y-2">
              <Label>Footer Text</Label>
              <Textarea
                value={template.footerText}
                onChange={(e) =>
                  onTemplateChange({ ...template, footerText: e.target.value })
                }
                placeholder="Thank you"
                rows={2}
              />
            </div>
          </div>

          {/* Fields Section */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              Receipt Fields <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fieldMappings.map((mapping) => {
                const formField = formFields.find(f => f.id === mapping.formFieldId);
                const isCustom = !formField;
                
                return (
                  <Card key={mapping.formFieldId} className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Checkbox
                          checked={mapping.showOnReceipt}
                          onCheckedChange={(checked) =>
                            updateFieldMapping(mapping.formFieldId, { showOnReceipt: checked as boolean })
                          }
                        />
                        <Input
                          value={mapping.receiptLabel}
                          onChange={(e) =>
                            updateFieldMapping(mapping.formFieldId, { receiptLabel: e.target.value })
                          }
                          className="h-8 text-xs"
                          placeholder="Label"
                        />
                      </div>
                      {isCustom && (
                        <Button variant="ghost" size="sm" onClick={() => removeFieldMapping(mapping.formFieldId)}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={addCustomField} className="w-full gap-2 text-xs">
              <Plus className="h-4 w-4" /> Add Custom Field
            </Button>
          </div>

          {/* Security Features */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Security Features
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm">Unique Numbering</Label>
                  <p className="text-[10px] text-muted-foreground">Standard for official receipts</p>
                </div>
                <Checkbox
                  checked={template.securityFeatures?.enableNumbering ?? true}
                  onCheckedChange={(checked) =>
                    onTemplateChange({
                      ...template,
                      securityFeatures: {
                        ...template.securityFeatures,
                        enableNumbering: checked as boolean,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm">QR Code</Label>
                  <p className="text-[10px] text-muted-foreground">Enable digital verification</p>
                </div>
                <Checkbox
                  checked={template.showQRCode}
                  onCheckedChange={(checked) =>
                    onTemplateChange({ ...template, showQRCode: checked as boolean })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm">Watermark</Label>
                  <p className="text-[10px] text-muted-foreground">Subtle "OFFICIAL" text</p>
                </div>
                <Checkbox
                  checked={template.securityFeatures?.showWatermark ?? false}
                  onCheckedChange={(checked) =>
                    onTemplateChange({
                      ...template,
                      securityFeatures: {
                        ...template.securityFeatures,
                        showWatermark: checked as boolean,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm">Security Border</Label>
                  <p className="text-[10px] text-muted-foreground">Fraud-prevention border</p>
                </div>
                <Checkbox
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
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print Receipt
            </Button>
          </div>
          <Receipt
            template={template}
            logoUrl={logoUrl}
            signatureUrl={signatureUrl}
            formFields={formFields}
            fieldMappings={fieldMappings}
            receiptNumber={generateUniqueReceiptNumber(template.securityFeatures?.receiptNumberPrefix)}
            verificationCode={generateVerificationCode()}
            transactionId={`DEMO-${Math.random().toString(36).substring(7).toUpperCase()}`}
            date={new Date()}
          />
        </div>
      )}
    </div>
  );
}
