import { useState } from "react";
import { useLocation } from "wouter";
import { getListStocksQueryKey, useListStocks } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { ToneIndicator, FormatCurrency, FormatLargeNumber } from "@/components/formatters";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Stocks() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  
  // Use useLocation to prefill search if symbol passed in URL query, but keeping it simple for now
  
  const { data: stocks, isLoading } = useListStocks(
    { q: debouncedQuery, limit: 20 },
    { query: { queryKey: getListStocksQueryKey({ q: debouncedQuery, limit: 20 }) } }
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Stock Intelligence</h1>
          <p className="text-muted-foreground">Search and analyze NSE/BSE equities.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by symbol or company name..." 
            className="pl-9 h-11 bg-card border-border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading && !stocks ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : stocks && stocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map(stock => (
            <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                        {stock.symbol}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{stock.company}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] bg-accent">
                      {stock.exchange}
                    </Badge>
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Price</div>
                      <div className="font-mono font-medium text-lg">
                        <FormatCurrency value={stock.price} />
                      </div>
                      <ToneIndicator tone={stock.tone} value={stock.changePercent} isPercent className="text-sm mt-0.5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Market Cap</div>
                      <div className="font-mono text-sm mt-1">
                        <FormatLargeNumber value={stock.marketCap} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {stock.sector}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
          <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No equities found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">
            Try adjusting your search query. We track major NSE and BSE listings.
          </p>
        </div>
      )}
    </div>
  );
}
