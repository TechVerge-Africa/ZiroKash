import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Link2, Eye, EyeOff, Trash2, Download, Edit2 } from "lucide-react";
import { toast } from "sonner";
import FormAnalytics from "@/components/ziropay/FormAnalytics";
import FormEmbedCode from "@/components/ziropay/FormEmbedCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface FormSubmission {
  id: string;
  payer_name: string;
  payer_email: string;
  amount: number;
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

  useEffect(() => {
    fetchFormDetails();
    fetchSubmissions();
  }, [formId]);

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
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
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
      navigate('/ziropay');
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  const copyPaymentLink = () => {
    const link = `${window.location.origin}/pay/${formId}`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied to clipboard');
  };

  const exportSubmissions = () => {
    const csv = [
      ['Name', 'Email', 'Amount', 'Status', 'Date'],
      ...submissions.map(s => [
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ziropay')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{form.title}</h1>
              <Badge variant={form.is_active ? "default" : "secondary"}>
                {form.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {form.description && (
              <p className="text-muted-foreground mt-1">{form.description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyPaymentLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {form.is_active ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {form.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/ziropay?edit=${formId}`)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Form
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Form?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this form and all associated submissions. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="share">Share & Embed</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <FormAnalytics formId={formId!} />
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Submissions</CardTitle>
                  <CardDescription>All payment submissions for this form</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={exportSubmissions}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No submissions yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.payer_name}</TableCell>
                        <TableCell>{submission.payer_email}</TableCell>
                        <TableCell>GHS {(submission.amount / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={submission.status === 'paid' ? 'default' : 'secondary'}>
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share">
          <FormEmbedCode formId={formId!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}