import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scripName: text("scrip_name").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  buyPrice: decimal("buy_price", { precision: 10, scale: 2 }).notNull(),
  sellPrice: decimal("sell_price", { precision: 10, scale: 2 }),
  buyDate: date("buy_date").notNull(),
  sellDate: date("sell_date"),
  isOpen: boolean("is_open").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const capitalSettings = pgTable("capital_settings", {
  id: serial("id").primaryKey(),
  totalCapital: decimal("total_capital", { precision: 15, scale: 2 }).notNull().default('0'),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  createdAt: true,
}).extend({
  quantity: z.coerce.number().positive("Quantity must be positive"),
  buyPrice: z.coerce.number().positive("Buy price must be positive"),
  sellPrice: z.coerce.number().positive("Sell price must be positive").optional(),
  buyDate: z.string().min(1, "Buy date is required"),
  sellDate: z.string().optional(),
});

export const insertCapitalSchema = createInsertSchema(capitalSettings).omit({
  id: true,
  updatedAt: true,
}).extend({
  totalCapital: z.coerce.number().min(0, "Capital must be non-negative"),
});

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertCapital = z.infer<typeof insertCapitalSchema>;
export type CapitalSettings = typeof capitalSettings.$inferSelect;
