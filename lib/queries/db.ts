import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema"; // Import your tables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use an environment variable
});

export const db = drizzle(pool, { schema });
