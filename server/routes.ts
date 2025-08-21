import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTradeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all trades
  app.get("/api/trades", async (req, res) => {
    try {
      const trades = await storage.getAllTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });

  // Get single trade
  app.get("/api/trades/:id", async (req, res) => {
    try {
      const trade = await storage.getTrade(req.params.id);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trade" });
    }
  });

  // Create new trade
  app.post("/api/trades", async (req, res) => {
    try {
      const validatedData = insertTradeSchema.parse(req.body);
      const trade = await storage.createTrade(validatedData);
      res.status(201).json(trade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trade" });
    }
  });

  // Update trade
  app.patch("/api/trades/:id", async (req, res) => {
    try {
      const validatedData = insertTradeSchema.partial().parse(req.body);
      const trade = await storage.updateTrade(req.params.id, validatedData);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.json(trade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update trade" });
    }
  });

  // Delete trade
  app.delete("/api/trades/:id", async (req, res) => {
    try {
      const success = await storage.deleteTrade(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trade" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
