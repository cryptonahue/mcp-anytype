// Debug script to capture MCP output
import 'dotenv/config';
import { spawn } from 'child_process';

console.log('🔍 DEBUGGING MCP OUTPUT DIRECTLY');
console.log('=================================');

// Set environment variables
process.env.ANYTYPE_API_KEY = 'xtVSxolbbxsUsgv49p4cCgfv//HAl7HB09DCupT4KEM=';
process.env.ANYTYPE_API_URL = 'http://localhost:31009';

console.log('Environment variables set:');
console.log('- ANYTYPE_API_KEY:', process.env.ANYTYPE_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- ANYTYPE_API_URL:', process.env.ANYTYPE_API_URL);

// Start MCP server process
const mcpProcess = spawn('node', ['D:\\repos\\mcps\\my-mcp-anytype\\dist\\index.js'], {
  stdio: 'pipe',
  env: {
    ...process.env,
    ANYTYPE_API_KEY: 'xtVSxolbbxsUsgv49p4cCgfv//HAl7HB09DCupT4KEM=',
    ANYTYPE_API_URL: 'http://localhost:31009'
  }
});

// Handle MCP communication
mcpProcess.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: "debug-client",
      version: "1.0.0"
    }
  }
}) + '\n');

mcpProcess.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  method: "notifications/initialized"
}) + '\n');

// Wait a bit then call create space
setTimeout(() => {
  console.log('\n📤 Sending anytype_create_space request...');
  mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "anytype_create_space",
      arguments: {
        name: "Debug MCP Space Test",
        description: "Espacio creado via debug MCP directo"
      }
    }
  }) + '\n');
}, 1000);

// Capture output
mcpProcess.stdout.on('data', (data) => {
  console.log('📥 MCP STDOUT:', data.toString());
});

mcpProcess.stderr.on('data', (data) => {
  console.log('📥 MCP STDERR:', data.toString());
});

mcpProcess.on('close', (code) => {
  console.log(`MCP process closed with code ${code}`);
});

// Close after 10 seconds
setTimeout(() => {
  console.log('Closing MCP process...');
  mcpProcess.kill();
}, 10000);