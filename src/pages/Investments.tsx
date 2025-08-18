import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, LineChart, PieChart, Plus, TrendingUp, Wallet, DollarSign, Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useInvestments } from "@/hooks/useInvestments";

export default function Investments() {
  const { investments, loading, getTotalInvested, getTotalCurrentValue, getTotalProfitLoss, getPortfolioPerformance, getAssetsByType } = useInvestments();

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const totalInvested = getTotalInvested();
  const totalCurrentValue = getTotalCurrentValue();
  const totalProfitLoss = getTotalProfitLoss();
  const portfolioPerformance = getPortfolioPerformance();
  const assetsByType = getAssetsByType();
  const assetTypes = Object.keys(assetsByType).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Investments</h1>
          <p className="text-muted-foreground">Track and manage your investment portfolio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/investments">
              <Plus className="mr-2 h-4 w-4" />
              New Investment
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Total Invested
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                        <Info className="h-3 w-3" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60">
                      <p className="text-sm">Total amount of money you have invested across all assets.</p>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${totalCurrentValue.toFixed(2)}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Initial investment: ${totalInvested.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Total Return
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                        <Info className="h-3 w-3" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60">
                      <p className="text-sm">Your total profit or loss on all investments.</p>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
                    </span>
                  </div>
                  <span className={`text-sm ${portfolioPerformance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {portfolioPerformance >= 0 ? '+' : ''}{portfolioPerformance.toFixed(1)}% overall
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Portfolio Diversity
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                        <Info className="h-3 w-3" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60">
                      <p className="text-sm">The measure of how your investments are spread across different assets.</p>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{assetTypes}</span>
                    <span className="ml-2 text-muted-foreground text-sm">asset classes</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{assetTypes >= 4 ? 'Well diversified' : assetTypes >= 2 ? 'Moderately diversified' : 'Limited diversity'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Your investment performance over time</CardDescription>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <div className="flex items-center mr-4">
                    <div className="h-3 w-3 rounded-full bg-primary mr-1"></div>
                    <span className="text-xs">Portfolio</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-white/30 mr-1"></div>
                    <span className="text-xs">Benchmark</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border border-white/10 rounded-md">
                <div className="text-center space-y-2">
                  <AreaChart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Portfolio Performance Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assets" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Your Assets</CardTitle>
                  <CardDescription>A breakdown of your investment portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investments.length > 0 ? investments.map((investment) => {
                    const allocation = totalCurrentValue > 0 ? (investment.current_value / totalCurrentValue) * 100 : 0;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500', 'bg-indigo-500'];
                    const colorIndex = investment.asset_type.length % colors.length;
                    
                    return (
                      <div key={investment.id} className="p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white`}>
                              {investment.asset_name[0]}
                            </div>
                            <div>
                              <p className="font-medium">{investment.asset_name}</p>
                              <p className="text-xs text-muted-foreground">{allocation.toFixed(1)}% of portfolio</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${investment.current_value.toFixed(2)}</p>
                            <p className={`text-xs ${investment.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {investment.profit_loss >= 0 ? '+' : ''}{investment.profit_loss_percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <Progress value={allocation} className="h-1.5" />
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No investments found. Start building your portfolio today.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent investment activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'buy', asset: 'AAPL Shares', date: 'Apr 3, 2025', amount: '5 shares', value: '$920.35' },
                      { type: 'buy', asset: 'ETH', date: 'Mar 28, 2025', amount: '0.5 ETH', value: '$1,245.50' },
                      { type: 'sell', asset: 'TSLA Shares', date: 'Mar 25, 2025', amount: '2 shares', value: '$452.80' },
                      { type: 'buy', asset: 'S&P 500 ETF', date: 'Mar 20, 2025', amount: '3 shares', value: '$1,350.75' },
                      { type: 'deposit', asset: 'Cash Deposit', date: 'Mar 15, 2025', amount: 'USD', value: '$2,000.00' }
                    ].map((transaction, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${
                            transaction.type === 'buy' 
                              ? 'bg-green-500/20 text-green-500' 
                              : transaction.type === 'sell'
                                ? 'bg-red-500/20 text-red-500'
                                : 'bg-blue-500/20 text-blue-500'
                          } flex items-center justify-center`}>
                            {transaction.type === 'buy' 
                              ? <TrendingUp className="h-5 w-5" /> 
                              : transaction.type === 'sell'
                                ? <TrendingUp className="h-5 w-5 transform rotate-180" />
                                : <Wallet className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.asset}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{transaction.value}</p>
                          <p className="text-xs text-muted-foreground">{transaction.amount}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Portfolio Insights</CardTitle>
                  <CardDescription>Analysis and recommendations for your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                          <Info className="h-5 w-5" />
                        </div>
                        <p className="font-medium">Risk Assessment</p>
                      </div>
                      <p className="text-sm mb-3">Your portfolio has a <span className="font-medium">moderate risk level</span>. This aligns with your investment goals and risk tolerance.</p>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-1/2 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                        <span>Low Risk</span>
                        <span>Moderate</span>
                        <span>High Risk</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <p className="font-medium">Growth Projection</p>
                      </div>
                      <p className="text-sm mb-3">Based on your current allocation and market trends, your portfolio is projected to grow by <span className="font-medium text-green-500">8-12%</span> annually.</p>
                      <div className="h-[150px] flex items-center justify-center border border-white/10 rounded-md">
                        <div className="text-center space-y-2">
                          <LineChart className="h-10 w-10 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Projected Growth Chart</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <p className="font-medium">Recommendations</p>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-white/5">
                          <p className="text-sm">Consider increasing your bond allocation by 5% to better balance risk.</p>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <p className="text-sm">Your tech sector exposure could be diversified more across different industries.</p>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <p className="text-sm">Regular monthly contributions of $200-500 could significantly boost long-term growth.</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Get Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/investments">
                    <TrendingUp className="h-5 w-5 mb-2" />
                    <span className="text-xs">Buy Assets</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/investments">
                    <TrendingUp className="h-5 w-5 mb-2 transform rotate-180" />
                    <span className="text-xs">Sell Assets</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/wallet">
                    <Wallet className="h-5 w-5 mb-2" />
                    <span className="text-xs">Deposit</span>
                  </Link>
                </Button>
                
                <Button className="h-auto py-4 flex flex-col items-center" variant="outline" asChild>
                  <Link to="/wallet">
                    <DollarSign className="h-5 w-5 mb-2" />
                    <span className="text-xs">Withdraw</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[200px] flex items-center justify-center border border-white/10 rounded-md">
                  <div className="text-center space-y-2">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Asset Allocation Chart</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <p className="text-sm">Stocks (45%)</p>
                    </div>
                    <p className="text-sm font-medium">$8,430.94</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm">Bonds (20%)</p>
                    </div>
                    <p className="text-sm font-medium">$3,747.08</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                      <p className="text-sm">Crypto (15%)</p>
                    </div>
                    <p className="text-sm font-medium">$2,810.31</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <p className="text-sm">Real Estate (12%)</p>
                    </div>
                    <p className="text-sm font-medium">$2,248.25</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <p className="text-sm">Commodities (8%)</p>
                    </div>
                    <p className="text-sm font-medium">$1,498.83</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/investments">Rebalance Portfolio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[150px] flex items-center justify-center border border-white/10 rounded-md">
                  <div className="text-center space-y-2">
                    <BarChart className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Market Performance Chart</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <p className="text-sm">S&P 500</p>
                    <div className="text-right">
                      <p className="text-sm font-medium">4,985.32</p>
                      <p className="text-xs text-green-500">+0.82%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <p className="text-sm">Dow Jones</p>
                    <div className="text-right">
                      <p className="text-sm font-medium">38,723.15</p>
                      <p className="text-xs text-green-500">+0.63%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <p className="text-sm">NASDAQ</p>
                    <div className="text-right">
                      <p className="text-sm font-medium">17,542.87</p>
                      <p className="text-xs text-green-500">+1.12%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <p className="text-sm">Bitcoin</p>
                    <div className="text-right">
                      <p className="text-sm font-medium">$68,352.45</p>
                      <p className="text-xs text-red-500">-2.35%</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/investments">View Full Market Data</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
