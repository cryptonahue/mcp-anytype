// Debug script to analyze create type issue in detail
import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE_URL = process.env.ANYTYPE_API_URL || 'http://localhost:31009';
const API_VERSION = '2025-05-20';
const SPACE_ID = 'bafyreibgqorgaglkdj4hpqud625klq76cnz4inqjhfmy4uwmc3c5hercua';

async function debugCreateType() {
  console.log('🔍 DEBUGGING CREATE TYPE ISSUE');
  console.log('================================');
  
  const apiKey = process.env.ANYTYPE_API_KEY;
  
  // Test different request body structures
  const testCases = [
    {
      name: "Simple Structure",
      body: {
        name: "Debug Type 1",
        plural_name: "Debug Types 1"
      }
    },
    {
      name: "With Description",
      body: {
        name: "Debug Type 2", 
        plural_name: "Debug Types 2",
        description: "Test type for debugging"
      }
    },
    {
      name: "With Layout",
      body: {
        name: "Debug Type 3",
        plural_name: "Debug Types 3", 
        layout: "basic"
      }
    },
    {
      name: "Complete Structure",
      body: {
        name: "Debug Type 4",
        plural_name: "Debug Types 4",
        description: "Complete test type",
        layout: "basic",
        icon: {
          emoji: "🐛",
          format: "emoji"
        }
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('Request body:', JSON.stringify(testCase.body, null, 2));
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/spaces/${SPACE_ID}/types`, {
        method: 'POST',
        body: JSON.stringify(testCase.body),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Anytype-Version': API_VERSION
        }
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers));
      
      const responseText = await response.text();
      console.log('📥 Response body:', responseText);
      
      if (response.status === 201) {
        const data = JSON.parse(responseText);
        const typeId = data.type?.id;
        
        if (typeId) {
          console.log('✅ Type created with ID:', typeId);
          
          // Immediately verify if it exists
          console.log('🔍 Verifying existence...');
          const verifyResponse = await fetch(`${API_BASE_URL}/v1/spaces/${SPACE_ID}/types/${typeId}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Anytype-Version': API_VERSION
            }
          });
          
          console.log('🔍 Verify status:', verifyResponse.status);
          if (verifyResponse.ok) {
            console.log('✅ Type exists and can be retrieved');
            break; // Found working combination
          } else {
            const verifyText = await verifyResponse.text();
            console.log('❌ Type not found:', verifyText);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
    
    console.log('-----------------------------------');
  }
}

debugCreateType();