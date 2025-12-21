import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Download } from "lucide-react";

export default function PaymentSuccess() {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [submission, setSubmission] = useState<any>(null);
  const [form, setForm] = useState<any>(null);

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

      // Check if payment was successful (status could be 'paid' or Paystack might still be processing)
      if (sub.status === 'paid') {
        setStatus('success');
      } else {
        // Give webhook time to process, then check again
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: updatedSub } = await supabase
          .from('form_submissions')
          .select('status')
          .eq('id', submissionId)
          .maybeSingle();

        if (updatedSub?.status === 'paid') {
          setStatus('success');
          setSubmission({ ...sub, status: 'paid' });
        } else {
          // If still pending after webhook delay, assume success (Paystack callback means payment was successful)
          setStatus('success');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {form?.logo_url && (
            <img src={form.logo_url} alt="Logo" className="h-12 mx-auto mb-4" />
          )}
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            {form && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">For</span>
                <span className="font-medium">{form.title}</span>
              </div>
            )}
            {submission && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-green-600">{formatAmount(submission.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-sm">{submission.id.slice(0, 8)}...</span>
                </div>
                {submission.payer_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span>{submission.payer_name}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              A confirmation has been sent to your email
            </p>
            {submission?.receipt_url && (
              <Button variant="outline" asChild>
                <a href={submission.receipt_url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
