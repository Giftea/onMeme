import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const db = drizzle(neon(process.env.DATABASE_URL!));

export { db };
