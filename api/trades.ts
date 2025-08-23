import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import * as schema from '../shared/schema';
import { trades, insertTradeSchema, type Trade, type InsertTrade } from '../shared/schema';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}).end();
  }

  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PATCH':
        return handlePatch(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await pool.end();
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const allTrades = await db.select().from(trades).orderBy(trades.buyDate);
  return res.status(200).json(allTrades);
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const validatedData = insertTradeSchema.parse(req.body);
    
    // Convert numbers to strings for decimal fields
    const dbData = {
      ...validatedData,
      quantity: validatedData.quantity.toString(),
      buyPrice: validatedData.buyPrice.toString(),
      sellPrice: validatedData.sellPrice?.toString(),
    };
    
    const [newTrade] = await db
      .insert(trades)
      .values(dbData)
      .returning();
    
    return res.status(201).json(newTrade);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    throw error;
  }
}

async function handlePatch(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Trade ID is required' });
  }

  try {
    const validatedData = insertTradeSchema.partial().parse(req.body);
    
    // Convert numbers to strings for decimal fields
    const dbData: any = { ...validatedData };
    if (dbData.quantity !== undefined) {
      dbData.quantity = dbData.quantity.toString();
    }
    if (dbData.buyPrice !== undefined) {
      dbData.buyPrice = dbData.buyPrice.toString();
    }
    if (dbData.sellPrice !== undefined) {
      dbData.sellPrice = dbData.sellPrice.toString();
    }
    
    const [updatedTrade] = await db
      .update(trades)
      .set(dbData)
      .where(eq(trades.id, id))
      .returning();

    if (!updatedTrade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    return res.status(200).json(updatedTrade);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    throw error;
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Trade ID is required' });
  }

  const [deletedTrade] = await db
    .delete(trades)
    .where(eq(trades.id, id))
    .returning();

  if (!deletedTrade) {
    return res.status(404).json({ error: 'Trade not found' });
  }

  return res.status(200).json({ message: 'Trade deleted successfully' });
}