import { pgEnum, pgTable, serial, text, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const tradeStatus = pgEnum("trade_status", ["OPEN", "CLOSED", "CANCELLED"]);

export const tradeJournalTable = pgTable("trade_journal", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  exchange: text("exchange").notNull().default("NSE"),
  quantity: integer("quantity").notNull(),
  entryPrice: numeric("entry_price", { precision: 14, scale: 2 }).notNull(),
  stopPrice: numeric("stop_price", { precision: 14, scale: 2 }),
  targetPrice: numeric("target_price", { precision: 14, scale: 2 }),
  plannedExitAt: timestamp("planned_exit_at", { withTimezone: true }),
  status: tradeStatus("status").notNull().default("OPEN"),
  exitPrice: numeric("exit_price", { precision: 14, scale: 2 }),
  exitedAt: timestamp("exited_at", { withTimezone: true }),
  exitReason: text("exit_reason"),
  followUpStatus: text("follow_up_status").notNull().default("Monitoring not started"),
  followUpNotes: text("follow_up_notes"),
  thesis: text("thesis"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTradeJournalSchema = createInsertSchema(tradeJournalTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTradeJournal = typeof tradeJournalTable.$inferInsert;
export type TradeJournal = typeof tradeJournalTable.$inferSelect;