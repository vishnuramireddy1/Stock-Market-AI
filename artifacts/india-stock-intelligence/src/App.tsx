import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/app-shell';

import Home from '@/pages/home';
import Stocks from '@/pages/stocks';
import StockDetail from '@/pages/stock-detail';
import Watchlist from '@/pages/watchlist';
import Portfolio from '@/pages/portfolio';
import Research from '@/pages/research';
import Backtesting from '@/pages/backtesting';
import News from '@/pages/news';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/stocks" component={Stocks} />
        <Route path="/stocks/:symbol" component={StockDetail} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/research" component={Research} />
        <Route path="/backtesting" component={Backtesting} />
        <Route path="/news" component={News} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster theme="dark" position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
