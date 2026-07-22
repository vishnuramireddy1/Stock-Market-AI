import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, LineChart as ChartIcon, Terminal, Play, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Backtesting() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <ChartIcon className="w-8 h-8 text-primary" /> Strategy Lab
        </h1>
        <p className="text-muted-foreground">Test trading strategies against historical NSE/BSE data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" /> Python Strategy Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#0d1117] rounded-md p-4 font-mono text-sm overflow-x-auto border border-border/50">
              <pre className="text-muted-foreground">
                <code className="text-[#e6edf3]">
<span className="text-[#ff7b72]">def</span> <span className="text-[#d2a8ff]">strategy</span>(data):{'\n'}
{'  '}<span className="text-[#8b949e]"># Simple moving average crossover</span>{'\n'}
{'  '}sma_fast = data.close.rolling(20).mean(){'\n'}
{'  '}sma_slow = data.close.rolling(50).mean(){'\n'}
{'\n'}
{'  '}<span className="text-[#ff7b72]">if</span> sma_fast &gt; sma_slow:{'\n'}
{'    '}<span className="text-[#ff7b72]">return</span> <span className="text-[#a5d6ff]">'BUY'</span>{'\n'}
{'  '}<span className="text-[#ff7b72]">elif</span> sma_fast &lt; sma_slow:{'\n'}
{'    '}<span className="text-[#ff7b72]">return</span> <span className="text-[#a5d6ff]">'SELL'</span>{'\n'}
{'  '}<span className="text-[#ff7b72]">return</span> <span className="text-[#a5d6ff]">'HOLD'</span>
                </code>
              </pre>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">Data: NIFTY50 (2020-2024)</div>
              <Button disabled className="gap-2">
                <Play className="w-4 h-4" /> Run Simulation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">Pro Feature</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            The historical backtesting engine requires a premium data subscription. Upgrade your account to access tick-level NSE/BSE historical data and Python sandbox.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            View Upgrade Options
          </Button>
        </Card>
      </div>
    </div>
  );
}
