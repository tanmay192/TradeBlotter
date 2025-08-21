import { type Trade, type InsertTrade } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trade operations
  getAllTrades(): Promise<Trade[]>;
  getTrade(id: string): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, trade: Partial<InsertTrade>): Promise<Trade | undefined>;
  deleteTrade(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private trades: Map<string, Trade>;

  constructor() {
    this.users = new Map();
    this.trades = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllTrades(): Promise<Trade[]> {
    return Array.from(this.trades.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTrade(id: string): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = {
      ...insertTrade,
      id,
      quantity: insertTrade.quantity.toString(),
      buyPrice: insertTrade.buyPrice.toString(),
      sellPrice: insertTrade.sellPrice?.toString() || null,
      isOpen: !insertTrade.sellPrice || !insertTrade.sellDate,
      createdAt: new Date(),
    };
    this.trades.set(id, trade);
    return trade;
  }

  async updateTrade(id: string, updateData: Partial<InsertTrade>): Promise<Trade | undefined> {
    const existingTrade = this.trades.get(id);
    if (!existingTrade) {
      return undefined;
    }

    const updatedTrade: Trade = {
      ...existingTrade,
      ...updateData,
      quantity: updateData.quantity?.toString() || existingTrade.quantity,
      buyPrice: updateData.buyPrice?.toString() || existingTrade.buyPrice,
      sellPrice: updateData.sellPrice?.toString() || existingTrade.sellPrice,
      isOpen: !updateData.sellPrice || !updateData.sellDate ? 
        (!existingTrade.sellPrice || !existingTrade.sellDate) : false,
    };

    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  async deleteTrade(id: string): Promise<boolean> {
    return this.trades.delete(id);
  }
}

// Import existing types
import { type User, type InsertUser } from "@shared/schema";

export const storage = new MemStorage();
