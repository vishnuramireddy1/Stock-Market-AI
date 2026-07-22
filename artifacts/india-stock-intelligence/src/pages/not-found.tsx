import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <Card className="w-full max-w-md bg-transparent border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">404 - Signal Lost</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The market data endpoint you're looking for cannot be found.
          </p>
          <Link href="/">
            <Button variant="outline">Return to Desk</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
