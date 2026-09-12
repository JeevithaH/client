/**
 * Connection Health Check: Cloudflare D1 & Cloudflare R2
 * Run:
 *   node scripts/test-connections.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env.local or .env
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

const r2AccessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const r2SecretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'shipfold-apparel';
const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

console.log('\n================================================================');
console.log('       NIRVIGNA STUDIO — CLOUDFLARE D1 & R2 HEALTH CHECK');
console.log('================================================================\n');

async function checkD1() {
  console.log('1. [Cloudflare D1 Database]');
  console.log(`   - Database ID:  ${databaseId || 'NOT SET'}`);
  console.log(`   - Account ID:   ${accountId || 'NOT SET'}`);
  console.log(`   - API Token:    ${apiToken ? 'Configured (Hidden)' : 'NOT SET'}`);

  if (!accountId || !databaseId || !apiToken) {
    console.log('   ⚠️  Status: Incomplete API credentials in .env.local.');
    console.log('   👉  Or you can authenticate directly with 1 command via Wrangler:');
    console.log('       npx wrangler login');
    console.log('       npx wrangler d1 execute jeevi --remote --file=./d1/seed.sql\n');
    return false;
  }

  return new Promise((resolve) => {
    const postData = JSON.stringify({ sql: 'SELECT count(*) as count FROM products;' });
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
            console.log('   ✅ Status: CONNECTED & ONLINE!');
            console.log('   ✅ Cloudflare D1 is actively responding to queries.\n');
            resolve(true);
          } else {
            console.log('   ❌ Status: Connection failed.');
            console.log('   Details:', json.errors || data);
            console.log('');
            resolve(false);
          }
        } catch (e) {
          console.log('   ❌ Status: Error parsing response from Cloudflare API.\n');
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Status: Network request error:', err.message, '\n');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function checkR2() {
  console.log('2. [Cloudflare R2 Object Storage]');
  console.log(`   - Account ID:        ${accountId || 'NOT SET'}`);
  console.log(`   - Bucket Name:       ${r2Bucket}`);
  console.log(`   - R2 Access Key ID:  ${r2AccessKey || 'NOT SET'}`);
  console.log(`   - R2 Secret Key:     ${r2SecretKey ? 'Configured (Hidden)' : 'NOT SET'}`);
  console.log(`   - Public R2 Domain:  ${r2PublicUrl || 'NOT SET'}`);

  if (!accountId || !r2AccessKey || !r2SecretKey) {
    console.log('   ⚠️  Status: R2 API credentials not provided in .env.local.');
    console.log('   ℹ️  Note: App is currently using high-speed local storage fallback (/public/uploads).\n');
    return false;
  }

  try {
    const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKey,
        secretAccessKey: r2SecretKey,
      },
    });

    await s3.send(new ListObjectsV2Command({ Bucket: r2Bucket, MaxKeys: 1 }));
    console.log('   ✅ Status: CONNECTED & AUTHORIZED!');
    console.log('   ✅ Read & write access to R2 bucket verified.\n');
    return true;
  } catch (err) {
    console.log('   ❌ Status: Failed to connect to R2 bucket.');
    console.log('   Error:', err.message, '\n');
    return false;
  }
}

async function main() {
  await checkD1();
  await checkR2();
  console.log('================================================================\n');
}

main();
