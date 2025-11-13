
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  
  // Market data removed - crypto functionality coming soon

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
        <div className="p-4">
          <div className="flex items-baseline mb-4">
            <span className="text-xl font-bold mr-2">${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            {portfolioPerformance !== 0 && (
              <span className={`text-sm ${portfolioPerformance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioPerformance >= 0 ? '+' : ''}{portfolioPerformance.toFixed(2)}%
              </span>
            )}
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
              <p className="text-muted-foreground text-sm">
                No cryptocurrency holdings yet.<br />
                Start investing to build your crypto portfolio.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
