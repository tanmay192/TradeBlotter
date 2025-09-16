import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import * as schema from '../../shared/schema';
import { trades, insertTradeSchema } from '../../shared/schema';

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

  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Trade ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res, id);
      case 'PATCH':
        return handlePatch(req, res, id);
      case 'DELETE':
        return handleDelete(req, res, id);
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

async function handleGet(req: VercelRequest, res: VercelResponse, id: string) {
  const [trade] = await db.select().from(trades).where(eq(trades.id, id));
  
  if (!trade) {
    return res.status(404).json({ error: 'Trade not found' });
  }
  
  return res.status(200).json(trade);
}

async function handlePatch(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    // Parse body robustly (Vercel may give you a string)
    const raw = typeof req.body === 'string'
      ? (req.body ? JSON.parse(req.body) : {})
      : (req.body ?? {});

    // Accept flexible input but coerce to Drizzle column types
    // (adjust the field names to exactly match your schema)
    const update = {
      ...(raw.scripName !== undefined && { scripName: String(raw.scripName) }),
      ...(raw.quantity  !== undefined && { quantity: Number(raw.quantity) }),

      // numeric -> string in Drizzle PG
      ...(raw.buyPrice  !== undefined && { buyPrice: String(raw.buyPrice) }),
      ...(raw.sellPrice !== undefined && { sellPrice: String(raw.sellPrice) }),

      // timestamp -> Date
      ...(raw.buyDate   !== undefined && { buyDate: new Date(raw.buyDate) }),
      ...(raw.sellDate  !== undefined && { sellDate: new Date(raw.sellDate) }),

      ...(raw.isOpen    !== undefined && { isOpen: Boolean(raw.isOpen) }),
    } as Partial<typeof trades.$inferInsert>; // ensure the shape matches table

    const [updatedTrade] = await db
      .update(trades)
      .set(update)
      .where(eq(trades.id, id))
      .returning();

    if (!updatedTrade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    return res.status(200).json(updatedTrade);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (error instanceof z.ZodError) {
      // if you still want zod validation, validate `raw` first with a flexible schema
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    console.error(error);
    return res.status(400).json({ error: 'Update failed' });
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse, id: string) {
  const [deletedTrade] = await db
    .delete(trades)
    .where(eq(trades.id, id))
    .returning();

  if (!deletedTrade) {
    return res.status(404).json({ error: 'Trade not found' });
  }

  return res.status(200).json({ message: 'Trade deleted successfully' });
}