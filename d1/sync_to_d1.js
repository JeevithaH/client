/**
 * Cloudflare D1 Remote Database Sync Script
 *
 * Automatically pushes d1/seed.sql directly to your remote Cloudflare D1 database.
 * Usage:
 *   node d1/sync_to_d1.js
 * Or with explicit environment variables:
 *   CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_D1_DATABASE_ID=... CLOUDFLARE_API_TOKEN=... node d1/sync_to_d1.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env.local or .env.production
const envFiles = ['.env.production', '.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.join(__dirname, '..', envFile);
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        val = val.replace(/(^['"]|['"]$)/g, '').trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_D1_API_TOKEN;

console.log('\n======================================================');
console.log('       SHIPFOLD — CLOUDFLARE D1 DATABASE SYNC');
console.log('======================================================');

if (!accountId || !databaseId || !apiToken) {
  console.log('\n[NOTICE] Cloudflare D1 credentials missing from environment.');
  console.log('To sync your data to Cloudflare D1, set these in .env.production or .env.local:');
  console.log('  CLOUDFLARE_ACCOUNT_ID=' + (accountId || 'your_cloudflare_account_id'));
  console.log('  CLOUDFLARE_D1_DATABASE_ID=' + (databaseId || 'your_d1_database_uuid_here'));
  console.log('  CLOUDFLARE_API_TOKEN=' + (apiToken ? '********' : 'your_cloudflare_api_token'));
  console.log('\nOr run via Wrangler CLI:');
  console.log('  npx wrangler d1 execute jeevi --remote --file=./d1/seed.sql\n');
  process.exit(0);
}

const seedPath = path.join(__dirname, 'seed.sql');
if (!fs.existsSync(seedPath)) {
  console.error('[Error] seed.sql not found at:', seedPath);
  process.exit(1);
}

const seedSql = fs.readFileSync(seedPath, 'utf8');

// Filter out comments and split into individual statements
const statements = seedSql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`[D1 Sync] Found ${statements.length} SQL statements to execute on D1.`);
console.log(`[D1 Sync] Target Database: ${databaseId}`);
console.log(`[D1 Sync] Cloudflare Account: ${accountId}\n`);

// Function to execute SQL batch against Cloudflare D1 REST API
async function executeBatch(sqlChunk) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ sql: sqlChunk });
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.success) {
            resolve(json);
          } else {
            reject(new Error(JSON.stringify(json.errors || json.messages || data)));
          }
        } catch (e) {
          reject(new Error(`Failed to parse D1 response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const batchSize = 25; // Execute in batches of 25 statements to stay well within Cloudflare payload limits
  let executed = 0;

  for (let i = 0; i < statements.length; i += batchSize) {
    const chunk = statements.slice(i, i + batchSize).join(';\n') + ';';
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(statements.length / batchSize);

    process.stdout.write(`[D1 Sync] Executing batch ${batchNum}/${totalBatches}... `);

    try {
      await executeBatch(chunk);
      executed += Math.min(batchSize, statements.length - i);
      console.log('✓ OK');
    } catch (err) {
      console.log('✗ Failed');
      console.error(`[D1 Error]:`, err.message);
      process.exit(1);
    }
  }

  console.log(`\n🎉 [SUCCESS] All ${executed} statements successfully synced to Cloudflare D1!`);
  console.log(`   Products, variants, users, coupons, placements, and categories are now live in D1.`);
}

run();
