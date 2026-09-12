const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'shipfold.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const outputPath = path.join(__dirname, 'seed.sql');

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

const db = new Database(dbPath);
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const tables = [
  'categories',
  'users',
  'products',
  'product_variants',
  'coupons',
  'coupon_usages',
  'addresses',
  'orders',
  'order_items',
  'placements'
];

let sqlOutput = `-- ==============================================================================
-- Shipfold Atelier — Cloudflare D1 (SQLite) Complete Export & Seed Script
-- Run via: npx wrangler d1 execute shipfold-d1 --remote --file=./d1/seed.sql
-- ==============================================================================

${schemaSql}

`;

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  // String escaping: replace ' with ''
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

for (const table of tables) {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    if (rows.length === 0) continue;

    sqlOutput += `\n-- -----------------------------------------------------------------------------\n`;
    sqlOutput += `-- Data for: ${table} (${rows.length} rows)\n`;
    sqlOutput += `-- -----------------------------------------------------------------------------\n`;

    const columns = Object.keys(rows[0]);
    const colList = columns.map(c => `"${c}"`).join(', ');

    for (const row of rows) {
      const values = columns.map(col => escapeSqlValue(row[col])).join(', ');
      sqlOutput += `INSERT OR REPLACE INTO ${table} (${colList}) VALUES (${values});\n`;
    }
  } catch (err) {
    console.warn(`Skipping table ${table} or error:`, err.message);
  }
}

fs.writeFileSync(outputPath, sqlOutput, 'utf8');
console.log(`[Success] Cloudflare D1 seed file generated at: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
