import { useRoute } from "wouter";
import { getGetStockQueryKey, useGetStock, useCreateResearchReport } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToneIndicator, FormatCurrency, FormatLargeNumber } from "@/components/formatters";
import { 
  ArrowLeft, Activity, ShieldAlert, BookOpen, 
  BarChart2, FileText, CheckCircle2, TrendingUp, AlertTriangle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { toast } from "sonner";

export default function StockDetail() {
  const [, params] = useRoute("/stocks/:symbol");
  const [, setLocation] = useLocation();
  const symbol = params?.symbol || "";

  const { data: intelligence, isLoading } = useGetStock(symbol, {
    query: { queryKey: getGetStockQueryKey(symbol), enabled: !!symbol }
  });

  const reportMutation = useCreateResearchReport();

  const handleGenerateReport = () => {
    reportMutation.mutate(
      { data: { symbol, horizon: "medium", includeNews: true } },
      {
        onSuccess: () => {
          toast.success("Research report generated", {
            description: `AI research report for ${symbol} is ready.`
          });
          setLocation("/research");
        },
        onError: () => {
          toast.error("Failed to generate report");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="h-32 flex-1" />
          <Skeleton className="h-32 w-64" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!intelligence) {
    return (
      <div className="text-center py-20">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold">Stock not found</h2>
        <p className="text-muted-foreground mt-2">Could not load intelligence for {symbol}</p>
        <Link href="/stocks">
          <Button className="mt-6" variant="outline"><ArrowLeft className="mr-2 w-4 h-4"/> Back to search</Button>
        </Link>
      </div>
    );
  }

  const { quote, indicators, score, thesis, risks, chart } = intelligence;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/stocks" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to screener
          </Link>
          <div className="flex items-end gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{quote.symbol}</h1>
            <Badge variant="outline" className="mb-1.5">{quote.exchange}</Badge>
          </div>
          <p className="text-lg text-muted-foreground mt-1">{quote.company}</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-3xl font-mono"><FormatCurrency value={quote.price} /></div>
            <ToneIndicator tone={quote.tone} value={quote.changePercent} isPercent className="text-xl" />
          </div>
        </div>
        
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Signal Score</div>
              <div className="text-2xl font-mono text-primary font-bold">{score}/100</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center animate-[spin_3s_linear_infinite]">
              <Activity className="w-5 h-5 text-primary animate-[spin_3s_linear_infinite_reverse]" />
            </div>
          </div>
          <Button onClick={handleGenerateReport} disabled={reportMutation.isPending} className="mt-2">
            {reportMutation.isPending ? "Generating..." : "Generate AI Deep Dive"}
            {!reportMutation.isPending && <BookOpen className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart2 className="w-5 h-5 text-primary" />
              Price Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(time) => new Date(time).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN')}
                    formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Close']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorClose)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Technical Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Technical Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indicators.map((ind) => (
                <div key={ind.name} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border/50">
                  <div>
                    <div className="font-medium text-sm">{ind.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">{ind.value.toFixed(2)}</div>
                  </div>
                  <Badge variant={
                    ind.signal === 'bullish' ? 'positive' :
                    ind.signal === 'bearish' ? 'negative' : 'neutral'
                  } className="uppercase text-[10px] tracking-wider px-2">
                    {ind.signal}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thesis */}
        <Card className="border-primary/20 shadow-[0_4px_20px_rgba(234,179,8,0.03)] bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <FileText className="w-5 h-5" />
              AI Investment Thesis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {thesis}
            </p>
          </CardContent>
        </Card>

        {/* Risks */}
        <Card className="border-destructive/20 shadow-[0_4px_20px_rgba(239,68,68,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Key Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-foreground/80">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
