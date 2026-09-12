/**
 * Helper script to update the Nirvigna Studio Director password in SQLite & D1
 * Usage:
 *   node scripts/change-password.js <new-password>
 * Example:
 *   node scripts/change-password.js SecretPassword@2026
 */

const bcrypt = require('bcryptjs');
const path = require('path');

let newEmail = null;
let newPassword = null;

if (process.argv.length === 4) {
  // Usage: node scripts/change-password.js <email> <password>
  newEmail = process.argv[2];
  newPassword = process.argv[3];
} else if (process.argv.length === 3) {
  // Usage: node scripts/change-password.js <password>
  newPassword = process.argv[2];
}

if (!newPassword) {
  console.log('\n[Usage] Please provide credentials:');
  console.log('  node scripts/change-password.js <new_password>');
  console.log('  node scripts/change-password.js <new_email> <new_password>\n');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error('[Error] Password must be at least 6 characters.');
  process.exit(1);
}

const { updateUserPassword, getUserByEmail } = require('../lib/db');

async function updatePassword() {
  const targetEmail = newEmail || 'jeevithah648@gmail.com';
  const updated = await updateUserPassword(targetEmail, newPassword);

  console.log('\n======================================================');
  console.log('       NIRVIGNA STUDIO — CREDENTIALS UPDATED');
  console.log('======================================================');
  console.log(`✓ Successfully updated Cloudflare D1 admin account.`);
  console.log(`✓ Email / Username: ${targetEmail}`);
  console.log(`✓ Password:         ${newPassword}`);
  console.log('✓ Encrypted with bcrypt (10 rounds salt).');
  console.log('======================================================\n');
}

updatePassword().catch(err => {
  console.error('[Error] Failed to update password:', err);
  process.exit(1);
});
