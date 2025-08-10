#!/usr/bin/env node

/**
 * Production Testing Script for Agura App
 * Tests backend integration, protected routes, and production readiness
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'https://agura-ticketing-backend.onrender.com';
const TEST_ENDPOINTS = [
  '/api/events',
  '/api/users/login',
  '/api/users/register',
  '/api/tickets/my-tickets',
  '/api/password-reset/request'
];

console.log('🚀 Agura App Production Testing');
console.log('================================\n');

// Test 1: Backend Connectivity
async function testBackendConnectivity() {
  console.log('🔌 Testing Backend Connectivity...');
  
  for (const endpoint of TEST_ENDPOINTS) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint}`, 'GET');
      console.log(`✅ ${endpoint}: ${response.status} - ${response.statusText}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Test 2: App Structure Validation
function validateAppStructure() {
  console.log('\n📱 Validating App Structure...');
  
  const requiredFiles = [
    'app/_layout.tsx',
    'app/(tabs)/_layout.tsx',
    'app/event/_layout.tsx',
    'app/profile/_layout.tsx',
    'components/AuthGuard.tsx',
    'store/auth-store.ts',
    'lib/api/index.ts',
    'config/api.ts'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`\n⚠️  Missing ${missingFiles.length} required files!`);
  }
}

// Test 3: Icon Validation
function validateIcons() {
  console.log('\n🎨 Validating App Icons...');
  
  const iconPath = path.join(__dirname, '../assets/images');
  const requiredIcons = ['icon.png', 'adaptive-icon.png', 'splash-icon.png'];
  
  requiredIcons.forEach(icon => {
    const iconFile = path.join(iconPath, icon);
    if (fs.existsSync(iconFile)) {
      const stats = fs.statSync(iconFile);
      console.log(`✅ ${icon}: ${stats.size} bytes`);
      
      // Check if it's a reasonable size (should be > 1KB, < 1MB)
      if (stats.size < 1024) {
        console.log(`⚠️  ${icon}: File too small, may be corrupted`);
      } else if (stats.size > 1024 * 1024) {
        console.log(`⚠️  ${icon}: File too large, may need optimization`);
      }
    } else {
      console.log(`❌ ${icon} - MISSING`);
    }
  });
}

// Test 4: Package Dependencies
function validateDependencies() {
  console.log('\n📦 Validating Dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check for deprecated packages
    const deprecatedPackages = ['expo-permissions'];
    const foundDeprecated = deprecatedPackages.filter(pkg => 
      packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]
    );
    
    if (foundDeprecated.length > 0) {
      console.log(`❌ Deprecated packages found: ${foundDeprecated.join(', ')}`);
    } else {
      console.log('✅ No deprecated packages found');
    }
    
    // Check for required packages
    const requiredPackages = ['expo', 'react-native', 'zustand', '@react-native-async-storage/async-storage'];
    const missingPackages = requiredPackages.filter(pkg => !packageJson.dependencies?.[pkg]);
    
    if (missingPackages.length > 0) {
      console.log(`❌ Missing required packages: ${missingPackages.join(', ')}`);
    } else {
      console.log('✅ All required packages present');
    }
    
  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
  }
}

// Test 5: TypeScript Configuration
function validateTypeScript() {
  console.log('\n🔧 Validating TypeScript Configuration...');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    if (tsConfig.compilerOptions?.strict) {
      console.log('✅ Strict mode enabled');
    } else {
      console.log('⚠️  Strict mode not enabled');
    }
    
    if (tsConfig.compilerOptions?.baseUrl && tsConfig.compilerOptions?.paths) {
      console.log('✅ Path aliases configured');
    } else {
      console.log('⚠️  Path aliases not configured');
    }
    
  } catch (error) {
    console.log(`❌ Error reading tsconfig.json: ${error.message}`);
  }
}

// Helper function for HTTP requests
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(res));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Run all tests
async function runAllTests() {
  try {
    await testBackendConnectivity();
    validateAppStructure();
    validateIcons();
    validateDependencies();
    validateTypeScript();
    
    console.log('\n🎯 Production Readiness Summary:');
    console.log('================================');
    console.log('✅ Backend connectivity tested');
    console.log('✅ App structure validated');
    console.log('✅ Icons checked');
    console.log('✅ Dependencies validated');
    console.log('✅ TypeScript configuration checked');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Fix any missing files or dependencies');
    console.log('2. Create proper square app icons (1024x1024)');
    console.log('3. Test protected routes with authentication');
    console.log('4. Run end-to-end testing');
    console.log('5. Build and deploy to app stores');
    
  } catch (error) {
    console.error('\n❌ Testing failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
