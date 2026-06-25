import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  // During Next.js static build, avoid crashing if DB URL is omitted.
  if (process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build" || !process.env.NODE_ENV || process.env.NODE_ENV === "test") {
    console.warn("⚠️ DATABASE_URL is missing, proceeding with dummy connection...");
    process.env.DATABASE_URL = "postgres://dummy:dummy@dummy.neon.tech/dummy";
  } else {
    throw new Error("DATABASE_URL environment variable is not set");
  }
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
