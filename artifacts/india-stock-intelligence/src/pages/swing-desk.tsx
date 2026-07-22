import { useState } from "react";
import { useCreateSwingDeskBrief } from "@workspace/api-client-react";
import type { SwingDeskResponse } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness, Globe2, LogIn, ShieldAlert, Sparkles, Target } from "lucide-react";
import { toast } from "sonner";

const roles = [
  { title: "Swing portfolio coach", icon: BriefcaseBusiness, key: "portfolioCoach" as const, tone: "text-primary" },
  { title: "Global politics & macro", icon: Globe2, key: "globalPolitics" as const, tone: "text-blue-400" },
  { title: "Entry & exit setup", icon: Target, key: "tradeSetup" as const, tone: "text-emerald-400" },
];

export default function SwingDesk() {
  const [symbol, setSymbol] = useState("");
  const [holdingPeriodDays, setHoldingPeriodDays] = useState("15");
  const [portfolioContext, setPortfolioContext] = useState("");
  const [brief, setBrief] = useState<SwingDeskResponse | null>(null);
  const mutation = useCreateSwingDeskBrief();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!symbol.trim()) return;
    mutation.mutate(
      {
        data: {
          symbol: symbol.trim().toUpperCase(),
          holdingPeriodDays: Number(holdingPeriodDays) || 15,
          portfolioContext: portfolioContext.trim() || undefined,
        },
      },
      {
        onSuccess: (data) => {
          setBrief(data);
          toast.success("Swing desk brief ready");
        },
        onError: () => toast.error("Could not generate the swing brief. Check the symbol and retry."),
      },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" /> Swing Desk
          </h1>
          <Badge variant="outline" className="border-primary/30 text-primary">PERSONAL USE · SWING ONLY</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          A decision-support brief for 1–60 trading-day ideas: portfolio fit, global macro risk, and conditional entry/exit planning.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Build a brief</CardTitle>
            <CardDescription>Give the desk enough context to challenge a setup.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">NSE/BSE symbol</label>
                <Input value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="e.g. RELIANCE" className="font-mono uppercase" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Planned holding period</label>
                <div className="flex items-center gap-3">
                  <Input type="number" min={1} max={60} value={holdingPeriodDays} onChange={(event) => setHoldingPeriodDays(event.target.value)} />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">trading days</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio context <span className="text-muted-foreground">(optional)</span></label>
                <Textarea value={portfolioContext} onChange={(event) => setPortfolioContext(event.target.value)} placeholder="Example: ₹2L capital, already holding 10 shares, max risk per trade 1%, avoid adding to IT." className="min-h-28 text-sm" />
              </div>
              <Button type="submit" className="w-full" disabled={!symbol.trim() || mutation.isPending}>
                {mutation.isPending ? "Consulting the desk..." : "Generate swing brief"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!brief && !mutation.isPending && (
            <Card className="min-h-[420px] border-dashed flex items-center justify-center">
              <div className="max-w-md text-center text-muted-foreground px-6">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h2 className="text-lg font-semibold text-foreground mb-2">Three lenses, one trade plan</h2>
                <p className="text-sm leading-relaxed">The desk will separate portfolio advice, geopolitical scenarios, and technical entry/exit conditions so you can evaluate each assumption.</p>
              </div>
            </Card>
          )}
          {mutation.isPending && (
            <Card className="min-h-[420px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-4 animate-pulse" />
                <p>Running the swing portfolio, macro, and setup lenses...</p>
              </div>
            </Card>
          )}
          {brief && !mutation.isPending && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {roles.map(({ title, icon: Icon, key, tone }) => (
                  <Card key={key} className="bg-card/70">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2"><Icon className={`w-4 h-4 ${tone}`} /> {title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">{brief[key]}</p></CardContent>
                  </Card>
                ))}
              </div>
              <Card className="border-primary/20">
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Brief</div>
                      <div className="font-mono font-bold text-lg">{brief.symbol} · {new Date(brief.generatedAt).toLocaleString("en-IN")}</div>
                    </div>
                    <div className="text-right"><div className="text-xs uppercase tracking-wider text-muted-foreground">Confidence</div><div className="text-2xl font-mono font-bold text-primary">{(brief.confidence * 100).toFixed(0)}%</div></div>
                  </div>
                  <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground">Sources: {brief.sources.join(", ")}</div>
                  <div className="flex gap-3 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground"><ShieldAlert className="w-4 h-4 shrink-0" /><span>{brief.disclaimer}</span></div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-muted-foreground flex gap-2 items-center"><ShieldAlert className="w-3.5 h-3.5" /> This desk suggests scenarios only. It does not execute trades, guarantee outcomes, or replace your own live-data and risk checks.</div>
    </div>
  );
}