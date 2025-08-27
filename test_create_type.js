// Test script to verify anytype_create_type MCP tool
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import the handler
import { handleCreateType } from './dist/handlers/types-tags.js';

// Test the create type function directly
async function testCreateType() {
  console.log('Testing anytype_create_type handler...');
  
  const testArgs = {
    space_id: 'bafyreieezkotenzua6722avng7ywgihgi6yn2fd2s56qt4acxroxmvz4gu.1mmy9s6wnxg7',
    name: 'Test Type Handler',
    description: 'Testing the MCP handler directly'
  };
  
  try {
    const result = await handleCreateType(testArgs);
    console.log('✅ Success!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Error:');
    console.error(error.message);
    console.error(error.stack);
  }
}

testCreateType();