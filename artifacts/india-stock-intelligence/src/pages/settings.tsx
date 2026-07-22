import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Bell, Lock, Key, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" /> Preferences
        </h1>
        <p className="text-muted-foreground">Manage your workspace and data feeds.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> API Keys
            </CardTitle>
            <CardDescription>Connect external brokers and data providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Zerodha Kite API Key</label>
              <div className="flex gap-3">
                <Input type="password" value="************************" readOnly className="font-mono bg-muted" />
                <Button variant="outline">Update</Button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">OpenAI API Key (For Custom Research)</label>
              <div className="flex gap-3">
                <Input type="password" placeholder="sk-..." className="font-mono" />
                <Button>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Alerts & Notifications
            </CardTitle>
            <CardDescription>Configure market signal alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Price Alerts</div>
                <div className="text-sm text-muted-foreground">Notify when watchlist items hit targets.</div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">AI Trade Signals</div>
                <div className="text-sm text-muted-foreground">Daily digest of strong technical setups.</div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Market Breadth Warnings</div>
                <div className="text-sm text-muted-foreground">Alert on extreme advances/declines divergence.</div>
              </div>
              <Switch checked={false} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
