
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoCard from "./CryptoCard";
import { useCrypto } from "@/hooks/useCrypto";

// Mock crypto icons
const CryptoIcon = ({ symbol }: { symbol: string }) => {
  const colors: Record<string, string> = {
    BTC: "#F7931A",
    ETH: "#627EEA",
    SOL: "#14F195",
    USDT: "#26A17B",
    XRP: "#23292F",
    ADA: "#0033AD",
  };

  return (
    <div className="flex h-6 w-6 items-center justify-center font-bold" style={{ color: colors[symbol] || "#FFFFFF" }}>
      {symbol.slice(0, 1)}
    </div>
  );
};

export default function CryptoPrices() {
  const { cryptoPortfolio, loading, getTotalPortfolioValue, getPortfolioPerformance } = useCrypto();
  
  // Mock market data for display
  const marketCryptos = useMemo(() => [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 45289.34, change: 2.34 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2534.12, change: -1.27 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 98.56, change: 5.67 },
    { id: "tether", name: "Tether", symbol: "USDT", price: 1.00, change: 0.01 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.52, change: -3.45 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.35, change: 1.23 },
  ], []);

  const totalPortfolioValue = getTotalPortfolioValue();
  const portfolioPerformance = getPortfolioPerformance();

  if (loading) {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          Loading crypto data...
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md font-medium">Crypto Assets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="portfolio">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="portfolio" className="mt-0">
            <div className="p-4">
              <div className="flex items-baseline mb-4">
                <span className="text-xl font-bold mr-2">${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className={`text-sm ${portfolioPerformance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioPerformance >= 0 ? '+' : ''}{portfolioPerformance.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto px-4 pb-4 space-y-2">
              {cryptoPortfolio.length > 0 ? cryptoPortfolio.filter(c => c.balance > 0).map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  icon={<CryptoIcon symbol={crypto.symbol} />}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  balance={crypto.balance}
                  value={crypto.total_value}
                  change={crypto.profit_loss_percentage}
                />
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No crypto holdings found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="market" className="mt-0">
            <div className="max-h-[450px] overflow-auto px-4 py-4 space-y-2">
              {marketCryptos.map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  icon={<CryptoIcon symbol={crypto.symbol} />}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  balance={0}
                  value={crypto.price}
                  change={crypto.change}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
