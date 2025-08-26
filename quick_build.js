#!/usr/bin/env node

/**
 * Script para compilar y verificar que no hay errores de TypeScript
 */

import { spawn } from 'child_process';

function buildProject() {
  console.log('🔨 Building Anytype MCP Server...\n');
  
  const tsc = spawn('npx', ['tsc'], { 
    cwd: 'D:/repos/mcps/my-mcp-anytype',
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true 
  });
  
  let stdout = '';
  let stderr = '';
  
  tsc.stdout.on('data', (data) => {
    stdout += data;
    process.stdout.write(data);
  });
  
  tsc.stderr.on('data', (data) => {
    stderr += data;
    process.stderr.write(data);
  });
  
  tsc.on('close', (code) => {
    console.log('\n' + '='.repeat(50));
    
    if (code === 0) {
      console.log('✅ Build successful!');
      console.log('\n🎉 TypeScript compilation completed without errors.');
      console.log('\nYou can now run:');
      console.log('  node test_simple.js     # Test the fixes');
      console.log('  node dist/index.js      # Start the MCP server');
    } else {
      console.log('❌ Build failed!');
      console.log(`\nExit code: ${code}`);
      if (stderr) {
        console.log('\nErrors found:');
        console.log(stderr);
      }
    }
    
    process.exit(code);
  });
}

buildProject();
