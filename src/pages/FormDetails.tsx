import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Link2, Eye, EyeOff, Trash2, Download, Edit2 } from "lucide-react";
import { toast } from "sonner";
import FormAnalytics from "@/components/zirokash/FormAnalytics";
import FormEmbedCode from "@/components/zirokash/FormEmbedCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReceiptViewer } from "@/components/merchant/ReceiptViewer";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FormSubmission {
  id: string;
  payer_name: string;
  payer_email: string;
  amount: number;
  net_amount?: number;
  status: string;
  created_at: string;
  submission_data: any;
}

export default function FormDetails() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  
  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFormDetails();
  }, [formId]);

  useEffect(() => {
    fetchFormDetails();
  }, [formId]);

  useEffect(() => {
    const fetch = async () => {
      await fetchSubmissions();
    }
    fetch();

    // Set up realtime subscription
    const channel = supabase
      .channel(`form-submissions-${formId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_submissions',
          filter: `form_id=eq.${formId}`
        },
        (payload) => {
          console.log('Submission update received:', payload);
          // Refresh submissions when any change occurs
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formId, currentPage, searchQuery]);

  const fetchFormDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) throw error;
      setForm(data);
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('form_submissions')
        .select('*', { count: 'exact' })
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`payer_name.ilike.%${searchQuery}%,payer_email.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      setSubmissions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const { error } = await supabase
        .from('payment_forms')
        .update({ is_active: !form.is_active })
        .eq('id', formId);

      if (error) throw error;
      
      setForm({ ...form, is_active: !form.is_active });
      toast.success(`Form ${form.is_active ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to update form status');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('payment_forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;
      
      toast.success('Form deleted successfully');
      navigate('/zirokash');
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  const copyPaymentLink = async () => {
    const link = `${window.location.origin}/pay/${formId}`;
    
    // Try modern API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(link);
        toast.success('Payment link copied to clipboard');
        return;
      } catch (err) {
        console.warn('Clipboard API failed', err);
      }
    }

    // Fallback
    try {
      const textArea = document.createElement("textarea");
      textArea.value = link;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('Payment link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy link manually');
    }
  };

  const exportSubmissions = async () => {
    try {
      const { data: allPaidSubmissions, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', formId)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!allPaidSubmissions || allPaidSubmissions.length === 0) {
        toast.error('No paid submissions to export');
        return;
      }

      const csv = [
        ['Name', 'Email', 'Amount', 'Status', 'Date'],
        ...allPaidSubmissions.map(s => [
          s.payer_name,
          s.payer_email,
          `GHS ${(s.amount / 100).toFixed(2)}`,
          s.status,
          new Date(s.created_at).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form?.title}-submissions.csv`;
      a.click();
      toast.success('Submissions exported');
    } catch (error) {
      console.error('Error exporting submissions:', error);
      toast.error('Failed to export submissions');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader variant="spinner" size="md" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Form Not Found</CardTitle>
            <CardDescription>This payment form doesn't exist or you don't have access to it</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/zirokash')} className="flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{form.title}</h1>
              <Badge variant={form.is_active ? "default" : "secondary"} className="flex-shrink-0">
                {form.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {form.description && (
              <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2">{form.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyPaymentLink();
            }} 
            className="flex-1 sm:flex-initial"
          >
            <Copy className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Copy Link</span>
            <span className="sm:hidden">Copy</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleStatus} className="flex-1 sm:flex-initial">
            {form.is_active ? <EyeOff className="h-4 w-4 sm:mr-2" /> : <Eye className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">{form.is_active ? 'Deactivate' : 'Activate'}</span>
            <span className="sm:hidden">{form.is_active ? 'Off' : 'On'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/zirokash?edit=${formId}`)} className="flex-1 sm:flex-initial">
            <Edit2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Form</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">Del</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Form?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this form and all associated submissions. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="w-full sm:w-auto">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-auto">
          <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-2.5">Analytics</TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs sm:text-sm py-2 sm:py-2.5">Submissions</TabsTrigger>
          <TabsTrigger value="share" className="text-xs sm:text-sm py-2 sm:py-2.5">Share & Embed</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <FormAnalytics formId={formId!} />
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Submissions</CardTitle>
                  <CardDescription className="text-sm">All payment submissions for this form</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search name or email..."
                      className="pl-9 h-9"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={exportSubmissions} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No submissions yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Name</TableHead>
                          <TableHead className="text-xs sm:text-sm">Email</TableHead>
                          <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                          <TableHead className="text-xs sm:text-sm">Status</TableHead>
                          <TableHead className="text-xs sm:text-sm">Date</TableHead>
                          <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="text-xs sm:text-sm">{submission.payer_name}</TableCell>
                            <TableCell className="text-xs sm:text-sm break-all">{submission.payer_email}</TableCell>
                            <TableCell className="text-xs sm:text-sm">GHS {((submission.net_amount || submission.amount) / 100).toFixed(2)}</TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              <Badge variant={submission.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                {submission.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              {submission.status === 'paid' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedSubmission(submission);
                                    setIsReceiptOpen(true);
                                  }}
                                  className="h-8 px-2 text-xs"
                                >
                                  Receipt
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {totalCount > pageSize && (
                      <div className="flex items-center justify-between py-4 border-t border-border mt-4">
                        <p className="text-xs text-muted-foreground">
                          Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} submissions
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={(currentPage + 1) * pageSize >= totalCount}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedSubmission && (
            <ReceiptViewer 
              isOpen={isReceiptOpen}
              onClose={() => setIsReceiptOpen(false)}
              transaction={{
                ...selectedSubmission,
                form_title: form.title,
                receipt_template: form.receipt_template,
                logo_url: form.logo_url,
                signature_url: form.signature_url,
                form_fields: form.fields
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="share">
          <FormEmbedCode formId={formId!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}