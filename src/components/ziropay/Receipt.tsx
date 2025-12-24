import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

export interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface FieldMapping {
  formFieldId: string;
  receiptLabel: string;
  showOnReceipt: boolean;
}

export interface ReceiptTemplate {
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

export interface ReceiptProps {
  id?: string;
  template: ReceiptTemplate;
  logoUrl?: string;
  signatureUrl?: string;
  formFields?: FormField[];
  fieldMappings?: FieldMapping[];
  submissionData?: Record<string, any>;
  receiptNumber: string;
  verificationCode: string;
  transactionId: string;
  date: Date;
}

// Generate unique receipt number (replicated from ReceiptDesigner for standalone use)
export const generateUniqueReceiptNumber = (prefix: string = "REC"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const hash = btoa(`${timestamp}-${random}`).substring(0, 8).replace(/[^A-Z0-9]/g, '');
  return `${prefix}-${hash}-${random}`;
};

// Generate verification code
export const generateVerificationCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export function Receipt({
  id = "receipt-content",
  template,
  logoUrl,
  signatureUrl,
  formFields = [],
  fieldMappings = [],
  submissionData = {},
  receiptNumber,
  verificationCode,
  transactionId,
  date,
}: ReceiptProps) {
  const visibleMappings = fieldMappings.filter(m => m.showOnReceipt);
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
      id={id}
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
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-gray-600 print:text-gray-700">
              {date.toLocaleTimeString('en-US', { 
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
                let value = submissionData[mapping.receiptLabel] || submissionData[formField?.label || ''] || "N/A";
                
                // Demo data for designer preview if no submission data is provided
                if (Object.keys(submissionData).length === 0) {
                  if (formField) {
                    if (formField.type === "amount") {
                      value = "₵1,000.00";
                    } else if (formField.type === "email") {
                      value = "payer@example.com";
                    } else if (formField.type === "text") {
                      value = formField.label.includes("Name") ? "John Doe" : "Sample Text";
                    } else if (formField.type === "dropdown" && formField.options) {
                      value = formField.options[0];
                    }
                  } else {
                    value = "Custom Value";
                  }
                }

                return (
                  <div key={mapping.formFieldId} className="flex justify-between items-start py-2 border-b border-gray-200 print:border-gray-300 last:border-0">
                    <p className="text-gray-600 print:text-gray-700 font-medium">{mapping.receiptLabel}</p>
                    <p className="font-semibold text-right max-w-[60%] break-words text-gray-900 print:text-black">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Total Amount */}
        <div className="border-y-2 border-primary/20 print:border-gray-400 py-5 print:py-4 bg-primary/5 print:bg-transparent rounded-lg print:rounded-none">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold print:text-lg text-gray-900 print:text-black">Amount Paid</span>
            <span className="text-3xl font-extrabold text-primary print:text-blue-600 print:text-2xl">
              {submissionData.Amount || submissionData.Total || "₵1,000.00"}
            </span>
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
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-800 print:text-black uppercase tracking-wider">Scan to Verify</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6 print:pt-4 border-t border-gray-200 print:border-gray-300">
          <p className="text-sm text-gray-700 print:text-black leading-relaxed whitespace-pre-wrap">
            {template.footerText || "Thank you for your payment"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
