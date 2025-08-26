#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function buildProject() {
  console.log('🔨 Building Anytype MCP Server...');
  
  try {
    const { stdout, stderr } = await execAsync('npx tsc', { 
      cwd: 'D:/repos/mcps/my-mcp-anytype' 
    });
    
    if (stderr && !stderr.includes('warning')) {
      console.error('❌ Build failed:', stderr);
      process.exit(1);
    }
    
    if (stdout) {
      console.log('Build output:', stdout);
    }
    
    console.log('✅ Build successful!');
    console.log('\nYou can now run:');
    console.log('  node test_fixes.js     - Run the comprehensive test suite');
    console.log('  node dist/index.js     - Start the MCP server');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildProject();
