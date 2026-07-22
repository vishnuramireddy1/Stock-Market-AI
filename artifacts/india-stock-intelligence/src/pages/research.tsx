import { useState } from "react";
import { useCreateResearchReport } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, FileText, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import type { ResearchReport } from "@workspace/api-client-react";

export default function Research() {
  const [symbol, setSymbol] = useState("");
  const [horizon, setHorizon] = useState<"swing" | "medium" | "long-term">("medium");
  const [report, setReport] = useState<ResearchReport | null>(null);

  const reportMutation = useCreateResearchReport();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;
    
    reportMutation.mutate(
      { data: { symbol: symbol.toUpperCase(), horizon, includeNews: true } },
      {
        onSuccess: (data) => {
          setReport(data);
          toast.success("Report generated successfully");
        },
        onError: () => {
          toast.error("Failed to generate report");
        }
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" /> AI Research Desk
        </h1>
        <p className="text-muted-foreground">Generate institutional-grade investment reports instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <Card className="lg:col-span-1 border-primary/20 bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> New Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Symbol (NSE/BSE)</label>
                <Input 
                  placeholder="e.g. RELIANCE, TATAMOTORS" 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="font-mono uppercase"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Investment Horizon</label>
                <div className="grid grid-cols-1 gap-2">
                  {(["swing", "medium", "long-term"] as const).map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHorizon(h)}
                      className={`text-left px-4 py-3 rounded-md border text-sm transition-all ${
                        horizon === h 
                          ? "border-primary bg-primary/10 text-primary font-medium" 
                          : "border-border hover:border-border/80 text-muted-foreground"
                      }`}
                    >
                      <div className="capitalize">{h.replace('-', ' ')}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {h === 'swing' ? '1-4 weeks outlook' : h === 'medium' ? '3-6 months outlook' : '1-3 years outlook'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!symbol || reportMutation.isPending}
              >
                {reportMutation.isPending ? "Analyzing Data..." : "Generate Report"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Report Output */}
        <div className="lg:col-span-2 space-y-6">
          {reportMutation.isPending && (
            <Card className="h-[500px] flex items-center justify-center border-dashed">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center mx-auto animate-[spin_3s_linear_infinite]">
                  <Sparkles className="w-5 h-5 text-primary animate-[spin_3s_linear_infinite_reverse]" />
                </div>
                <h3 className="font-medium text-lg">Synthesizing Intelligence...</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Aggregating price action, technical signals, recent filings, and market sentiment.
                </p>
              </div>
            </Card>
          )}

          {!reportMutation.isPending && !report && (
            <Card className="h-[500px] flex items-center justify-center bg-transparent border-dashed">
              <div className="text-center text-muted-foreground max-w-sm">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Select a symbol and horizon to generate a comprehensive AI research report.</p>
              </div>
            </Card>
          )}

          {report && !reportMutation.isPending && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <Card className="border-t-4 border-t-primary">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20">
                        {horizon.toUpperCase()} OUTLOOK
                      </Badge>
                      <CardTitle className="text-2xl font-bold tracking-tight mb-2">
                        {report.symbol} Deep Dive
                      </CardTitle>
                      <CardDescription>
                        Generated on {new Date(report.generatedAt).toLocaleString('en-IN')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Conviction</div>
                      <div className="text-3xl font-mono text-primary font-bold">{(report.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* Recommendation Badge */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border border-border">
                    <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Action:</span>
                    <Badge variant={
                      report.recommendation === 'constructive' ? 'positive' :
                      report.recommendation === 'cautious' ? 'negative' : 'neutral'
                    } className="text-sm px-3 py-1 uppercase tracking-widest">
                      {report.recommendation}
                    </Badge>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" /> Executive Summary
                    </h3>
                    <p className="text-foreground/90 leading-relaxed text-sm">
                      {report.summary}
                    </p>
                  </div>

                  {/* Dynamic Sections */}
                  <div className="space-y-6">
                    {report.sections.map((section, idx) => (
                      <div key={idx} className="pt-6 border-t border-border/50">
                        <h3 className="text-lg font-bold mb-3">{section.title}</h3>
                        <div className="text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="bg-muted p-4 rounded-lg text-xs text-muted-foreground flex gap-3">
                      <ShieldAlert className="w-5 h-5 shrink-0 text-foreground/50" />
                      <p className="leading-relaxed italic">{report.disclaimer}</p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
