#!/usr/bin/env node

/**
 * Icon Fix Script for Agura App
 * This script helps fix the app icon dimensions issue
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Agura App Icon Fix Helper');
console.log('=============================\n');

console.log('🚨 CRITICAL ISSUE DETECTED:');
console.log('Your app icons are not square (1760x2000 instead of 1024x1024)');
console.log('This will cause app store rejections!\n');

console.log('📱 Required Icon Dimensions:');
console.log('- icon.png: 1024x1024 (square)');
console.log('- adaptive-icon.png: 1024x1024 (square)');
console.log('- splash-icon.png: 1242x2436 (iPhone X)\n');

console.log('🔧 How to Fix:');
console.log('1. Go to https://appicon.co/');
console.log('2. Upload your current icon');
console.log('3. Download the generated square icons');
console.log('4. Replace files in assets/images/ folder\n');

console.log('📁 Files to replace:');
const iconPath = path.join(__dirname, '../assets/images');
const files = ['icon.png', 'adaptive-icon.png', 'splash-icon.png'];

files.forEach(file => {
  const filePath = path.join(iconPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`- ${file}: ${stats.size} bytes`);
  } else {
    console.log(`- ${file}: NOT FOUND`);
  }
});

console.log('\n✅ After fixing icons:');
console.log('1. Run: npx expo prebuild --clean');
console.log('2. Test: npx expo run:android');
console.log('3. Verify icons display correctly\n');

console.log('🎯 Priority: HIGH - Must fix before app store submission');
console.log('⏱️  Time Required: 30 minutes - 2 hours');
console.log('🚫 Impact: App will be rejected without proper icons');
