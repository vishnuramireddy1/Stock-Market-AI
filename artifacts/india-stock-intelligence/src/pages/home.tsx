import { getGetMarketOverviewQueryKey, useGetMarketOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToneIndicator, FormatCurrency } from "@/components/formatters";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, TrendingUp, Search, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatAssistant } from "@/components/chat-assistant";

export default function Home() {
  const { data: overview, isLoading } = useGetMarketOverview({ query: { queryKey: getGetMarketOverviewQueryKey(), refetchInterval: 60000 } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Market Desk</h1>
          <div className="text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {isLoading ? (
            <Skeleton className="w-32 h-5" />
          ) : (
            <>As of {new Date(overview?.asOf || "").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</>
          )}
          </div>
      </div>

      {/* Indices Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          : overview?.indices.map((idx) => (
              <Card key={idx.name} className="overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{idx.name}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-mono tracking-tight">{idx.value.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="mt-2">
                    <ToneIndicator tone={idx.tone} value={idx.changePercent} isPercent />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Breadth & Watchlist Combo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Market Breadth
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-32" />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-3xl font-mono text-positive">{overview?.breadth.advances}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Advances</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-mono text-negative">{overview?.breadth.declines}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Declines</div>
                      </div>
                    </div>
                    
                    <div className="h-2 flex rounded-full overflow-hidden bg-muted">
                      {(() => {
                        const total = (overview?.breadth.advances || 0) + (overview?.breadth.declines || 0) + (overview?.breadth.unchanged || 0);
                        const advP = ((overview?.breadth.advances || 0) / total) * 100;
                        const decP = ((overview?.breadth.declines || 0) / total) * 100;
                        return (
                          <>
                            <div className="bg-positive h-full" style={{ width: `${advP}%` }} />
                            <div className="bg-muted-foreground/30 h-full flex-1" />
                            <div className="bg-negative h-full" style={{ width: `${decP}%` }} />
                          </>
                        );
                      })()}
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      {overview?.breadth.unchanged} Unchanged
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Priority Watchlist</span>
                  <Link href="/watchlist" className="text-xs text-primary hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overview?.watchlist.slice(0, 4).map(stock => (
                      <Link key={stock.symbol} href={`/stocks?symbol=${stock.symbol}`}>
                        <div className="flex justify-between items-center p-2 -mx-2 hover:bg-accent rounded-md transition-colors cursor-pointer group">
                          <div>
                            <div className="font-semibold text-sm group-hover:text-primary transition-colors">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.exchange}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm"><FormatCurrency value={stock.price} /></div>
                            <ToneIndicator className="text-xs justify-end" tone={stock.tone} value={stock.changePercent} isPercent />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Headlines */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Live Tape</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-border">
                  {overview?.headlines.map((news, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0 hover:bg-accent/50 -mx-4 px-4 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-medium mb-1 line-clamp-2">{news.title}</div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/70">{news.source}</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                        <Badge variant={news.sentiment as any} className="text-[10px] shrink-0 uppercase tracking-wider">
                          {news.sentiment}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar: AI Assistant & Disclaimer */}
        <div className="space-y-6">
          <ChatAssistant />
          
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-xs text-destructive/80">
            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Risk Disclaimer
            </div>
            <p className="leading-relaxed">
              This platform provides market intelligence for educational and research purposes only. 
              It is not a registered investment advisor. The AI-generated reports and sentiment analysis 
              do not constitute financial advice. Trading in Indian securities markets involves significant risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
