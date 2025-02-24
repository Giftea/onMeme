import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
// import { neonConfig } from '@neondatabase/serverless';
import * as schema from "./schema";
import 'dotenv/config';
// import ws from 'ws';

// neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema: schema })
