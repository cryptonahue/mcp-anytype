// Debug script to analyze spaces list endpoint
import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE_URL = process.env.ANYTYPE_API_URL || 'http://localhost:31009';
const API_VERSION = '2025-05-20';

async function debugSpacesList() {
  console.log('🔍 DEBUGGING SPACES LIST ENDPOINT');
  console.log('=================================');
  
  const apiKey = process.env.ANYTYPE_API_KEY;
  
  try {
    console.log('🚀 Calling GET /v1/spaces');
    const response = await fetch(`${API_BASE_URL}/v1/spaces`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Anytype-Version': API_VERSION,
        'Accept': 'application/json'
      }
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('📥 Raw response text:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('📄 Parsed JSON:', JSON.stringify(data, null, 2));
        
        if (data.spaces) {
          console.log('✅ Found spaces array with', data.spaces.length, 'spaces');
          data.spaces.forEach((space, index) => {
            console.log(`  ${index + 1}. ${space.name} (${space.id})`);
          });
        } else {
          console.log('❌ No spaces array in response');
          console.log('Available properties:', Object.keys(data));
        }
        
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
  
  // Also test alternative endpoints
  const alternativeEndpoints = [
    '/v1/user/spaces',
    '/v1/workspaces', 
    '/v1/spaces?include_archived=true',
    '/v1/spaces?include_shared=true'
  ];
  
  for (const endpoint of alternativeEndpoints) {
    console.log(`\n🧪 Testing alternative endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Anytype-Version': API_VERSION,
          'Accept': 'application/json'
        }
      });
      
      console.log('📥 Status:', response.status);
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('📥 Response:', responseText.substring(0, 200) + '...');
      } else {
        console.log('❌ Failed with status:', response.status);
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

debugSpacesList();