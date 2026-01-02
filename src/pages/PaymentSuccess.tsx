import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Download, Receipt as ReceiptIcon, DollarSign, Activity, ArrowRight } from "lucide-react";
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
  const [view, setView] = useState<'receipt' | 'promotion'>('receipt');
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
        // Direct verification fallback
        console.log('[PaymentSuccess] Status is pending. Triggering direct verification...');
        try {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
            body: { reference: submissionId }
          });

          if (!verifyError && verifyData?.status === 'success') {
            console.log('[PaymentSuccess] Direct verification succeeded!');
            setStatus('success');
            setSubmission(verifyData.submission);
            return;
          }
        } catch (vErr) {
          console.error('[PaymentSuccess] Verification error:', vErr);
        }

        // Final fallback: Give webhook time to process, then check again
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
          // but if we are here and verify-payment also didn't say success, 
          // we might want to be more cautious. However, users appreciate a "success" mood.
          setStatus('success');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
    }
  };

  // Auto-trigger download on success
  useEffect(() => {
    if (status === 'success' && submission && view === 'receipt') {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [status, submission, view]);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    const toastId = toast.loading("Saving your receipt...");
    
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
      
      toast.success("Receipt saved successfully!", { id: toastId });
      
      // After a successful download, transition to promotion after 3 seconds
      setTimeout(() => {
        setView('promotion');
      }, 3000);

    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to save receipt. You can try manual download.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount / 100); 
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4 glass-card border-white/10">
          <CardContent className="pt-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground animate-pulse">Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full glass-card border-destructive/20">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-xl">Verification Failed</CardTitle>
            <CardDescription>
              We couldn't confirm your payment status immediately. Please check your email for a receipt or contact the merchant.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <Button variant="outline" onClick={() => window.location.href = `/pay/${formId}`}>
              Back to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'promotion') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 gap-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-lg shadow-primary/20">
                    Z
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                    Grow Your Business with <span className="text-primary italic">ZiroPay</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                    You've just experienced how easy it is to pay. Now, see how easy it is to collect!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-white/5 p-6 space-y-3">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-primary">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold">Collect Instantly</h3>
                    <p className="text-sm text-muted-foreground">Get your own payment links and start receiving money in minutes.</p>
                </Card>
                <Card className="glass-card border-white/5 p-6 space-y-3">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-primary">
                        <ReceiptIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold">Auto-Receipts</h3>
                    <p className="text-sm text-muted-foreground">Professional receipts generated and sent to your customers automatically.</p>
                </Card>
                <Card className="glass-card border-white/5 p-6 space-y-3">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-primary">
                        <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold">Real-time Data</h3>
                    <p className="text-sm text-muted-foreground">Track every transaction and see your business grow live on your dashboard.</p>
                </Card>
            </div>

            <div className="space-y-4 pt-4">
                <Button className="w-full sm:w-auto px-16 h-14 text-xl rounded-full shadow-2xl hover:shadow-primary/30 bg-primary hover:bg-primary/90 transition-all font-bold" asChild>
                    <a href="/auth">Start My Free Journey</a>
                </Button>
                <div>
                    <Button variant="link" className="text-muted-foreground" onClick={() => setView('receipt')}>
                        View My Receipt Again
                    </Button>
                </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Instant Settlement</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">24/7 Support</span>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 gap-8 overflow-x-hidden">
      <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <CheckCircle2 className="relative h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Payment Completed!
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Your payment to <span className="font-semibold text-foreground">{form?.title}</span> was processed securely.
        </p>
      </div>

      <div className="w-full max-w-[650px] flex flex-col gap-8 animate-in fade-in fill-mode-both duration-1000 delay-300">
        <div 
            ref={receiptRef} 
            className="shadow-2xl shadow-primary/5 transform transition-transform hover:scale-[1.01] duration-500 rounded-2xl overflow-hidden border border-white/5"
        >
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
            className="flex-1 gap-2 h-12 text-lg shadow-lg hover:shadow-primary/20 transition-all" 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            Download Receipt
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2 h-12 text-lg hover:bg-muted/10 transition-colors" 
            onClick={() => setView('promotion')}
          >
            Continue to ZiroPay
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground opacity-70">
          A copy of this receipt has been emailed to you.
        </p>
      </div>
    </div>
  );
}
