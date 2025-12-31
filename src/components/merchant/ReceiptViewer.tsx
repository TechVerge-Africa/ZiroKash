
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

interface ReceiptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any; // Type this properly later
}

export function ReceiptViewer({ isOpen, onClose, transaction }: ReceiptViewerProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200] // Receipt roll size approximation
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${transaction.id}.pdf`);
      toast.success("Receipt downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download receipt");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
          <DialogDescription>
            Digital receipt for transaction #{transaction.id?.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-4 bg-muted/50 rounded-lg flex justify-center">
            <div 
              ref={receiptRef}
              className="bg-white text-black p-6 w-full max-w-[320px] mx-auto shadow-sm text-sm font-mono leading-relaxed"
            >
                {/* Header */}
                <div className="text-center mb-6 border-b pb-4 border-dashed border-gray-300">
                    <h3 className="text-xl font-bold mb-1">{transaction.form_title || "Merchant Payment"}</h3>
                    <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Ref: {transaction.reference || transaction.id}</p>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                    {transaction.metadata?.name && (
                         <div className="flex justify-between">
                            <span className="text-gray-600">Payer:</span>
                            <span className="font-semibold">{transaction.metadata.name}</span>
                        </div>
                    )}
                     <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-semibold">{transaction.channel || "Mobile Money"}</span>
                    </div>
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₵{(transaction.amount / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Status:</span>
                        <span className="uppercase">{transaction.status}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
                    <p>Powered by ZiroPay</p>
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </ScrollArea>

        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
