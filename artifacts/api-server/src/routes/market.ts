import { Router, type IRouter } from "express";
import {
  ChatWithResearchAssistantBody,
  CreateResearchReportBody,
  GetStockParams,
  ListStocksQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const disclaimer =
  "Educational research only. This is not investment advice and does not guarantee returns. Validate data and consider your own risk tolerance before acting.";

const stocks = [
  { symbol: "RELIANCE", company: "Reliance Industries", exchange: "NSE" as const, price: 1_428.4, change: 18.2, changePercent: 1.29, volume: 8_420_000, marketCap: 1_930_000, sector: "Energy", tone: "positive" as const },
  { symbol: "HDFCBANK", company: "HDFC Bank", exchange: "NSE" as const, price: 1_742.8, change: -9.6, changePercent: -0.55, volume: 4_180_000, marketCap: 1_310_000, sector: "Financials", tone: "negative" as const },
  { symbol: "TCS", company: "Tata Consultancy Services", exchange: "NSE" as const, price: 3_884.1, change: 42.6, changePercent: 1.11, volume: 1_360_000, marketCap: 1_410_000, sector: "Information Technology", tone: "positive" as const },
  { symbol: "INFY", company: "Infosys", exchange: "NSE" as const, price: 1_566.7, change: 12.4, changePercent: 0.8, volume: 2_910_000, marketCap: 650_000, sector: "Information Technology", tone: "positive" as const },
  { symbol: "ICICIBANK", company: "ICICI Bank", exchange: "NSE" as const, price: 1_188.5, change: -3.1, changePercent: -0.26, volume: 3_220_000, marketCap: 840_000, sector: "Financials", tone: "negative" as const },
  { symbol: "BHARTIARTL", company: "Bharti Airtel", exchange: "NSE" as const, price: 1_824.3, change: 21.9, changePercent: 1.22, volume: 1_980_000, marketCap: 1_090_000, sector: "Telecom", tone: "positive" as const },
];

const chartFor = (base: number) =>
  Array.from({ length: 30 }, (_, index) => ({
    time: `Jun ${index + 1}`,
    close: Number((base * (0.96 + index * 0.0015 + Math.sin(index / 2.4) * 0.008)).toFixed(2)),
    volume: Math.round(200000 + Math.abs(Math.sin(index)) * 700000),
  }));

router.get("/market/overview", (_req, res) => {
  res.json({
    asOf: new Date().toISOString(),
    indices: [
      { name: "NIFTY 50", value: 24_812.4, change: 186.2, changePercent: 0.76, tone: "positive" },
      { name: "SENSEX", value: 81_765.4, change: 612.8, changePercent: 0.75, tone: "positive" },
      { name: "NIFTY BANK", value: 56_421.8, change: -42.1, changePercent: -0.07, tone: "negative" },
    ],
    breadth: { advances: 1286, declines: 934, unchanged: 86 },
    watchlist: stocks.slice(0, 5),
    headlines: [
      { title: "FII flows turn supportive as global risk appetite improves", source: "Market Desk", time: "18 min ago", sentiment: "positive" },
      { title: "RBI keeps policy stance focused on durable inflation alignment", source: "RBI", time: "42 min ago", sentiment: "neutral" },
      { title: "IT majors guide to resilient deal pipeline in next quarter", source: "Business Standard", time: "1 hr ago", sentiment: "positive" },
      { title: "Crude stabilizes near $82 as supply concerns ease", source: "Reuters", time: "2 hrs ago", sentiment: "neutral" },
    ],
  });
});

router.get("/market/stocks", (req, res) => {
  const parsed = ListStocksQueryParams.parse(req.query);
  const query = (parsed.q ?? "").toLowerCase();
  const limit = parsed.limit ?? 20;
  res.json(stocks.filter((stock) => !query || `${stock.symbol} ${stock.company}`.toLowerCase().includes(query)).slice(0, limit));
});

router.get("/market/stocks/:symbol", (req, res) => {
  const { symbol } = GetStockParams.parse(req.params);
  const stock = stocks.find((item) => item.symbol === symbol.toUpperCase());
  if (!stock) {
    res.status(404).json({ error: "Stock not found in tracked universe" });
    return;
  }
  res.json({
    quote: stock,
    indicators: [
      { name: "RSI (14)", value: 61.8, signal: "bullish" },
      { name: "MACD", value: 18.4, signal: "bullish" },
      { name: "ADX", value: 27.6, signal: "bullish" },
      { name: "VWAP", value: stock.price * 0.992, signal: "bullish" },
      { name: "ATR (14)", value: stock.price * 0.018, signal: "neutral" },
      { name: "52W range", value: 68.2, signal: "neutral" },
    ],
    score: 78,
    thesis: `${stock.company} is showing constructive price action with improving momentum. The signal is strongest when the price holds above VWAP while breadth remains supportive.`,
    risks: ["Valuation can compress if earnings growth misses expectations.", "Macro, currency, and sector rotation may change the setup quickly.", "Market data may be delayed depending on the upstream provider."],
    chart: chartFor(stock.price),
  });
});

router.post("/research", async (req, res) => {
  const input = CreateResearchReportBody.parse(req.body);
  const stock = stocks.find((item) => item.symbol === input.symbol.toUpperCase());
  if (!stock) {
    res.status(404).json({ error: "Stock not found in tracked universe" });
    return;
  }
  const report = await generateGeminiReport(stock, input.horizon);
  res.json(report);
});

router.post("/chat", async (req, res) => {
  const input = ChatWithResearchAssistantBody.parse(req.body);
  const answer = await askGemini(input.message, input.context);
  res.json({ answer, confidence: 0.78, sources: ["Market intelligence workspace", "Tracked NSE universe"], disclaimer });
});

async function askGemini(message: string, context?: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "Gemini is not configured. Add GEMINI_API_KEY to enable AI research responses.";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `You are an evidence-led Indian stock research assistant. Never guarantee returns, never issue certainty, state assumptions and risks. ${context ?? ""}\n\nQuestion: ${message}` }] }] }),
  });
  if (!response.ok) return "The research assistant could not reach Gemini right now. Please retry.";
  const payload = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") || "No answer was returned.";
}

async function generateGeminiReport(stock: (typeof stocks)[number], horizon: string) {
  const answer = await askGemini(`Create a concise ${horizon} research brief for ${stock.company} (${stock.symbol}). Use this quote context: price ${stock.price}, day change ${stock.changePercent}%, sector ${stock.sector}. Return plain text with business, financials, technicals, catalysts, risks, bull case, bear case, and what would invalidate the thesis.`);
  return {
    id: `research-${stock.symbol.toLowerCase()}-${Date.now()}`,
    symbol: stock.symbol,
    generatedAt: new Date().toISOString(),
    confidence: 0.78,
    recommendation: "constructive",
    summary: answer.slice(0, 420),
    sections: [{ title: "AI research brief", content: answer }],
    disclaimer,
  };
}

export default router;