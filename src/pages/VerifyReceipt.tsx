import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Calendar, User, CreditCard, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VerifyReceipt() {
  const { receiptNo } = useParams<{ receiptNo: string }>();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyReceipt();
  }, [receiptNo, code]);

  const verifyReceipt = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!receiptNo || !code) {
        setError("Invalid verification link");
        setLoading(false);
        return;
      }

      const { data, error: rpcError } = await (supabase as any).rpc('verify_receipt_details', {
        p_receipt_no: receiptNo,
        p_verify_code: code
      });

      if (rpcError) throw rpcError;

      if (!data || (data as any[]).length === 0) {
        setError("Receipt could not be verified. It may be invalid or not yet processed.");
      } else {
        setDetails(data[0]);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"
          />
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">
            Validating Authenticity...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 sm:p-8">
      <div className="max-w-xl mx-auto w-full space-y-8">
        {/* Back navigation if needed, or just home */}
        <Button variant="ghost" className="text-slate-500" onClick={() => navigate('/')}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900">Verification Failed</h1>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">
                {error}
              </p>
            </div>
            <Button variant="outline" className="rounded-2xl h-12 px-8" onClick={() => window.location.reload()}>
              Retry Verification
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 ring-8 ring-green-100"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Receipt Verified</h1>
                <p className="text-green-600 font-bold uppercase tracking-widest text-[10px]">
                  Secure Blockchain Verification
                </p>
              </div>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
              <div className="bg-primary p-6 text-white text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Official Transaction Receipt</p>
                <p className="text-xl font-black">{details.form_title}</p>
              </div>
              <CardContent className="p-8 space-y-8">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs">
                    {details.status}
                  </Badge>
                </div>

                {/* Amount Highlight */}
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Paid</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">
                    {formatAmount(details.amount)}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payer Name</p>
                      <p className="text-sm font-bold text-slate-900">{details.payer_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Date</p>
                      <p className="text-sm font-bold text-slate-900">
                        {new Date(details.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receipt Number</p>
                      <p className="text-sm font-mono font-bold text-primary">{receiptNo}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="pt-2 text-center text-[10px] font-bold text-slate-400 uppercase space-y-2">
                  <p>Certified by ZiroKash Payments</p>
                  <p className="font-medium normal-case italic">
                    Merchant: {details.merchant_name}
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">
              End-to-End Encrypted Verification
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
