import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Briefcase, IndianRupee } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FormatCurrency, ToneIndicator } from "@/components/formatters";

// Mock data since there is no native API for portfolio
const PORTFOLIO_MOCK = {
  totalValue: 1452500.50,
  dayChange: 12450.20,
  dayChangePercent: 0.86,
  unrealizedPnL: 345000.75,
  unrealizedPnLPercent: 31.15,
  allocations: [
    { name: "Financials", value: 450000, color: "hsl(var(--chart-1))" },
    { name: "IT", value: 350000, color: "hsl(var(--chart-2))" },
    { name: "Consumer", value: 250000, color: "hsl(var(--chart-3))" },
    { name: "Energy", value: 200000, color: "hsl(var(--chart-4))" },
    { name: "Cash", value: 202500.50, color: "hsl(var(--chart-5))" },
  ],
  holdings: [
    { symbol: "HDFCBANK", qty: 250, avgPrice: 1500, ltp: 1650.50, change: 1.2 },
    { symbol: "TCS", qty: 100, avgPrice: 3200, ltp: 3850.75, change: -0.4 },
    { symbol: "ITC", qty: 50, avgPrice: 4100, ltp: 4250.00, change: 0.8 },
    { symbol: "RELIANCE", qty: 150, avgPrice: 2400, ltp: 2950.25, change: 2.1 }
  ]
};

export default function Portfolio() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" /> Portfolio
        </h1>
        <p className="text-muted-foreground">Holdings, allocation, and risk metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/50 border-primary/20">
          <CardContent className="p-8">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Net Value</div>
            <div className="text-5xl font-mono font-bold tracking-tight text-foreground mb-6">
              <FormatCurrency value={PORTFOLIO_MOCK.totalValue} />
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border/50">
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Day's P&L</div>
                <div className="flex items-end gap-3">
                  <span className="font-mono text-xl"><FormatCurrency value={PORTFOLIO_MOCK.dayChange} /></span>
                  <ToneIndicator tone="positive" value={PORTFOLIO_MOCK.dayChangePercent} isPercent className="pb-1" />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Total Return</div>
                <div className="flex items-end gap-3">
                  <span className="font-mono text-xl text-positive"><FormatCurrency value={PORTFOLIO_MOCK.unrealizedPnL} /></span>
                  <ToneIndicator tone="positive" value={PORTFOLIO_MOCK.unrealizedPnLPercent} isPercent className="pb-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Sector Allocation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PORTFOLIO_MOCK.allocations}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {PORTFOLIO_MOCK.allocations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => <FormatCurrency value={value} />}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-4">
              {PORTFOLIO_MOCK.allocations.slice(0, 3).map(alloc => (
                <div key={alloc.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: alloc.color }} />
                    <span className="text-muted-foreground">{alloc.name}</span>
                  </div>
                  <span className="font-mono font-medium">{((alloc.value / PORTFOLIO_MOCK.totalValue) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
          <CardDescription>Live equity positions connected via broker API.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Symbol</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Avg Price</th>
                  <th className="px-4 py-3 text-right">LTP</th>
                  <th className="px-4 py-3 text-right">Current Value</th>
                  <th className="px-4 py-3 text-right rounded-tr-md">Unrealized P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PORTFOLIO_MOCK.holdings.map((pos) => {
                  const invested = pos.qty * pos.avgPrice;
                  const current = pos.qty * pos.ltp;
                  const pnl = current - invested;
                  const pnlPercent = (pnl / invested) * 100;
                  
                  return (
                    <tr key={pos.symbol} className="hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-4 font-bold">{pos.symbol}</td>
                      <td className="px-4 py-4 text-right font-mono">{pos.qty}</td>
                      <td className="px-4 py-4 text-right font-mono"><FormatCurrency value={pos.avgPrice} /></td>
                      <td className="px-4 py-4 text-right font-mono">
                        <div className="flex flex-col items-end">
                          <FormatCurrency value={pos.ltp} />
                          <ToneIndicator value={pos.change} isPercent className="text-[10px] mt-1" />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-medium"><FormatCurrency value={current} /></td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col items-end font-mono">
                          <span className={pnl >= 0 ? "text-positive" : "text-negative"}>
                            {pnl > 0 ? "+" : ""}<FormatCurrency value={pnl} />
                          </span>
                          <ToneIndicator value={pnlPercent} isPercent className="text-[10px] mt-1" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
