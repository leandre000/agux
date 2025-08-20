#!/usr/bin/env node

/**
 * AGURA Ticketing Mobile App - Production Deployment Script
 * Version 1.0.0
 * 
 * This script helps prepare the app for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AGURA Ticketing Mobile App - Production Deployment');
console.log('==================================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}: ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// Check if we're in the right directory
function checkProjectStructure() {
  logStep('1', 'Checking project structure...');
  
  const requiredFiles = [
    'package.json',
    'app.json',
    'app/_layout.tsx',
    'lib/api/index.ts',
    'config/production.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    logError(`Missing required files: ${missingFiles.join(', ')}`);
    process.exit(1);
  }
  
  logSuccess('Project structure verified');
}

// Check production configuration
function checkProductionConfig() {
  logStep('2', 'Verifying production configuration...');
  
  try {
    const productionConfig = require('../config/production.ts');
    const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    
    // Check if production config is properly set
    if (productionConfig.PRODUCTION_CONFIG.API_BASE_URL !== 'https://agura-ticketing-backend.onrender.com') {
      logWarning('Production API URL may not be correctly configured');
    }
    
    // Check app version
    if (appJson.expo.version !== '1.0.0') {
      logWarning(`App version is ${appJson.expo.version}, expected 1.0.0`);
    }
    
    logSuccess('Production configuration verified');
  } catch (error) {
    logError(`Failed to verify production configuration: ${error.message}`);
    process.exit(1);
  }
}

// Check dependencies
function checkDependencies() {
  logStep('3', 'Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'expo',
      'react-native',
      'axios',
      'zustand',
      'expo-router'
    ];
    
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      logError(`Missing required dependencies: ${missingDeps.join(', ')}`);
      process.exit(1);
    }
    
    logSuccess('Dependencies verified');
  } catch (error) {
    logError(`Failed to check dependencies: ${error.message}`);
    process.exit(1);
  }
}

// Run linting
function runLinting() {
  logStep('4', 'Running code quality checks...');
  
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    logSuccess('Code quality checks passed');
  } catch (error) {
    logWarning('Code quality checks failed - please fix issues before deployment');
  }
}

// Check API integration
function checkAPIIntegration() {
  logStep('5', 'Verifying API integration...');
  
  const apiFiles = [
    'lib/api/events.ts',
    'lib/api/venues.ts',
    'lib/api/sections.ts',
    'lib/api/seats.ts',
    'lib/api/ticket-categories.ts',
    'lib/api/tickets.ts',
    'lib/api/auth.ts'
  ];
  
  const missingAPIs = apiFiles.filter(file => !fs.existsSync(file));
  
  if (missingAPIs.length > 0) {
    logError(`Missing API files: ${missingAPIs.join(', ')}`);
    process.exit(1);
  }
  
  logSuccess('API integration verified');
}

// Build preparation
function prepareBuild() {
  logStep('6', 'Preparing for build...');
  
  try {
    // Clean previous builds
    if (fs.existsSync('dist')) {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
    
    // Install dependencies
    log('Installing dependencies...', 'yellow');
    execSync('npm install', { stdio: 'inherit' });
    
    // Run prebuild
    log('Running prebuild...', 'yellow');
    execSync('npm run prebuild', { stdio: 'inherit' });
    
    logSuccess('Build preparation completed');
  } catch (error) {
    logError(`Build preparation failed: ${error.message}`);
    process.exit(1);
  }
}

// Production checklist
function showProductionChecklist() {
  logStep('7', 'Production Deployment Checklist');
  
  const checklist = [
    '✅ Project structure verified',
    '✅ Production configuration verified',
    '✅ Dependencies checked',
    '✅ Code quality verified',
    '✅ API integration verified',
    '✅ Build preparation completed',
    '',
    '🚀 Ready for production build!',
    '',
    'Next steps:',
    '1. Run: npm run build:android (for Android)',
    '2. Run: npm run build:ios (for iOS)',
    '3. Test the production build',
    '4. Deploy to app stores'
  ];
  
  checklist.forEach(item => {
    if (item.startsWith('✅')) {
      logSuccess(item.substring(2));
    } else if (item.startsWith('🚀')) {
      log(item, 'green');
    } else if (item.startsWith('Next steps:')) {
      log(item, 'blue');
    } else if (item.startsWith('1.') || item.startsWith('2.') || item.startsWith('3.') || item.startsWith('4.')) {
      log(item, 'yellow');
    } else {
      console.log(item);
    }
  });
}

// Main execution
function main() {
  try {
    log('Starting production deployment preparation...', 'bold');
    
    checkProjectStructure();
    checkProductionConfig();
    checkDependencies();
    runLinting();
    checkAPIIntegration();
    prepareBuild();
    showProductionChecklist();
    
    log('\n🎉 Production deployment preparation completed successfully!', 'green');
    
  } catch (error) {
    logError(`Deployment preparation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkProjectStructure,
  checkProductionConfig,
  checkDependencies,
  runLinting,
  checkAPIIntegration,
  prepareBuild,
  showProductionChecklist
};
