
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoCard from "./CryptoCard";

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
  // Mock cryptocurrency data
  const cryptos = useMemo(() => [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 45289.34, change: 2.34, balance: 0.325 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2534.12, change: -1.27, balance: 3.5 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 98.56, change: 5.67, balance: 45.2 },
    { id: "tether", name: "Tether", symbol: "USDT", price: 1.00, change: 0.01, balance: 500 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.52, change: -3.45, balance: 2500 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.35, change: 1.23, balance: 1250 },
  ], []);

  const myPortfolio = cryptos.map(c => ({
    ...c,
    value: c.price * c.balance
  }));
  
  const totalPortfolioValue = myPortfolio.reduce((acc, c) => acc + c.value, 0);
  
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
                <span className="text-sm text-green-500">+4.32%</span>
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto px-4 pb-4 space-y-2">
              {myPortfolio.filter(c => c.balance > 0).map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  icon={<CryptoIcon symbol={crypto.symbol} />}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  balance={crypto.balance}
                  value={crypto.value}
                  change={crypto.change}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="market" className="mt-0">
            <div className="max-h-[450px] overflow-auto px-4 py-4 space-y-2">
              {cryptos.map((crypto) => (
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
