import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const db = drizzle(neon(process.env.DATABASE_URL! || "postgresql://neondb_owner:npg_PV3qnjQsSzI4@ep-soft-snow-a21kry5w-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"));

export { db };
