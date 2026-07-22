import { useGetMarketOverview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Globe, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function News() {
  const { data: overview, isLoading } = useGetMarketOverview();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-primary" /> Market Tape
        </h1>
        <p className="text-muted-foreground">Real-time news and sentiment analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="flex flex-col h-[200px]">
              <CardHeader className="pb-2"><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" /></CardContent>
            </Card>
          ))
        ) : (
          overview?.headlines.map((news, i) => (
            <Card key={i} className="flex flex-col hover:border-primary/50 transition-colors group">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <Badge variant={news.sentiment as any} className="text-[10px] uppercase tracking-wider mb-3">
                    {news.sentiment}
                  </Badge>
                  <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                </div>
                
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Globe className="w-3.5 h-3.5" />
                    {news.source}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {news.time}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
