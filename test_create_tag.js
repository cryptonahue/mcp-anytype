// Test script to verify anytype_create_tag MCP tool
import 'dotenv/config';

// Import the handler
import { handleCreateTag } from './dist/handlers/types-tags.js';

// Test the create tag function directly
async function testCreateTag() {
  console.log('Testing anytype_create_tag handler...');
  
  const testArgs = {
    space_id: 'bafyreieezkotenzua6722avng7ywgihgi6yn2fd2s56qt4acxroxmvz4gu.1mmy9s6wnxg7',
    property_id: 'bafyreigxoeab72otfeqyofpwv2yb2bjves5zxafoy2z4zhzhkwcporzije', // Tag property
    name: 'Test Tag MCP',
    color: 'teal' // Color válido de la lista
  };
  
  try {
    const result = await handleCreateTag(testArgs);
    console.log('✅ Success!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Error:');
    console.error(error.message);
    console.error(error.stack);
  }
}

testCreateTag();