#!/usr/bin/env node

/**
 * Alquimia Studio — License Key Generator
 * 
 * Usage:
 *   node generate-license.js              # Generate 1 key
 *   node generate-license.js 10           # Generate 10 keys
 *   node generate-license.js --validate XXXX-XXXX-XXXX-XXXX  # Validate a key
 */

const LICENSE_SECRET = 'ALQUIMIA2027';

function generateLicenseHash(code) {
  let hash = 0;
  const str = code.replace(/-/g, '') + LICENSE_SECRET;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase().slice(0, 8);
}

function generateLicense() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3 || i === 7) code += '-';
  }
  const hash = generateLicenseHash(code);
  return code + hash.slice(-4);
}

function validateLicense(code) {
  const cleanCode = code.replace(/-/g, '').toUpperCase();
  if (cleanCode.length !== 16) return false;
  const baseCode = cleanCode.slice(0, 12);
  const inputCode = baseCode.slice(0, 4) + '-' + baseCode.slice(4, 8) + '-' + baseCode.slice(8, 12);
  const hash = generateLicenseHash(inputCode);
  return cleanCode.endsWith(hash.slice(-4));
}

// Main
const args = process.argv.slice(2);

if (args[0] === '--validate') {
  const code = args[1];
  if (!code) {
    console.log('Usage: node generate-license.js --validate XXXX-XXXX-XXXX-XXXX');
    process.exit(1);
  }
  const isValid = validateLicense(code);
  console.log(`\n  Key: ${code}`);
  console.log(`  Status: ${isValid ? '✓ VALID' : '✗ INVALID'}\n`);
  process.exit(isValid ? 0 : 1);
}

const count = parseInt(args[0]) || 1;

console.log(`\n  Generating ${count} license key(s)...\n`);
console.log('  ─'.repeat(24));

for (let i = 0; i < count; i++) {
  const key = generateLicense();
  console.log(`  ${key}`);
}

console.log('  ─'.repeat(24));
console.log('\n  Share these keys with your customers after payment.\n');
