import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

export interface FormField {
  id: string;
  type: "text" | "email" | "dropdown" | "amount";
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  isFixed?: boolean;
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

// Generate deterministic receipt number from submission ID
export const getDeterministicReceiptNumber = (id: string, prefix: string = "REC"): string => {
  if (!id) return `${prefix}-PENDING`;
  return `${prefix}-${id.slice(0, 8).toUpperCase()}`;
};

// Generate deterministic verification code from submission ID
export const getDeterministicVerificationCode = (id: string): string => {
  if (!id) return "VERIFY";
  return id.slice(-6).toUpperCase();
};

// Generate unique receipt number (fallback for previews/standalone use)
export const generateUniqueReceiptNumber = (prefix: string = "REC"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const hash = btoa(`${timestamp}-${random}`).substring(0, 8).replace(/[^A-Z0-9]/g, '');
  return `${prefix}-${hash}-${random}`;
};

// Generate verification code (fallback for previews/standalone use)
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
  const verificationUrl = `${window.location.origin}/verify/${receiptNumber}?code=${verificationCode}`;

  // Dynamic scaling for print to ensure it fits on one A4 page
  useEffect(() => {
    const handleBeforePrint = () => {
      const receiptElement = document.querySelector(`#${id}`) as HTMLElement;
      if (!receiptElement) return;

      // A4 dimensions in pixels at 96 DPI (standard screen DPI)
      const A4_HEIGHT_MM = 297;
      const A4_MARGIN_MM = 20; // 10mm top + 10mm bottom
      const AVAILABLE_HEIGHT_MM = A4_HEIGHT_MM - A4_MARGIN_MM;
      const MM_TO_PX = 3.7795275591; // 1mm = 3.78px at 96 DPI
      const maxHeight = AVAILABLE_HEIGHT_MM * MM_TO_PX;

      // Get actual height of content
      const actualHeight = receiptElement.scrollHeight;

      // Calculate scale factor if content is too tall
      if (actualHeight > maxHeight) {
        const scale = maxHeight / actualHeight;
        receiptElement.style.transform = `scale(${scale})`;
        receiptElement.style.transformOrigin = 'top center';
        receiptElement.style.marginBottom = `${(actualHeight * (1 - scale))}px`;
      }
    };

    const handleAfterPrint = () => {
      const receiptElement = document.querySelector(`#${id}`) as HTMLElement;
      if (receiptElement) {
        receiptElement.style.transform = '';
        receiptElement.style.marginBottom = '';
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [id]);

  // Generate barcode pattern based on receipt number
  const generateBarcodePattern = (text: string) => {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bars = [];
    for (let i = 0; i < 50; i++) {
      const seed = (hash + i * 7) % 100;
      bars.push({
        width: (seed % 3) + 1,
        height: 24 + (seed % 20),
        spacing: (seed % 2) + 1,
      });
    }
    return bars;
  };

  const barcodeBars = generateBarcodePattern(receiptNumber);

  return (
    <Card 
      id={id}
      data-receipt-container="true"
      className={`bg-white relative overflow-hidden shadow-2xl print:shadow-none w-full transition-all duration-300 ${
        template.securityFeatures?.showSecurityBorder 
          ? "border-4 border-dashed border-primary/30 print:border-black" 
          : "border border-slate-200"
      }`}
      style={{ 
        margin: '0 auto',
        // Print-specific styles to ensure it fits on one A4 page
        maxHeight: 'none',
      }}
    >
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          [data-receipt-container="true"] {
            max-height: 277mm !important; /* A4 height minus margins */
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
          
          /* Scale down content if it's too tall */
          [data-receipt-container="true"] > div {
            transform-origin: top center;
          }
          
          /* Hide scrollbars in print */
          * {
            overflow: visible !important;
          }
        }
      `}</style>
      {/* Premium Security Hologram / Watermark */}
      {template.securityFeatures?.showWatermark && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04] print:opacity-[0.05] overflow-hidden"
          style={{
            zIndex: 0,
            background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.02) 100%)`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden">
            <p 
              className="text-[60px] sm:text-[120px] font-black transform -rotate-45 text-slate-900 print:text-black whitespace-nowrap"
              style={{ 
                letterSpacing: '0.15em',
                textShadow: '0 0 10px rgba(0,0,0,0.05)'
              }}
            >
              {[...Array(5)].map(() => template.securityFeatures?.watermarkText || "OFFICIAL ").join(' ')}
            </p>
          </div>
        </div>
      )}
      
      <CardContent className="p-4 sm:p-6 print:p-4 space-y-4 print:space-y-3 relative z-10 text-slate-900 print:text-black">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-2 print:space-y-1">
          {/* Logo with Glow */}
          {template.showLogo && logoUrl && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 print:hidden"></div>
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="relative h-12 sm:h-16 w-auto object-contain print:h-12" 
              />
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl print:text-xl font-extrabold tracking-tight text-slate-900 print:text-black">
              {template.headerText || "Payment Receipt"}
            </h2>
            <div className="h-0.5 w-12 bg-primary mx-auto rounded-full print:hidden" />
          </div>

          {template.securityFeatures?.enableNumbering !== false && (
            <div className="flex flex-col items-center space-y-1">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary print:bg-transparent print:text-black print:border print:border-black">
                RECEIPT #{receiptNumber}
              </span>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-widest uppercase">
                Verification Code: <span className="text-slate-900 print:text-black font-bold">{verificationCode}</span>
              </p>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-3 print:py-2 border-y border-slate-100 print:border-slate-300">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Date</label>
            <p className="text-sm font-semibold">
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reference ID</label>
            <p className="text-sm font-mono font-bold break-all text-primary/80 print:text-black">
              {transactionId}
            </p>
          </div>
        </div>

        {/* Dynamic Fields Section */}
        {visibleMappings.length > 0 && (
          <div className="space-y-2 print:space-y-1">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Payment Information
            </h3>
            <div className="grid gap-2 print:gap-1">
              {visibleMappings.map((mapping) => {
                const formField = formFields.find(f => f.id === mapping.formFieldId);
                let value = submissionData[mapping.receiptLabel] || submissionData[formField?.label || ''] || "N/A";
                
                // Demo data fallback
                if (Object.keys(submissionData).length === 0) {
                  const demoValues: Record<string, string> = {
                    "amount": "₵1,000.00",
                    "email": "customer@example.com",
                    "text": "Sample Data",
                    "dropdown": "Option A"
                  };
                  value = demoValues[formField?.type || "text"];
                }

                return (
                  <div key={mapping.formFieldId} className="flex justify-between items-center py-1.5 sm:py-2 print:py-1 px-2 sm:px-3 print:px-0 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 print:bg-transparent print:border-none">
                    <span className="text-xs sm:text-sm font-medium text-slate-500">{mapping.receiptLabel}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 border-b-2 border-primary/20 print:border-none text-right">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Total Highlight */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 print:hidden"></div>
          <div className="relative bg-slate-900 text-white rounded-xl p-3 sm:p-4 print:p-3 flex flex-col sm:flex-row justify-between items-center gap-2 print:bg-white print:text-black print:border-2 print:border-black print:rounded-none">
            <span className="text-xs sm:text-lg font-bold uppercase tracking-widest opacity-80">Final Amount Paid</span>
            <div className="text-center sm:text-right">
              <span className="text-xl sm:text-3xl print:text-2xl font-black text-primary print:text-black">
                {submissionData.Amount || submissionData.Total || "₵1,000.00"}
              </span>
              <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-1 text-[10px] font-bold text-primary-foreground/60 print:text-black uppercase tracking-tighter">
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse print:hidden" />
                Transaction Verified
              </div>
            </div>
          </div>
        </div>

        {/* Footer Grid: Signature & QR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 print:pt-2">
          {/* Signature Area */}
          <div className="flex flex-col items-center sm:items-start justify-end px-4">
            {template.showSignature && signatureUrl && (
              <div className="text-center w-full max-w-[180px] space-y-2">
                <img 
                  src={signatureUrl} 
                  alt="Signature" 
                  className="h-12 w-auto object-contain mx-auto print:h-10" 
                />
                <div className="border-t-2 border-slate-200 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Area */}
          {template.showQRCode && (
            <div className="flex justify-center sm:justify-end">
              <div className="relative p-2 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:scale-105 group print:border-black print:rounded-none print:p-1">
                <QRCodeSVG
                  value={verificationUrl}
                  size={80}
                  level="H"
                  includeMargin={false}
                  className="w-20 h-20 sm:w-24 sm:h-24 print:w-20 print:h-20"
                  imageSettings={{
                    src: logoUrl || "",
                    x: undefined,
                    y: undefined,
                    height: 20,
                    width: 20,
                    excavate: true,
                  }}
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  SCAN TO VERIFY
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Barcode Decorative */}
        {template.securityFeatures?.showBarcodeBottom && (
          <div className="pt-4 overflow-hidden mask-fade-x print:hidden">
            <div className="flex items-end justify-center gap-0.5 h-10 opacity-30">
              {barcodeBars.map((bar, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: `${bar.width}px`, 
                    height: `${bar.height}px`,
                    marginLeft: `${bar.spacing}px`
                  }} 
                  className="bg-slate-900 rounded-full"
                />
              ))}
            </div>
            <p className="text-[8px] font-mono text-slate-400 text-center mt-1 tracking-[0.5em]">{receiptNumber}</p>
          </div>
        )}

        {/* Footer message */}
        <div className="text-center pt-2 print:pt-1">
          <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-t border-slate-100 pt-3 print:pt-2">
            {template.footerText || "This is an electronically generated document. Thank you for your business."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
