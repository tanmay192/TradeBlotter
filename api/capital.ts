import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import { z } from 'zod';
import * as schema from '../shared/schema';
import { capitalSettings } from '../shared/schema';

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

const updateCapitalSchema = z.object({
  totalCapital: z.number().min(0, "Capital must be a positive number"),
});

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
  const settings = await db.select().from(capitalSettings).limit(1);
  
  if (settings.length === 0) {
    // Create default capital setting if none exists
    const [newSettings] = await db
      .insert(capitalSettings)
      .values({ totalCapital: '100000' })
      .returning();
    return res.status(200).json(newSettings);
  }

  return res.status(200).json(settings[0]);
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { totalCapital } = updateCapitalSchema.parse(req.body);
    
    // Convert to string for decimal field
    const totalCapitalStr = totalCapital.toString();
    
    // Check if settings exist
    const existingSettings = await db.select().from(capitalSettings).limit(1);
    
    if (existingSettings.length === 0) {
      // Create new settings
      const [newSettings] = await db
        .insert(capitalSettings)
        .values({ totalCapital: totalCapitalStr })
        .returning();
      return res.status(201).json(newSettings);
    } else {
      // Update existing settings
      const [updatedSettings] = await db
        .update(capitalSettings)
        .set({ totalCapital: totalCapitalStr })
        .returning();
      return res.status(200).json(updatedSettings);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    throw error;
  }
}