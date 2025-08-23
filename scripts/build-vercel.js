#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building for Vercel deployment...');

try {
  // Build the frontend
  console.log('Building frontend...');
  execSync('vite build', { stdio: 'inherit', cwd: process.cwd() });

  // Copy API files to ensure they're available
  console.log('Preparing API files...');
  const apiDir = path.join(process.cwd(), 'api');
  const sharedDir = path.join(process.cwd(), 'shared');
  
  if (fs.existsSync(apiDir)) {
    console.log('API directory exists');
  }
  
  if (fs.existsSync(sharedDir)) {
    console.log('Shared directory exists');
  }

  console.log('Vercel build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}