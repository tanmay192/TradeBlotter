import { type Trade, type InsertTrade, type CapitalSettings, capitalSettings, trades } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Trade operations
  getAllTrades(): Promise<Trade[]>;
  getTrade(id: string): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, trade: Partial<InsertTrade>): Promise<Trade | undefined>;
  deleteTrade(id: string): Promise<boolean>;
  
  // Capital operations
  getTotalCapital(): Promise<number>;
  updateTotalCapital(amount: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  constructor() {}

  async initializeCapital(): Promise<void> {
    const existing = await db.select().from(capitalSettings).limit(1);
    if (existing.length === 0) {
      await db.insert(capitalSettings).values({ totalCapital: '0' });
    }
  }

  async getAllTrades(): Promise<Trade[]> {
    const result = await db.select().from(trades).orderBy(desc(trades.createdAt));
    return result;
  }

  async getTrade(id: string): Promise<Trade | undefined> {
    const [result] = await db.select().from(trades).where(eq(trades.id, id));
    return result || undefined;
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values({
        scripName: insertTrade.scripName,
        quantity: insertTrade.quantity.toString(),
        buyPrice: insertTrade.buyPrice.toString(),
        sellPrice: insertTrade.sellPrice?.toString() || null,
        buyDate: insertTrade.buyDate,
        sellDate: insertTrade.sellDate || null,
        isOpen: !insertTrade.sellPrice || !insertTrade.sellDate,
      })
      .returning();
    return trade;
  }

  async updateTrade(id: string, updateData: Partial<InsertTrade>): Promise<Trade | undefined> {
    const updateValues: any = {};
    
    if (updateData.scripName !== undefined) updateValues.scripName = updateData.scripName;
    if (updateData.quantity !== undefined) updateValues.quantity = updateData.quantity.toString();
    if (updateData.buyPrice !== undefined) updateValues.buyPrice = updateData.buyPrice.toString();
    if (updateData.sellPrice !== undefined) updateValues.sellPrice = updateData.sellPrice?.toString() || null;
    if (updateData.buyDate !== undefined) updateValues.buyDate = updateData.buyDate;
    if (updateData.sellDate !== undefined) updateValues.sellDate = updateData.sellDate || null;
    
    // Update isOpen based on sell data
    if (updateData.sellPrice !== undefined || updateData.sellDate !== undefined) {
      updateValues.isOpen = !updateData.sellPrice || !updateData.sellDate;
    }

    const [trade] = await db
      .update(trades)
      .set(updateValues)
      .where(eq(trades.id, id))
      .returning();
    
    return trade || undefined;
  }

  async deleteTrade(id: string): Promise<boolean> {
    const result = await db.delete(trades).where(eq(trades.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTotalCapital(): Promise<number> {
    await this.initializeCapital();
    const [result] = await db.select().from(capitalSettings).limit(1);
    return parseFloat(result?.totalCapital || '0');
  }

  async updateTotalCapital(amount: number): Promise<number> {
    await this.initializeCapital();
    const [result] = await db
      .update(capitalSettings)
      .set({ totalCapital: amount.toString(), updatedAt: new Date() })
      .returning();
    
    return parseFloat(result?.totalCapital || '0');
  }
}

export const storage = new DatabaseStorage();
