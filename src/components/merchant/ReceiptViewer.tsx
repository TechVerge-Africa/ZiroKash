
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Share2, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { useRef } from "react";
import { Receipt, ReceiptTemplate, getDeterministicReceiptNumber, getDeterministicVerificationCode } from "@/components/zirokash/Receipt";

interface ReceiptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any; // Type this properly later
}

export function ReceiptViewer({ isOpen, onClose, transaction }: ReceiptViewerProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !receiptRef.current) {
        toast.error("Failed to open print window");
        return;
    }

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
          <title>Receipt - ${transaction.id?.slice(0, 8)}</title>
          <style>
            ${styles}
            body { background: white; padding: 20px; font-family: sans-serif; }
            @media print { 
              body { padding: 0; margin: 0; }
              @page { size: auto; margin: 0; }
              .print-hidden { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto;">
            ${receiptRef.current.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      const container = receiptRef.current.querySelector('[data-receipt-container="true"]');
      if (!container) throw new Error("Receipt container not found");

      // Capture at higher scale for better quality
      const canvas = await html2canvas(container as HTMLElement, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowHeight: (container as HTMLElement).scrollHeight,
        windowWidth: (container as HTMLElement).scrollWidth
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit on one page
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth, finalHeight, xOffset = 0, yOffset = 0;
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider - fit to width
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgAspectRatio;
        yOffset = (pdfHeight - finalHeight) / 2;
      } else {
        // Image is taller - fit to height
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * imgAspectRatio;
        xOffset = (pdfWidth - finalWidth) / 2;
      }
      
      pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`receipt-${transaction.id?.slice(0, 8)}.pdf`);
      toast.success("Receipt downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download receipt");
    }
  };

  const defaultTemplate: ReceiptTemplate = {
    headerText: transaction.form_title || "Official Receipt",
    footerText: "Thank you for your business.",
    showLogo: true,
    showSignature: true,
    showQRCode: true,
    customFields: [],
    securityFeatures: {
      showWatermark: true,
      watermarkText: "OFFICIAL",
      showSecurityBorder: true,
      showBarcodeBottom: true,
      enableNumbering: true
    }
  };

  const template = transaction.receipt_template || defaultTemplate;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden border-none glass-card">
        <DialogHeader className="p-4 sm:p-6 pb-2 border-b border-white/10">
          <DialogTitle>Transaction Receipt</DialogTitle>
          <DialogDescription>
            Digital receipt for transaction #{transaction.id?.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 p-4 sm:p-8">
          <div ref={receiptRef} className="mx-auto max-w-full flex justify-center">
            <Receipt
              template={template}
              logoUrl={transaction.logo_url}
              signatureUrl={transaction.signature_url}
              formFields={transaction.form_fields || []}
              fieldMappings={template.fieldMappings || []}
              submissionData={{
                ...transaction.submission_data,
                "Amount Paid": `GHS ${((transaction.net_amount || transaction.amount) / 100).toFixed(2)}`,
                "Amount": `GHS ${((transaction.net_amount || transaction.amount) / 100).toFixed(2)}`,
                "Total": `GHS ${((transaction.net_amount || transaction.amount) / 100).toFixed(2)}`,
                "Payer Name": transaction.payer_name,
                "Payer Email": transaction.payer_email,
              }}
              receiptNumber={getDeterministicReceiptNumber(transaction.id)}
              verificationCode={getDeterministicVerificationCode(transaction.id)}
              transactionId={transaction.transaction_id || transaction.id}
              date={new Date(transaction.created_at)}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end p-6 pt-2 border-t mt-auto">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload} className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
