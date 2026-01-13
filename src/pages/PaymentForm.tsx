import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface FormField {
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  isFixed?: boolean;
}

interface PaymentForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  logo_url: string | null;
  theme_color: string;
  fee_bearer: 'customer' | 'merchant';
}

export default function PaymentForm() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<PaymentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [originalAmount, setOriginalAmount] = useState<number>(0);
  const [processingFee, setProcessingFee] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const calculateProcessingFee = (amount: number): number => {
    if (!amount || amount <= 0) return 0;
    // New formula: base / 0.9805 - base (to ensure merchant gets exact base amount)
    const totalAmountWithFee = amount / 0.9805;
    const fee = totalAmountWithFee - amount;
    return Math.min(fee, 100); // Capped at GHS 100
  };

  useEffect(() => {
    if (form?.fee_bearer === 'customer') {
      const fee = calculateProcessingFee(originalAmount);
      setProcessingFee(fee);
      setTotalAmount(originalAmount + fee);
    } else {
      setProcessingFee(0);
      setTotalAmount(originalAmount);
    }
  }, [originalAmount, form?.fee_bearer]);

  useEffect(() => {
    // Check if PaystackPop is loaded
    const checkPaystack = () => {
      if (typeof window !== 'undefined' && (window as any).PaystackPop) {
        setPaystackLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkPaystack, 100);
      }
    };
    checkPaystack();
    
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_forms')
        .select('*')
        .eq('id', formId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      const fetchedForm = data as any;
      setForm(fetchedForm);
      
      // Initialize default values for all fields (especially fixed amounts)
      const initialFormData: Record<string, any> = {};
      let initialOriginalAmount = 0;

      if (fetchedForm.fields && Array.isArray(fetchedForm.fields)) {
        fetchedForm.fields.forEach((field: any) => {
          if (field.defaultValue) {
            initialFormData[field.label] = field.defaultValue;
            if (field.type === 'amount') {
              initialOriginalAmount = parseFloat(field.defaultValue) || 0;
            }
          }
        });
      }

      setFormData(prev => ({ ...prev, ...initialFormData }));
      if (initialOriginalAmount > 0) {
        setOriginalAmount(initialOriginalAmount);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Form not found or inactive');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Paystack is loaded
    if (!paystackLoaded) {
      toast.error('Payment system is still loading', {
        description: 'Please wait a moment and try again'
      });
      return;
    }
    
    setSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = form?.fields.filter(f => f.required) || [];
      for (const field of requiredFields) {
        if (!formData[field.label]) {
          toast.error(`${field.label} is required`);
          setSubmitting(false);
          return;
        }
      }

      const amountField = form?.fields.find(f => f.type === 'amount');
      const enteredAmount = amountField ? parseFloat(formData[amountField.label]) : 0;

      if (!enteredAmount || enteredAmount <= 0) {
        toast.error('Please enter a valid amount');
        setSubmitting(false);
        return;
      }

      // Get email field
      const emailField = form?.fields.find(f => f.type === 'email');
      const payerEmail = emailField ? formData[emailField.label] : '';

      if (!payerEmail) {
        toast.error('Email address is required for payment');
        setSubmitting(false);
        return;
      }

      // Get name field
      const nameField = form?.fields.find(f => 
        f.label.toLowerCase().includes('name') || 
        f.label.toLowerCase().includes('full name')
      );
      const payerName = nameField ? formData[nameField.label] : 'Anonymous';

      console.log('Submitting payment form:', {
        formId: form?.id,
        amount: totalAmount,
        payerEmail,
        payerName
      });

      // Submit to edge function to get payment details
      const { data, error } = await supabase.functions.invoke('payment-form-submit', {
        body: {
          formId: form?.id,
          submissionData: formData,
          originalAmount: originalAmount, // What merchant should receive
          amount: Math.round(totalAmount * 100), // What customer pays (in pesewas for Paystack)
          feeAmount: processingFee, // The fee portion
          payerName: payerName,
          payerEmail: payerEmail,
          redirectOrigin: window.location.origin 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        // Try to extract JSON error message if possible
        if (error instanceof Error && 'context' in error) {
          const context = (error as any).context;
          if (context && typeof context.json === 'function') {
            try {
              const errorBody = await context.json();
              throw new Error(errorBody.error || errorBody.message || 'Server error');
            } catch (e) {
              // Fallback if JSON parsing fails
            }
          }
        }
        throw error;
      }

      console.log('[DEBUG] Payment form submission response data:', data);

      // Check if we received the expected data structure
      if (data?.gateways) {
        
        const processPayment = (gatewayConfig: any, isBackup = false) => {
          console.log(`[Payment] Initializing ${isBackup ? 'Backup' : 'Primary'} Gateway`, gatewayConfig);
          
          const paystack = new PaystackPop();
          
          // Build checkout config
          const checkoutConfig: any = {
            key: gatewayConfig.key,
            email: data.email,
            amount: data.amount,
            reference: data.reference,
            metadata: data.metadata,
            onSuccess: (response: any) => {
              console.log('Payment successful:', response);
              toast.success('Payment successful!');
              setPaymentSuccess(true);
              setTimeout(() => {
                navigate(`/pay/${formId}/success?reference=${data.reference}`, { replace: true });
              }, 1000);
            },
            onCancel: () => {
              console.log('Payment cancelled by user');
              if (!isBackup && data.gateways.backup) {
                 toast.info("Payment cancelled. If you faced issues, you can try our backup gateway.", {
                   action: {
                     label: "Use Backup Method",
                     onClick: () => processPayment(data.gateways.backup, true)
                   }
                 });
              } else {
                 toast.info('Payment cancelled. You can try again.');
              }
              setSubmitting(false);
            },
            onError: (err: any) => {
              console.error(`Paystack ${isBackup ? 'Backup' : 'Primary'} error:`, err);
              
              if (!isBackup && data.gateways.backup) {
                console.log('Primary gateway failed, switching to backup...');
                toast.error('Primary gateway unavailable. Switching to fallback provider...');
                processPayment(data.gateways.backup, true);
              } else {
                toast.error('Payment initialization error. Please try again later.');
                setSubmitting(false);
              }
            }
          };
          
          // Only add split payment parameters if subaccount exists
          if (gatewayConfig.subaccount) {
            checkoutConfig.subaccount = gatewayConfig.subaccount;
            checkoutConfig.bearer = gatewayConfig.bearer;
          }
          
          paystack.checkout(checkoutConfig);
        };

        // Start with Primary if available, otherwise Backup
        if (data.gateways.primary) {
          processPayment(data.gateways.primary, false);
        } else if (data.gateways.backup) {
           console.log('Primary gateway not configured, using backup.');
           processPayment(data.gateways.backup, true);
        } else {
           throw new Error('No available payment gateways returned from server.');
        }

      } else if (data?.publicKey) {
         // Legacy single-gateway support (backward compatibility)
        const paystack = new PaystackPop();
        
        const legacyConfig: any = {
          key: data.publicKey,
          email: data.email,
          amount: data.amount,
          reference: data.reference,
          metadata: data.metadata,
          onSuccess: (response: any) => {
            console.log('Payment successful:', response);
            toast.success('Payment successful!');
            setPaymentSuccess(true);
            setTimeout(() => {
              navigate(`/pay/${formId}/success?reference=${data.reference}`, { replace: true });
            }, 1000);
          },
          onCancel: () => {
            console.log('Payment cancelled');
            toast.info('Payment cancelled');
            setSubmitting(false);
          },
          onError: (err: any) => {
            console.error('Paystack error:', err);
            toast.error('Payment initialization error');
            setSubmitting(false);
          }
        };
        
        // Only add subaccount if it exists
        if (data.subaccount) {
          legacyConfig.subaccount = data.subaccount;
        }
        
        paystack.checkout(legacyConfig);

      } else if (data?.payment_url) {
        // Fallback for when the edge function hasn't been re-deployed with the new InlineJS logic
        console.log('[DEBUG] Server returned a payment URL. Falling back to redirect-based checkout...');
        window.location.href = data.payment_url;
        return;
      } else {
        // Handle cases where data is returned but missing keys
        console.error('Incomplete data from edge function:', data);
        throw new Error('Incomplete payment data received');
      }
    } catch (error: any) {
      console.error('Payment submission error:', error);
      const errorMessage = error?.message || 'Failed to process payment';
      toast.error(errorMessage, {
        description: error?.details || 'Please check your details and try again'
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Form Not Found</CardTitle>
            <CardDescription className="text-sm sm:text-base">This payment form is not available</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center p-4 sm:p-6">
            <CheckCircle2 className="h-12 sm:h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-lg sm:text-xl">Payment Successful!</CardTitle>
            <CardDescription className="text-sm sm:text-base">Your payment has been processed successfully</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center p-4 sm:p-6">
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo" className="h-12 sm:h-16 mx-auto mb-4" />
            )}
            <CardTitle className="text-xl sm:text-2xl">{form.title}</CardTitle>
            {form.description && (
              <CardDescription className="text-sm sm:text-base mt-2">{form.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {!paystackLoaded && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">Payment system is loading...</p>
                  <p className="text-xs text-amber-700 mt-1">Please wait a moment before submitting.</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {form.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={field.label} className="text-sm sm:text-base">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  
                  {field.type === 'text' || field.type === 'email' ? (
                    <Input
                      id={field.label}
                      type={field.type}
                      required={field.required}
                      value={formData[field.label] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.label]: e.target.value })}
                      className="text-base"
                    />
                  ) : field.type === 'dropdown' ? (
                    <Select
                      value={formData[field.label] || ''}
                      onValueChange={(value) => setFormData({ ...formData, [field.label]: value })}
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, i) => (
                          <SelectItem key={i} value={option} className="text-base">{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'amount' ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
                        GHS
                      </span>
                      <Input
                        id={field.label}
                        type="number"
                        step="0.01"
                        min="0"
                        required={field.required}
                        disabled={field.isFixed}
                        className={cn(
                          "pl-12 sm:pl-16 text-base",
                          field.isFixed && "bg-muted/50 font-semibold text-primary"
                        )}
                        value={formData[field.label] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, [field.label]: val });
                          setOriginalAmount(parseFloat(val) || 0);
                        }}
                      />
                      {field.isFixed && (
                        <p className="text-[10px] text-muted-foreground mt-1.5 italic font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          Fixed payment amount set by merchant
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}

              {form?.fee_bearer === 'customer' && originalAmount > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount</span>
                    <span>GH₵ {originalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee (1.95%)</span>
                    <span>GH₵ {processingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total to Pay</span>
                    <span>GH₵ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-sm sm:text-base h-10 sm:h-11"
                style={{ backgroundColor: form.theme_color }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay GH₵ ${totalAmount.toFixed(2)}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}