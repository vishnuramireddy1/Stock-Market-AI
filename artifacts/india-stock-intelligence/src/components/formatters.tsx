import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToneIndicatorProps {
  tone?: "positive" | "negative" | "neutral" | string;
  value: number;
  isPercent?: boolean;
  className?: string;
  hideIcon?: boolean;
}

export function ToneIndicator({ tone, value, isPercent, className, hideIcon }: ToneIndicatorProps) {
  const isPositive = tone === "positive" || value > 0;
  const isNegative = tone === "negative" || value < 0;
  
  const displayValue = Math.abs(value).toFixed(2);

  return (
    <div className={cn(
      "flex items-center gap-1 font-mono font-medium",
      isPositive && "text-positive",
      isNegative && "text-negative",
      !isPositive && !isNegative && "text-muted-foreground",
      className
    )}>
      {!hideIcon && (
        <>
          {isPositive && <ArrowUpIcon className="w-3 h-3" />}
          {isNegative && <ArrowDownIcon className="w-3 h-3" />}
          {!isPositive && !isNegative && <MinusIcon className="w-3 h-3" />}
        </>
      )}
      <span>{displayValue}{isPercent ? "%" : ""}</span>
    </div>
  );
}

export function FormatCurrency({ value, currency = "INR" }: { value: number; currency?: string }) {
  return (
    <span className="font-mono">
      {new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 2,
      }).format(value)}
    </span>
  );
}

export function FormatLargeNumber({ value }: { value: number }) {
  if (value >= 1e7) {
    return <span className="font-mono">{(value / 1e7).toFixed(2)} Cr</span>;
  }
  if (value >= 1e5) {
    return <span className="font-mono">{(value / 1e5).toFixed(2)} L</span>;
  }
  return <span className="font-mono">{value.toLocaleString("en-IN")}</span>;
}
