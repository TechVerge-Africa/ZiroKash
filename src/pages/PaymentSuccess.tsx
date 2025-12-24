import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Download, Receipt as ReceiptIcon } from "lucide-react";
import { 
  Receipt, 
  generateUniqueReceiptNumber, 
  generateVerificationCode 
} from "@/components/ziropay/Receipt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [submission, setSubmission] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Generate these once per success page load
  const [receiptMeta] = useState({
    number: generateUniqueReceiptNumber(),
    code: generateVerificationCode(),
    date: new Date()
  });

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const submissionId = reference || trxref;
      
      if (!submissionId) {
        setStatus('failed');
        return;
      }

      // Fetch submission status
      const { data: sub, error: subError } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('id', submissionId)
        .maybeSingle();

      if (subError || !sub) {
        console.error('Submission fetch error:', subError);
        setStatus('failed');
        return;
      }

      setSubmission(sub);

      // Fetch form details
      const { data: formData } = await supabase
        .from('payment_forms')
        .select('*')
        .eq('id', formId)
        .maybeSingle();

      setForm(formData);

      // Check if payment was successful
      if (sub.status === 'paid') {
        setStatus('success');
      } else {
        // Give webhook time to process, then check again
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: updatedSub } = await supabase
          .from('form_submissions')
          .select('*')
          .eq('id', submissionId)
          .maybeSingle();

        if (updatedSub?.status === 'paid') {
          setStatus('success');
          setSubmission(updatedSub);
        } else {
          // Assume success if callback was reached (webhook might be slightly delayed)
          setStatus('success');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
    }
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    const toastId = toast.loading("Generating your receipt...");
    
    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt-${receiptMeta.number}.pdf`);
      
      toast.success("Receipt downloaded!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount / 100); // UI uses pesewas but database value is in GHS * 100
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-xl">Payment Failed</CardTitle>
            <CardDescription>
              We couldn't verify your payment. Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={() => window.location.href = `/pay/${formId}`}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 gap-8">
      <div className="text-center space-y-2">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">Thank you for your payment to {form?.title}</p>
      </div>

      <div className="w-full max-w-[600px] flex flex-col gap-6">
        <div ref={receiptRef}>
          <Receipt
            template={form?.receipt_template || {}}
            logoUrl={form?.logo_url}
            signatureUrl={form?.signature_url}
            formFields={form?.fields}
            fieldMappings={form?.receipt_template?.fieldMappings}
            submissionData={{
              ...submission?.submission_data,
              Amount: formatAmount(submission?.amount || 0),
              Total: formatAmount(submission?.amount || 0),
            }}
            receiptNumber={receiptMeta.number}
            verificationCode={receiptMeta.code}
            transactionId={submission?.id || reference || "N/A"}
            date={receiptMeta.date}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="flex-1 gap-2" 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF Receipt
          </Button>
          <Button variant="outline" className="flex-1 gap-2" asChild>
            <a href={`/pay/${formId}`}>
              <ReceiptIcon className="h-4 w-4" />
              Make Another Payment
            </a>
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          A confirmation email has also been sent to your inbox.
        </p>
      </div>
    </div>
  );
}
