import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Download, Receipt as ReceiptIcon, DollarSign, Activity, ArrowRight } from "lucide-react";
import { 
  Receipt, 
  getDeterministicReceiptNumber,
  getDeterministicVerificationCode
} from "@/components/zirokash/Receipt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

  // State for receipt date
  const [receiptDate] = useState(new Date());

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
          setStatus('success');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
    }
  };

  // Automatic download removed as per user request to let users initiate it manually

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    const toastId = toast.loading("Preparing your premium receipt...");
    
    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 4, // Ultra-high resolution for professional printing
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 750, // Slightly wider for better text layout in PDF
        onclone: (clonedDoc) => {
          // Ensure receipt is visible and styled correctly during capture
          const clonedElement = clonedDoc.querySelector('[data-receipt-container]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.padding = '40px'; // Consistent padding
          }
        }
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt", // Use points for more precise scaling
        format: [canvas.width / 4, canvas.height / 4] // Fit PDF to the receipt's native size
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 4, canvas.height / 4, undefined, 'FAST');
      pdf.save(`ZiroKash-Receipt-${getDeterministicReceiptNumber(submission?.id)}.pdf`);
      
      toast.success("Receipt downloaded!", { id: toastId });
      
      // Auto-transition to promotion
      setTimeout(() => {
        setView('promotion');
      }, 2500);

    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Format error. Please try manual download.", { id: toastId });
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 font-medium tracking-widest uppercase text-xs"
          >
            Securing Transaction...
          </motion.p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-destructive/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Verification Pending</CardTitle>
              <CardDescription className="text-slate-600">
                The payment is still processing. Don't worry, your submission is safe. Please check your email in a few minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8 pt-4">
              <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => window.location.href = `/pay/${formId}`}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'receipt' ? (
        <motion.div 
          key="receipt"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-screen bg-slate-50 relative py-12 px-4 selection:bg-primary selection:text-white"
        >
          <div className="max-w-[700px] mx-auto space-y-10 relative z-10">
            {/* Header Success Message */}
            <div className="text-center space-y-4 pt-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 ring-8 ring-green-100"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              
              <div className="space-y-2">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
                >
                  Payment Confirmed
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-slate-500 font-medium max-w-sm mx-auto"
                >
                  Your payment to <span className="text-slate-900 font-bold underline decoration-primary/30 decoration-4">{form?.title}</span> has been successfully processed.
                </motion.p>
              </div>
            </div>

            {/* Receipt Component */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.8, bounce: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent rounded-[40px] blur-3xl -z-10" />
              <div ref={receiptRef} className="overflow-visible">
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
                  receiptNumber={getDeterministicReceiptNumber(submission?.id)}
                  verificationCode={getDeterministicVerificationCode(submission?.id)}
                  transactionId={submission?.id || reference || "N/A"}
                  date={receiptDate}
                />
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4"
            >
              <Button 
                size="lg"
                className="w-full sm:w-auto px-10 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                Save as PDF
              </Button>
              <Button 
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto h-14 rounded-2xl text-slate-600 font-bold hover:bg-slate-200/50"
                onClick={() => setView('promotion')}
              >
                Go to ZiroKash
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            <p className="text-center text-xs font-bold text-slate-400 tracking-widest uppercase">
              Securely Powered by ZiroKash • 256-bit SSL Encrypted
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="promotion"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
        >
          {/* Background Aura */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(55,48,163,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Promo Content */}
            <div className="space-y-10 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Join 500+ Businesses in Ghana
              </motion.div>
              
              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl sm:text-7xl font-black text-white leading-tight tracking-tighter"
                >
                  Sell <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent italic">Faster</span>.<br />Collect <span className="underline decoration-indigo-500/40">Smarter</span>.
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  Create high-converting payment pages like the one you just used in seconds. No coding, no hassle.
                </motion.p>
              </div>

              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { title: "No Fees", desc: "Pass charges to customers", icon: <DollarSign className="h-5 w-5" /> },
                  { title: "Quick Setup", desc: "Live in under 2 minutes", icon: <Activity className="h-5 w-5" /> },
                  { title: "Auto-Billing", desc: "Digital professional receipts", icon: <ReceiptIcon className="h-5 w-5" /> }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center lg:text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3 mx-auto lg:mx-0">
                      {item.icon}
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-[10px] sm:text-xs leading-tight font-medium uppercase tracking-wider">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4"
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-12 h-16 rounded-2xl text-xl font-black bg-gradient-to-r from-primary to-indigo-600 hover:scale-[1.05] active:scale-95 shadow-2xl shadow-primary/40 transition-all group"
                  asChild
                >
                  <a href="/auth">
                    Create My Store Now
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </a>
                </Button>
                <Button 
                  variant="link" 
                  className="text-slate-500 font-bold hover:text-white transition-colors"
                  onClick={() => setView('receipt')}
                >
                  Wait, show my receipt
                </Button>
              </motion.div>
            </div>

            {/* Visual Part */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.5, bounce: 0.4 }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-20 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                <img 
                  src="/images/merchant_hero.png" 
                  alt="ZiroKash Merchant Success" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Float Card Overlay */}
                <motion.div 
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 3 }}
                  className="absolute bottom-8 right-8 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-slate-950 font-bold text-sm">Sale Credited!</h5>
                    <p className="text-slate-500 text-xs">+₵250.00 Received</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-700 text-[10px] font-black tracking-[1em] uppercase">
            Designed for Greatness
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
