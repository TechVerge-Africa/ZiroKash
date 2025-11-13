import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Copy, ExternalLink, LogOut, Settings as SettingsIcon, DollarSign, FileText, Clock } from "lucide-react";
import { MerchantOnboarding } from "@/components/ziropay/MerchantOnboarding";
import { SettlementAccountForm } from "@/components/ziropay/SettlementAccountForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatGHS } from "@/lib/currency";
import { usePaymentForms } from "@/hooks/usePaymentForms";

export default function ZiroPay() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [hasMerchant, setHasMerchant] = useState(false);
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [showSettlementForm, setShowSettlementForm] = useState(false);

  const { forms, stats, isLoading: formsLoading } = usePaymentForms();

  useEffect(() => {
    if (user) {
      checkMerchantStatus();
    }
  }, [user]);

  useEffect(() => {
    if (merchant) {
      fetchSettlements();
    }
  }, [merchant]);

  const checkMerchantStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching merchant:', error);
        setHasMerchant(false);
      } else if (data) {
        setMerchant(data);
        setHasMerchant(true);
      } else {
        setHasMerchant(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setHasMerchant(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettlements = async () => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSettlements(data || []);
      
      // Calculate pending amount
      const pending = (data || [])
        .filter(s => s.status === 'pending')
        .reduce((sum, s) => sum + s.amount, 0);
      setPendingAmount(pending);
    } catch (error) {
      console.error('Error fetching settlements:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasMerchant) {
    return <MerchantOnboarding onComplete={checkMerchantStatus} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ZiroPay</h1>
            <p className="text-sm text-muted-foreground">Payment Collection Platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettlementForm(true)}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settlement
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatGHS(typeof stats?.totalCollected === 'number' ? stats.totalCollected : 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {typeof stats?.paidSubmissions === 'number' ? stats.paidSubmissions : 0} payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Settlement</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatGHS(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">Next payout: Daily 6 PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
              <p className="text-xs text-muted-foreground">Payment forms</p>
            </CardContent>
          </Card>
        </div>

        {/* Settlement Account */}
        <Card>
          <CardHeader>
            <CardTitle>Settlement Account</CardTitle>
            <CardDescription>Where your payments are sent</CardDescription>
          </CardHeader>
          <CardContent>
            {merchant?.settlement_account && (
              merchant.settlement_type === 'momo' ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{merchant.settlement_account.provider.toUpperCase()} Mobile Money</p>
                    <p className="text-sm text-muted-foreground">{merchant.settlement_account.phone}</p>
                    <p className="text-sm text-muted-foreground">{merchant.settlement_account.account_name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowSettlementForm(true)}>
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{merchant.settlement_account.bank_name}</p>
                    <p className="text-sm text-muted-foreground">{merchant.settlement_account.account_number}</p>
                    <p className="text-sm text-muted-foreground">{merchant.settlement_account.account_name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowSettlementForm(true)}>
                    Change
                  </Button>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Payment Forms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payment Forms</CardTitle>
              <CardDescription>Create and manage your payment collection forms</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </CardHeader>
          <CardContent>
            {formsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading forms...</div>
            ) : forms.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No payment forms yet</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form: any) => {
                    return (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.title}</TableCell>
                        <TableCell>
                          <Badge variant={form.is_active ? 'default' : 'secondary'}>
                            {form.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>{formatGHS(0)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyFormLink(form.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/forms/${form.id}`)}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Settlement History */}
        <Card>
          <CardHeader>
            <CardTitle>Settlement History</CardTitle>
            <CardDescription>Recent payouts to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {settlements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No settlements yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell>{new Date(settlement.initiated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{formatGHS(settlement.amount)}</TableCell>
                      <TableCell>
                        {settlement.settlement_type === 'momo'
                          ? settlement.settlement_account.phone
                          : settlement.settlement_account.account_number}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            settlement.status === 'completed'
                              ? 'default'
                              : settlement.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {settlement.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
