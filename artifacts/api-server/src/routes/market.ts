import { Router, type IRouter } from "express";
import {
  ChatWithResearchAssistantBody,
  CreateResearchReportBody,
  CreateSwingDeskBriefBody,
  GetStockParams,
  ListStocksQueryParams,
} from "@workspace/api-zod";
import { db, tradeJournalTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

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
  const isTimeRequest = /\b(current|present|now|local)\b.*\b(time|date)\b|\bwhat(?:'s| is)\s+the\s+(?:current\s+)?time\b/i.test(input.message);
  if (isTimeRequest) {
    const now = new Date();
    const indiaTime = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    }).format(now);
    res.json({
      answer: `Current India time: ${indiaTime} (IST).`,
      confidence: 1,
      sources: ["Server clock", "Asia/Kolkata timezone"],
      disclaimer,
    });
    return;
  }
  const isSwingRequest = /\b(swing|trade|entry|exit|stop[- ]?loss|target|week|days?)\b/i.test(input.message);
  const openTrades = await db
    .select()
    .from(tradeJournalTable)
    .where(eq(tradeJournalTable.status, "OPEN"));
  const journalContext = openTrades.length
    ? `Stored open trades for follow-up reference: ${openTrades.map((trade) => `${trade.symbol} x${trade.quantity} entered ₹${trade.entryPrice}, stop ₹${trade.stopPrice ?? "not set"}, target ₹${trade.targetPrice ?? "not set"}, planned exit ${trade.plannedExitAt?.toISOString() ?? "not set"}, follow-up ${trade.followUpStatus}${trade.followUpNotes ? ` (${trade.followUpNotes})` : ""}`).join("; ")}`
    : "No open trades are stored in the journal.";
  const answer = isSwingRequest
    ? await orchestrateSwingAnswer(input.message, `${input.context || ""}\n${journalContext}`)
    : await askGemini(input.message, `${input.context || ""}\n${journalContext}`);
  const isProviderFallback = answer.startsWith("Assistant status: Gemini is temporarily unavailable");
  res.json({
    answer,
    confidence: isProviderFallback ? 0 : isSwingRequest ? 0.76 : 0.78,
    sources: isProviderFallback
      ? ["Gemini provider status"]
      : ["Quant Assistant", "Swing portfolio agent", "Global politics & macro agent", "Entry/exit setup agent", "Tracked NSE universe"],
    disclaimer,
  });
});

router.post("/swing/desk", async (req, res) => {
  const input = CreateSwingDeskBriefBody.parse(req.body);
  const stock = stocks.find((item) => item.symbol === input.symbol.toUpperCase());
  if (!stock) {
    res.status(404).json({ error: "Stock not found in tracked universe" });
    return;
  }

  const context = `Stock: ${stock.company} (${stock.symbol}), price ₹${stock.price}, day change ${stock.changePercent}%, sector ${stock.sector}. Planned holding period: ${input.holdingPeriodDays} trading days. Portfolio context: ${input.portfolioContext || "No portfolio context supplied."}`;
  const [portfolioCoach, globalPolitics, tradeSetup] = await Promise.all([
    askGeminiRole(
      "You are the swing-portfolio coach. Suggest position sizing principles, concentration limits, what portfolio context to review, and how to manage an existing swing position. Do not invent holdings. Do not place orders. Keep the response practical and concise.",
      context,
      `For ${stock.symbol}, review the swing portfolio role. Use conditional language and clearly state what information is missing.`
    ),
    askGeminiRole(
      "You are the global politics and macro risk analyst for an Indian swing trader. Explain how current geopolitical developments could affect Indian equities through crude oil, USD/INR, rates, supply chains, risk appetite, and FII flows. Do not claim live events you cannot verify; separate known context from scenarios.",
      context,
      `For ${stock.symbol}, provide a global-politics/macro risk lens for the next ${input.holdingPeriodDays} trading days.`
    ),
    askGeminiRole(
      "You are a technical swing setup analyst. Give a conditional educational setup, never a guaranteed trade recommendation. Define a possible entry trigger, invalidation/stop condition, one or two target zones, and exit-management rules. Say when no-trade is preferable. Never present exact levels as live facts unless provided in the context.",
      context,
      `For ${stock.symbol}, describe what would confirm entry and what would confirm exit for a swing trade.`
    ),
  ]);

  res.json({
    symbol: stock.symbol,
    generatedAt: new Date().toISOString(),
    portfolioCoach,
    globalPolitics,
    tradeSetup,
    confidence: 0.72,
    sources: ["Market intelligence workspace", "Tracked NSE universe", "User-supplied portfolio context"],
    disclaimer: `${disclaimer} Swing setups are conditional scenarios, not instructions to buy or sell. Confirm live price, liquidity, news, and your predefined risk before acting.`,
  });
});

async function askGemini(message: string, context?: string) {
  const verifiedUniverse = stocks
    .map((stock) => `${stock.symbol} (${stock.company}, ${stock.sector}, tracked quote ₹${stock.price}, day change ${stock.changePercent}%)`)
    .join("; ");
  const prompt = `You are the user's personal Indian swing-trading desk assistant. The user is the boss; answer like a concise, decisive executive briefing, not like a generic refusal or legal disclaimer.

For stock-selection questions, you ARE allowed to provide a ranked shortlist of suggested candidates for research and a preferred candidate when the available evidence supports one. Do not hide behind phrases such as "I cannot provide buy/sell recommendations." Instead say "My suggested shortlist is..." and explain the evidence. Only rank symbols explicitly present in the supplied market context or verified by a data source available to this system. Never introduce SBIN, LT, or any other symbol merely because it sounds plausible. If a requested candidate is not in the available universe, label it "research lead — data unavailable" and do not give it current technical claims, targets, or confidence.

For a 1–60 trading-day swing horizon, structure the answer as:
1. Executive call: shortlist, ranking, and whether the setup is actionable now or wait.
2. Evidence: price/technical/fundamental/news or macro factors actually available in context.
3. Trade plan per candidate: entry trigger or entry zone, invalidation/stop condition, target zone, expected holding window, and risk/reward.
4. Portfolio fit: suggested risk allocation, correlation/concentration warning, and number of positions.
5. Catalysts, risks, and what would change the view.
6. Next action: what the boss should verify before acting.

Verified tracked universe available right now: ${verifiedUniverse}

Never invent live prices, current news, institutional flows, earnings dates, technical indicators, chart patterns, or sources. If live evidence is unavailable, label the item "data required" and give a conditional rule instead of a fabricated fact. You may recommend "wait/no trade" when the setup is weak. Never guarantee returns, claim certainty, or place/execute an order. Keep one short educational-risk note at the end rather than leading with a refusal.

${context ?? ""}

Question: ${message}`;
  return requestGemini(prompt);
}

async function requestGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return "Gemini is not configured. This workspace can still show tracked-market context, but AI analysis requires GEMINI_API_KEY.";
  let lastError = "unknown upstream error";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(30_000),
      });
      if (response.ok) {
        const payload = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") || "Gemini returned no analysis. Review the tracked-market data and retry.";
      }
      lastError = `gemini-flash-latest: HTTP ${response.status}`;
    } catch (error) {
      lastError = `gemini-flash-latest: ${error instanceof Error ? error.message : "network error"}`;
    }
    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  console.warn({ lastError }, "Gemini request failed after retry");
  return `Assistant status: Gemini is temporarily unavailable (${lastError}). I cannot produce a current evidence-ranked shortlist until the model responds. Use the tracked-market screen only as background and do not treat it as a live trade plan.`;
}

async function askGeminiRole(role: string, context: string, question: string) {
  return requestGemini(`${role}\n\n${context}\n\n${question}`);
}

async function orchestrateSwingAnswer(message: string, context?: string) {
  const stockContext = `User request: ${message}\nUser context: ${context || "No additional portfolio context supplied."}`;
  const [portfolio, macro, setup] = await Promise.all([
    askGeminiRole(
      "You are the swing portfolio agent reporting to a lead Quant Assistant. Return only compact portfolio guidance: max risk, position size principle, concentration warning, and whether the idea fits a one-week swing. Do not invent holdings or live data.",
      stockContext,
      "Assess the portfolio fit for the user's request in 4 short bullets."
    ),
    askGeminiRole(
      "You are the global politics and macro agent reporting to a lead Quant Assistant. Return only the macro risks that could affect a one-week Indian equity swing through crude, USD/INR, rates, FII flows, or geopolitical risk. Separate verified context from data required. Use 3 short bullets.",
      stockContext,
      "Assess the global and macro backdrop relevant to this request."
    ),
    askGeminiRole(
      "You are the entry/exit setup agent reporting to a lead Quant Assistant. Return a compact conditional setup using only verified symbols and supplied prices. Include candidate, entry trigger/zone, stop or invalidation, target, and exit deadline. If exact levels are not supported by data, say data required and give a trigger rule instead. Never invent live indicators.",
      stockContext,
      "Create the best available one-week swing setup, or say WAIT if evidence is insufficient."
    ),
  ]);

  return requestGemini(
    `You are the lead Quant Assistant. The user is the boss and wants a short answer, not a research report.

Return exactly these seven lines and nothing else:

CALL: <one stock symbol or WAIT>
ENTRY: <price/zone or trigger>
STOP: <price/condition>
TARGET: <price/zone>
EXIT BY: <date or number of trading days>
WHY: <one sentence>
RISK: <one sentence>

Use only symbols and facts supported by the verified universe below. If exact price levels or a date are not supported, write DATA REQUIRED and provide the conditional rule. Do not list multiple candidates unless the boss asks for a shortlist. Do not add headings, markdown, confidence, sources, or a disclaimer.

VERIFIED UNIVERSE:
${stocks.map((stock) => `${stock.symbol} (${stock.company}, ${stock.sector}, tracked quote ₹${stock.price}, day change ${stock.changePercent}%)`).join("; ")}

PORTFOLIO AGENT:
${portfolio}

MACRO AGENT:
${macro}

ENTRY/EXIT AGENT:
${setup}

USER REQUEST:
${message}

USER CONTEXT:
${context || "No additional portfolio context supplied."}`,
  );
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