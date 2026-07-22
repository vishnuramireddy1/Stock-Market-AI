import { Link, useLocation } from "wouter";
import { 
  Activity, 
  BookOpen, 
  Briefcase, 
  LineChart, 
  PieChart, 
  Settings, 
  Newspaper,
  LayoutDashboard,
  Search,
  Bell
  ,Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getHealthCheckQueryKey, useHealthCheck } from "@workspace/api-client-react";

const NAV_ITEMS = [
  { href: "/", label: "Desk", icon: LayoutDashboard },
  { href: "/stocks", label: "Intel", icon: Activity },
  { href: "/watchlist", label: "Watchlist", icon: Bell },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/research", label: "Research", icon: BookOpen },
  { href: "/swing-desk", label: "Swing Desk", icon: Target },
  { href: "/backtesting", label: "Lab", icon: LineChart },
  { href: "/news", label: "Tape", icon: Newspaper },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 30000 } });

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col z-20 max-md:w-[72px]">
        <div className="h-16 flex items-center px-6 max-md:px-0 max-md:justify-center border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="w-5 h-5" />
            <span className="font-bold tracking-wide text-lg text-foreground max-md:hidden">IND<span className="text-primary">DESK</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider max-md:hidden">
            Cockpit
          </div>
          {NAV_ITEMS.slice(0, 4).map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                  <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span className="max-md:hidden">{item.label}</span>
                </div>
              </Link>
            );
          })}

          <div className="px-3 mt-8 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider max-md:hidden">
            Analysis
          </div>
          {NAV_ITEMS.slice(4).map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span className="max-md:hidden">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <Link href="/settings" className="block">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}>
              <Settings className="w-4 h-4" />
              <span className="max-md:hidden">Settings</span>
            </div>
          </Link>
          
          <div className="mt-4 flex items-center justify-between px-3 text-xs text-muted-foreground">
             <span className="max-md:hidden">Market Data</span>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", health?.status === "ok" ? "bg-positive" : "bg-destructive animate-pulse")} />
              {health?.status === "ok" ? "Live" : "Connecting..."}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="noise-overlay" />
        
        {/* Topbar */}
         <header className="h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-8 max-md:px-3 z-10">
          <div className="flex items-center text-sm text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-full border border-border">
            <Search className="w-3.5 h-3.5 mr-2" />
            <span className="font-mono">CMD + K to search</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-muted-foreground text-right">
              <div>NSE / BSE</div>
              <div className="text-foreground">MARKET OPEN</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
         <div className="flex-1 overflow-auto bg-background p-8 max-md:p-4">
           <div className="max-w-6xl mx-auto pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
