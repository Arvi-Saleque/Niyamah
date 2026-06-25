// Quick raw-SQL runner for migrations that drizzle-kit can't generate (extensions, GIN indexes).
// Usage: `node --env-file=.env.local scripts/apply-sql.mjs drizzle/0005_search_trgm.sql`
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/apply-sql.mjs <path-to-sql-file>");
  process.exit(1);
}

const sqlText = readFileSync(resolve(file), "utf8");
const sql = neon(process.env.DATABASE_URL);

// Split on semicolons that end a statement (very simple — fine for our migration files
// since none contain dollar-quoted blocks or function bodies).
const statements = sqlText
  .split(/;\s*$/m)
  // Strip leading comment-only lines from each chunk
  .map((s) =>
    s
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim(),
  )
  .filter((s) => s.length > 0);

for (const stmt of statements) {
  console.log("→", stmt.slice(0, 120).replace(/\s+/g, " "));
  await sql.query(stmt);
}
console.log(
  "✔ Applied",
  file,
  `(${statements.length} statement${statements.length === 1 ? "" : "s"})`,
);
