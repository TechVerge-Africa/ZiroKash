import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ReceiptTemplate {
  headerText: string;
  footerText: string;
  showLogo: boolean;
  showSignature: boolean;
  showQRCode: boolean;
  customFields: string[];
}

interface ReceiptDesignerProps {
  template: ReceiptTemplate;
  onTemplateChange: (template: ReceiptTemplate) => void;
  logoUrl?: string;
  signatureUrl?: string;
  onLogoUpload: (url: string) => void;
  onSignatureUpload: (url: string) => void;
}

export function ReceiptDesigner({
  template,
  onTemplateChange,
  logoUrl,
  signatureUrl,
  onLogoUpload,
  onSignatureUpload,
}: ReceiptDesignerProps) {
  const [previewMode, setPreviewMode] = useState(false);

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
              <input
                type="checkbox"
                id="show-logo"
                checked={template.showLogo}
                onChange={(e) =>
                  onTemplateChange({ ...template, showLogo: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="show-logo">Show logo on receipt</Label>
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
              <input
                type="checkbox"
                id="show-signature"
                checked={template.showSignature}
                onChange={(e) =>
                  onTemplateChange({ ...template, showSignature: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="show-signature">Show signature on receipt</Label>
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

          {/* QR Code Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-qr"
              checked={template.showQRCode}
              onChange={(e) =>
                onTemplateChange({ ...template, showQRCode: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="show-qr">Include QR code for verification</Label>
          </div>
        </div>
      ) : (
        <ReceiptPreview
          template={template}
          logoUrl={logoUrl}
          signatureUrl={signatureUrl}
        />
      )}
    </div>
  );
}

function ReceiptPreview({
  template,
  logoUrl,
  signatureUrl,
}: {
  template: ReceiptTemplate;
  logoUrl?: string;
  signatureUrl?: string;
}) {
  return (
    <Card className="bg-white">
      <CardContent className="p-8 space-y-6">
        {/* Logo */}
        {template.showLogo && logoUrl && (
          <div className="flex justify-center">
            <img src={logoUrl} alt="Logo" className="h-20 w-auto object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold">{template.headerText || "Payment Receipt"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Receipt #REC-{new Date().getFullYear()}-001
          </p>
        </div>

        {/* Sample Payment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Transaction ID</p>
            <p className="font-medium">TXN-123456789</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payer Name</p>
            <p className="font-medium">John Doe</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payment Method</p>
            <p className="font-medium">Mobile Money</p>
          </div>
        </div>

        {/* Amount */}
        <div className="border-y py-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Amount Paid</span>
            <span className="text-2xl font-bold">₵1,000.00</span>
          </div>
        </div>

        {/* Signature */}
        {template.showSignature && signatureUrl && (
          <div className="flex justify-end">
            <div className="text-center">
              <img src={signatureUrl} alt="Signature" className="h-16 w-auto object-contain mb-2" />
              <p className="text-xs text-muted-foreground border-t pt-1">Authorized Signature</p>
            </div>
          </div>
        )}

        {/* QR Code */}
        {template.showQRCode && (
          <div className="flex justify-center">
            <div className="border-2 p-4 rounded">
              <div className="w-24 h-24 bg-muted flex items-center justify-center">
                <p className="text-xs text-center text-muted-foreground">QR Code</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {template.footerText && (
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>{template.footerText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
