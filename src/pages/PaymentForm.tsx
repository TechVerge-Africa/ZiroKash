import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FormField {
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}

interface PaymentForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  logo_url: string | null;
  theme_color: string;
}

export default function PaymentForm() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<PaymentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
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
      setForm(data as any);
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Form not found or inactive');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const amount = amountField ? parseFloat(formData[amountField.label]) : 0;

      if (!amount || amount <= 0) {
        toast.error('Please enter a valid amount');
        setSubmitting(false);
        return;
      }

      // Submit to edge function
      const { data, error } = await supabase.functions.invoke('payment-form-submit', {
        body: {
          formId: form?.id,
          submissionData: formData,
          amount: amount,
          payerName: formData['Name'] || formData['Full Name'] || 'Anonymous',
          payerEmail: formData['Email'] || formData['Email Address'] || ''
        }
      });

      if (error) throw error;

      // Redirect to Paystack
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process payment');
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
                      className="text-sm sm:text-base"
                    />
                  ) : field.type === 'dropdown' ? (
                    <Select
                      value={formData[field.label] || ''}
                      onValueChange={(value) => setFormData({ ...formData, [field.label]: value })}
                    >
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, i) => (
                          <SelectItem key={i} value={option} className="text-sm sm:text-base">{option}</SelectItem>
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
                        className="pl-12 sm:pl-16 text-sm sm:text-base"
                        value={formData[field.label] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.label]: e.target.value })}
                      />
                    </div>
                  ) : null}
                </div>
              ))}

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
                  'Pay Now'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}