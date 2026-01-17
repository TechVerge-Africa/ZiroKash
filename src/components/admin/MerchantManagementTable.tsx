import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMerchants, type MerchantData } from "@/hooks/useAdminMerchants";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search,
  RefreshCw,
  Edit2,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function MerchantManagementTable() {
  const { 
    merchants, 
    isLoading, 
    error, 
    checkSubaccount, 
    updateCommission,
    batchUpdateCommission 
  } = useAdminMerchants();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [batchPercentage, setBatchPercentage] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (merchant: MerchantData) => {
    setEditingId(merchant.id);
    setEditValue((merchant.commission_rate * 100).toString());
  };

  const handleSave = async (merchant: MerchantData) => {
    if (!merchant.paystack_subaccount_code) {
      toast.error("No subaccount code found for this merchant");
      return;
    }

    const percentage = parseFloat(editValue);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("Please enter a valid percentage between 0 and 100");
      return;
    }

    await updateCommission.mutateAsync({
      subaccountCode: merchant.paystack_subaccount_code,
      percentageCharge: percentage
    });

    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleCheckStatus = async (subaccountCode: string) => {
    await checkSubaccount.mutateAsync(subaccountCode);
  };

  const handleBatchUpdate = async () => {
    const percentage = parseFloat(batchPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("Please enter a valid percentage between 0 and 100");
      return;
    }

    if (!confirm(`Are you sure you want to update ALL merchants to ${percentage}% commission?`)) {
      return;
    }

    await batchUpdateCommission.mutateAsync(percentage);
  };

  const getStatusBadge = (merchant: MerchantData) => {
    if (!merchant.paystack_subaccount_code) {
      return <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" />No Subaccount</Badge>;
    }
    if (merchant.is_active) {
      return <Badge variant="default" className="gap-1 bg-emerald-500"><CheckCircle2 className="h-3 w-3" />Active</Badge>;
    }
    return <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" />Inactive</Badge>;
  };

  const getVerificationBadge = (status: string | null) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-emerald-500">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredMerchants = merchants?.filter(merchant =>
    merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.business_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-semibold">Failed to load merchants</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Merchant Management</CardTitle>
            <CardDescription>
              View and manage all merchant accounts and commission rates
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={batchPercentage}
              onChange={(e) => setBatchPercentage(e.target.value)}
              className="w-24"
              placeholder="1.0"
            />
            <Button 
              onClick={handleBatchUpdate}
              disabled={batchUpdateCommission.isPending}
              variant="outline"
              size="sm"
            >
              {batchUpdateCommission.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Update All</span>
            </Button>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants && filteredMerchants.length > 0 ? (
                filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.business_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{merchant.business_email}</TableCell>
                    <TableCell>{getStatusBadge(merchant)}</TableCell>
                    <TableCell>
                      {editingId === merchant.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 h-8"
                            autoFocus
                          />
                          <span className="text-sm">%</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSave(merchant)}
                            disabled={updateCommission.isPending}
                          >
                            {updateCommission.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 text-emerald-500" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{(merchant.commission_rate * 100).toFixed(2)}%</span>
                          {merchant.paystack_subaccount_code && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(merchant)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getVerificationBadge(merchant.verification_status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {merchant.paystack_subaccount_code ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckStatus(merchant.paystack_subaccount_code!)}
                          disabled={checkSubaccount.isPending}
                        >
                          {checkSubaccount.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          <span className="ml-2">Check</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">No subaccount</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    {searchTerm ? 'No merchants found matching your search' : 'No merchants found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredMerchants && filteredMerchants.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredMerchants.length} of {merchants?.length || 0} merchants
          </div>
        )}
      </CardContent>
    </Card>
  );
}
