#!/usr/bin/env node

/**
 * Script de compilación y testing rápido para las correcciones
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const PROJECT_DIR = 'D:/repos/mcps/my-mcp-anytype';

async function checkDistExists() {
  try {
    await fs.access(path.join(PROJECT_DIR, 'dist'));
    return true;
  } catch {
    return false;
  }
}

async function compileTsFiles() {
  console.log('🔨 Compiling TypeScript files...');
  
  return new Promise((resolve, reject) => {
    const tsc = spawn('npx', ['tsc'], { 
      cwd: PROJECT_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true 
    });
    
    let stdout = '';
    let stderr = '';
    
    tsc.stdout.on('data', (data) => {
      stdout += data;
    });
    
    tsc.stderr.on('data', (data) => {
      stderr += data;
    });
    
    tsc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ TypeScript compilation successful!');
        resolve();
      } else {
        console.error('❌ TypeScript compilation failed:');
        console.error(stderr);
        reject(new Error('Compilation failed'));
      }
    });
  });
}

async function main() {
  try {
    console.log('🚀 Preparing Anytype MCP Server for testing...\n');
    
    // Check if dist exists
    const distExists = await checkDistExists();
    
    if (!distExists) {
      console.log('📁 Dist directory not found, compiling...');
      await compileTsFiles();
    } else {
      console.log('✅ Dist directory exists');
    }
    
    console.log('\n🧪 Ready to test! Run the following commands:');
    console.log('   node test_fixes.js         # Test all fixes');
    console.log('   node dist/index.js         # Start MCP server');
    console.log('   npm run build              # Rebuild if needed');
    
    // Try to run a quick test to verify everything works
    console.log('\n🔍 Running quick validation...');
    
    const { API_KEY, BASE_URL } = process.env;
    if (!API_KEY) {
      console.log('⚠️  ANYTYPE_API_KEY not found in environment');
      console.log('   Make sure to set it in your .env file');
    } else {
      console.log('✅ API Key found');
    }
    
    if (!BASE_URL) {
      console.log('ℹ️  Using default BASE_URL: http://localhost:31009');
    } else {
      console.log(`✅ Using BASE_URL: ${BASE_URL}`);
    }
    
    console.log('\n✨ Setup complete! Ready for testing.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
