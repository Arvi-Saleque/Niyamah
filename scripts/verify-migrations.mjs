import fs from "fs";
import path from "path";

const DRIZZLE_DIR = path.join(process.cwd(), "drizzle");
const META_DIR = path.join(DRIZZLE_DIR, "meta");
const JOURNAL_FILE = path.join(META_DIR, "_journal.json");

function exitError(msg) {
  console.error(`❌ Migration verification failed: ${msg}`);
  process.exit(1);
}

// 1. Check if journal exists
if (!fs.existsSync(JOURNAL_FILE)) {
  exitError("Missing drizzle/meta/_journal.json");
}

// 2. Read and parse journal
let journal;
try {
  journal = JSON.parse(fs.readFileSync(JOURNAL_FILE, "utf-8"));
} catch {
  exitError("Invalid JSON in _journal.json");
}

if (!journal.entries || !Array.isArray(journal.entries)) {
  exitError("Invalid journal structure: missing entries array");
}

// 3. Verify sequential logic and SQL files
const tags = new Set();
const prefixes = new Set();
for (let i = 0; i < journal.entries.length; i++) {
  const entry = journal.entries[i];
  if (entry.idx !== i) {
    exitError(`Journal index mismatch: expected ${i}, found ${entry.idx}`);
  }

  if (tags.has(entry.tag)) {
    exitError(`Duplicate migration tag: ${entry.tag}`);
  }
  tags.add(entry.tag);

  const prefix = entry.tag.split("_")[0];
  if (prefixes.has(prefix)) {
    exitError(`Duplicate migration prefix: ${prefix} found in ${entry.tag}`);
  }
  prefixes.add(prefix);

  const sqlFile = path.join(DRIZZLE_DIR, `${entry.tag}.sql`);
  if (!fs.existsSync(sqlFile)) {
    exitError(`Missing SQL file for migration: ${entry.tag}.sql`);
  }
}

// 3.5 Check for unreferenced SQL files and files with duplicate numeric prefixes
const sqlFiles = fs.readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith(".sql"));
const usedPrefixes = new Set();
for (const file of sqlFiles) {
  const baseName = file.replace(".sql", "");
  const prefixMatch = baseName.match(/^(\d+)_/);
  if (prefixMatch) {
    const pfx = prefixMatch[1];
    if (usedPrefixes.has(pfx)) {
      exitError(`Two migration files use the same numeric prefix: ${pfx} (e.g. ${file})`);
    }
    usedPrefixes.add(pfx);
  }
  if (!tags.has(baseName)) {
    exitError(`Unreferenced SQL migration file found: ${file}`);
  }
}

// 4. Specifically check 0002_lucky_cerebro.sql for idempotency fixes
const migration0002Path = path.join(DRIZZLE_DIR, "0002_lucky_cerebro.sql");
if (fs.existsSync(migration0002Path)) {
  const content = fs.readFileSync(migration0002Path, "utf-8");
  if (content.includes('CREATE TABLE "newsletter_subscribers"')) {
    exitError("0002_lucky_cerebro.sql still contains unsafe duplicate CREATE TABLE");
  }
  if (content.includes('ADD COLUMN "shipping_name"')) {
    exitError("0002_lucky_cerebro.sql still contains unsafe duplicate ADD COLUMN");
  }
}

console.log("✅ Migration verification passed.");
process.exit(0);
