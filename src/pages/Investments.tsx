
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, BarChart3, Search, TrendingUp, Users } from "lucide-react";

export default function Investments() {
  const [activeTab, setActiveTab] = useState("portfolio");
  
  // Mock portfolio data
  const portfolioData = [
    { id: 1, symbol: "AAPL", name: "Apple Inc.", shares: 10, price: 178.72, value: 1787.20, change: 2.5 },
    { id: 2, symbol: "MSFT", name: "Microsoft Corp.", shares: 5, price: 332.42, value: 1662.10, change: 1.1 },
    { id: 3, symbol: "AMZN", name: "Amazon.com Inc.", shares: 3, price: 177.23, value: 531.69, change: -0.8 },
    { id: 4, symbol: "GOOGL", name: "Alphabet Inc.", shares: 4, price: 142.56, value: 570.24, change: 0.4 },
    { id: 5, symbol: "TSLA", name: "Tesla Inc.", shares: 8, price: 139.75, value: 1118.00, change: -2.1 }
  ];
  
  // Mock chart data
  const chartData = [
    { name: 'Jan', value: 8400 },
    { name: 'Feb', value: 9200 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 8900 },
    { name: 'May', value: 11200 },
    { name: 'Jun', value: 10500 },
    { name: 'Jul', value: 12800 },
    { name: 'Aug', value: 12400 },
    { name: 'Sep', value: 13100 },
    { name: 'Oct', value: 12500 },
    { name: 'Nov', value: 14300 },
    { name: 'Dec', value: 15200 },
  ];
  
  // Mock recommended stocks
  const recommendedStocks = [
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 927.45, change: 3.8 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 493.50, change: 2.4 },
    { symbol: "AMD", name: "Advanced Micro Devices", price: 172.88, change: 1.5 },
    { symbol: "PYPL", name: "PayPal Holdings Inc.", price: 62.10, change: 0.9 }
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Investments</h1>
            <p className="text-muted-foreground">Manage your global stock portfolio with blockchain transparency</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <TrendingUp className="mr-2 h-4 w-4" />
            Buy Stocks
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main investment section */}
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="font-medium">Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                    <p className="text-3xl font-bold">$5,669.23</p>
                    <p className="text-sm text-green-500">+$420.69 (8.01%)</p>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e1e2a', 
                        borderColor: '#333',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="portfolio" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>My Holdings</CardTitle>
                    <CardDescription>Your blockchain-verified stock portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-2">Symbol</th>
                            <th className="text-left py-3 px-2">Company</th>
                            <th className="text-right py-3 px-2">Shares</th>
                            <th className="text-right py-3 px-2">Price</th>
                            <th className="text-right py-3 px-2">Value</th>
                            <th className="text-right py-3 px-2">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolioData.map((stock) => (
                            <tr key={stock.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-2 font-medium">{stock.symbol}</td>
                              <td className="py-3 px-2">{stock.name}</td>
                              <td className="py-3 px-2 text-right">{stock.shares}</td>
                              <td className="py-3 px-2 text-right">${stock.price.toFixed(2)}</td>
                              <td className="py-3 px-2 text-right">${stock.value.toFixed(2)}</td>
                              <td className={`py-3 px-2 text-right ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="watchlist" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle>Watchlist</CardTitle>
                    <CardDescription>Stocks you're monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8 text-muted-foreground">You don't have any stocks in your watchlist yet.</p>
                    <Button className="w-full">Add Stocks to Watchlist</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discover" className="mt-4">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle>Discover Stocks</CardTitle>
                        <CardDescription>Find new investment opportunities</CardDescription>
                      </div>
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search stocks..." 
                          className="pl-8 w-full sm:w-[200px]"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Trending Stocks</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendedStocks.map((stock) => (
                          <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div>
                              <p className="font-medium">{stock.symbol}</p>
                              <p className="text-xs text-muted-foreground">{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${stock.price}</p>
                              <p className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Side panel */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <p className="font-medium">Recommended for You</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Based on your portfolio and risk profile</p>
                    
                    <div className="space-y-3">
                      {recommendedStocks.slice(0, 2).map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-xs text-muted-foreground">{stock.name}</p>
                          </div>
                          <Button size="sm" variant="outline" className="h-8">
                            Buy <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="glass-card border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>S&P 500</span>
                          <span className="text-green-500">+1.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nasdaq</span>
                          <span className="text-green-500">+1.7%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dow Jones</span>
                          <span className="text-green-500">+0.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bitcoin</span>
                          <span className="text-red-500">-2.3%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Investment Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Investments</span>
                          <span>$5,669.23</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Return</span>
                          <span className="text-green-500">+$420.69 (8.01%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dividend Yield</span>
                          <span>2.1%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Blockchain Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  All your investments are secured and verified on the blockchain for complete transparency.
                </p>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Ledger
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="mr-2 h-4 w-4" />
                    Share Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
