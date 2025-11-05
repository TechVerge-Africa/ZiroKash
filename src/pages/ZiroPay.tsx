import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link2, Eye, Download, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ZiroPay() {
  const [isInstitution, setIsInstitution] = useState(false);

  // Sample payment forms
  const paymentForms = [
    {
      id: '1',
      title: 'School Fees Payment',
      amount: 5000,
      collected: 125000,
      responses: 25,
      status: 'active'
    },
    {
      id: '2',
      title: 'Event Registration',
      amount: 200,
      collected: 8000,
      responses: 40,
      status: 'active'
    }
  ];

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Payment form created! Share the link to start collecting.");
  };

  const handleBecomeInstitution = () => {
    setIsInstitution(true);
    toast.success("Institution mode activated! You can now create payment forms.");
  };

  if (!isInstitution) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <DollarSign className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">ZiroPay - Institutional Payments</CardTitle>
            <CardDescription>
              Create payment forms, collect fees, and auto-generate receipts for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Create custom payment forms</p>
              <p>✓ Collect payments from students, customers, or members</p>
              <p>✓ Auto-generate branded receipts</p>
              <p>✓ Track all payments in one dashboard</p>
            </div>
            <Button onClick={handleBecomeInstitution} className="w-full" size="lg">
              Activate Institution Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ZiroPay</h1>
          <p className="text-muted-foreground mt-2">Collect payments with ease</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Payment Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Payment Form</DialogTitle>
              <DialogDescription>
                Build a custom form to collect payments from your customers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input id="form-title" placeholder="e.g., School Fees Payment" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₵)</Label>
                  <Input id="amount" type="number" placeholder="1000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide payment instructions or details..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution-name">Institution Name</Label>
                <Input id="institution-name" placeholder="Your Organization" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" placeholder="contact@institution.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" type="tel" placeholder="+233 XX XXX XXXX" />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create & Get Payment Link
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵133,000</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground">
              Successful transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵3,200</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Forms List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Forms</CardTitle>
          <CardDescription>Manage all your payment collection forms</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentForms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payment forms yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentForms.map((form) => (
                <div 
                  key={form.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{form.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {form.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>₵{form.amount} per payment</span>
                      <span>•</span>
                      <span>{form.responses} payments received</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        ₵{form.collected.toLocaleString()} collected
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Link2 className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
