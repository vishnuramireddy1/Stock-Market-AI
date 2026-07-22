import { useGetMarketOverview } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToneIndicator, FormatCurrency, FormatLargeNumber } from "@/components/formatters";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Bell, ArrowRight } from "lucide-react";

export default function Watchlist() {
  const { data: overview, isLoading } = useGetMarketOverview();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" /> Watchlist
        </h1>
        <p className="text-muted-foreground">Tracked equities and priority signals.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[250px]">Symbol / Company</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Vol</TableHead>
                <TableHead className="text-right">Mkt Cap</TableHead>
                <TableHead className="text-right w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10" /></TableCell>
                    <TableCell><Skeleton className="h-6" /></TableCell>
                    <TableCell><Skeleton className="h-6" /></TableCell>
                    <TableCell><Skeleton className="h-6" /></TableCell>
                    <TableCell><Skeleton className="h-6" /></TableCell>
                    <TableCell><Skeleton className="h-6" /></TableCell>
                    <TableCell><Skeleton className="h-8" /></TableCell>
                  </TableRow>
                ))
              ) : overview?.watchlist.map((stock) => (
                <TableRow key={stock.symbol} className="group hover:bg-accent/50 transition-colors border-border/50">
                  <TableCell>
                    <div className="font-bold text-base flex items-center gap-2">
                      {stock.symbol}
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{stock.exchange}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">{stock.company}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {stock.sector}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    <FormatCurrency value={stock.price} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ToneIndicator tone={stock.tone} value={stock.changePercent} isPercent className="justify-end" />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    <FormatLargeNumber value={stock.volume} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    <FormatLargeNumber value={stock.marketCap} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/stocks/${stock.symbol}`}>
                      <div className="inline-flex items-center justify-center p-2 rounded-md bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
