import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  DollarSign,
  ArrowUpRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MerchantManagementTable from "@/components/admin/MerchantManagementTable";
// ... imports

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const { data: stats, isLoading: statsLoading, error } = useAdminStats();

  // Protect the route
  if (!loading && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Assembling Ecosystem Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-xl font-bold">Data Access Resticted</p>
        <p className="text-muted-foreground text-center max-w-md">You need admin permissions to view this dashboard. Please contact system administrators.</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Revenue",
      value: `GHS ${stats?.totalRevenue.toLocaleString()}`,
      description: "Ecosystem processed volume",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+12.5% vs last month"
    },
    {
      title: "Active Merchants",
      value: stats?.merchantsCount.toString(),
      description: "Business accounts",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "Total platform reach"
    },
    {
      title: "Total Forms",
      value: stats?.formsCount.toString(),
      description: "Payment touchpoints",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "User generated content"
    },
    {
      title: "Transactions",
      value: stats?.transactionsSum.toString(),
      description: "Payment signals",
      icon: CreditCard,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      trend: "Throughput volume"
    }
  ];

  const transactionSuccessRate = stats?.transactionsSum 
    ? (stats.successfulTransactions / stats.transactionsSum) * 100 
    : 0;

  return (
    <div className="p-4 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Global ecosystem health and growth metrics.</p>
        </div>
        <Badge variant="outline" className="h-8 px-3 border-primary/20 bg-primary/5 text-primary font-medium flex items-center gap-2">
          <Loader2 className="h-3 w-3" /> Real-time Intel
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-white/5 bg-background/50 backdrop-blur-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${kpi.bg}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {kpi.description}
                {kpi.trend.includes('+') && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-white/5 bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Velocity</CardTitle>
                <CardDescription>Daily gross volume across all merchants.</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-primary opacity-50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.revenueHistory}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `GHS ${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Mix */}
        <Card className="border-white/5 bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Success Integrity</CardTitle>
            <CardDescription>Transactional health snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center pt-4">
              <div className="relative h-32 w-32">
                 <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * transactionSuccessRate) / 100}
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{transactionSuccessRate.toFixed(1)}%</span>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Success</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Successful</span>
                </div>
                <span className="font-bold">{stats?.successfulTransactions}</span>
              </div>
              <Progress value={transactionSuccessRate} className="h-1.5 bg-emerald-500/10" indicatorClassName="bg-emerald-500" />
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Failed</span>
                </div>
                <span className="font-bold">{stats?.failedTransactions}</span>
              </div>
              <Progress value={100 - transactionSuccessRate} className="h-1.5 bg-destructive/10" indicatorClassName="bg-destructive" />
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-xs leading-relaxed text-muted-foreground italic">
                "Our platform stability is currently at {transactionSuccessRate.toFixed(1)}%. This level of transaction integrity is a key competitive advantage."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchant Management Section */}
      <MerchantManagementTable />

      {/* Investor Note Section */}
      <Card className="border-primary/20 bg-primary/5 border-dashed overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
             <div className="p-4 bg-white/5 rounded-2xl flex-shrink-0">
               <ArrowUpRight className="h-8 w-8 text-primary" />
             </div>
             <div className="space-y-2">
               <h3 className="text-lg font-bold">Path to $1M ARR</h3>
               <p className="text-sm text-muted-foreground max-w-2xl">
                 Based on current merchant onboarding velocity and transaction volume, ZiroKash is positioned to scale processing by 10x by EOFY. These metrics provide a direct mandate for building our own proprietary payment gateway to capture more margin.
               </p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
