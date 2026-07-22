import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, insertTradeJournalSchema, tradeJournalTable } from "@workspace/db";
import { CreateTradeBody, UpdateTradeBody, UpdateTradeParams } from "@workspace/api-zod";

const router: IRouter = Router();

const serializeTrade = (trade: typeof tradeJournalTable.$inferSelect) => ({
  ...trade,
  entryPrice: Number(trade.entryPrice),
  stopPrice: trade.stopPrice === null ? null : Number(trade.stopPrice),
  targetPrice: trade.targetPrice === null ? null : Number(trade.targetPrice),
  exitPrice: trade.exitPrice === null ? null : Number(trade.exitPrice),
  plannedExitAt: trade.plannedExitAt?.toISOString() ?? null,
  exitedAt: trade.exitedAt?.toISOString() ?? null,
  createdAt: trade.createdAt.toISOString(),
  updatedAt: trade.updatedAt.toISOString(),
});

router.get("/trades", async (_req, res) => {
  const trades = await db.select().from(tradeJournalTable).orderBy(desc(tradeJournalTable.createdAt));
  res.json(trades.map(serializeTrade));
});

router.post("/trades", async (req, res) => {
  const input = CreateTradeBody.parse(req.body);
  const values = insertTradeJournalSchema.parse({
    ...input,
    symbol: input.symbol.toUpperCase(),
    plannedExitAt: input.plannedExitAt ? new Date(input.plannedExitAt) : undefined,
    followUpStatus: "Monitoring not started",
  });
  const [trade] = await db.insert(tradeJournalTable).values(values).returning();
  res.status(201).json(serializeTrade(trade));
});

router.patch("/trades/:id", async (req, res) => {
  const { id } = UpdateTradeParams.parse(req.params);
  const input = UpdateTradeBody.parse(req.body);
  const [trade] = await db
    .update(tradeJournalTable)
    .set({
      status: input.status,
      exitPrice: input.exitPrice === undefined ? undefined : String(input.exitPrice),
      exitReason: input.exitReason,
      followUpStatus: input.followUpStatus,
      followUpNotes: input.followUpNotes,
      exitedAt: input.exitedAt ? new Date(input.exitedAt) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(tradeJournalTable.id, id))
    .returning();
  if (!trade) {
    res.status(404).json({ error: "Trade not found" });
    return;
  }
  res.json(serializeTrade(trade));
});

export default router;