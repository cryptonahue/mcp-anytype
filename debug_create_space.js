// Debug script to analyze space creation issue in detail
import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE_URL = process.env.ANYTYPE_API_URL || 'http://localhost:31009';
const API_VERSION = '2025-05-20';

async function debugCreateSpace() {
  console.log('🔍 DEBUGGING SPACE CREATION ISSUE');
  console.log('==================================');
  
  const apiKey = process.env.ANYTYPE_API_KEY;
  
  // Test different request body structures
  const testCases = [
    {
      name: "Simple Structure - Name Only",
      body: {
        name: "Debug Space 1"
      }
    },
    {
      name: "With Description",
      body: {
        name: "Debug Space 2", 
        description: "Test space for debugging"
      }
    },
    {
      name: "With Icon",
      body: {
        name: "Debug Space 3",
        description: "Test space with icon",
        icon: {
          emoji: "🐛",
          format: "emoji"
        }
      }
    },
    {
      name: "Complete Structure",
      body: {
        name: "Debug Space 4",
        description: "Complete test space",
        icon: {
          emoji: "🧪",
          format: "emoji"
        }
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('Request body:', JSON.stringify(testCase.body, null, 2));
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/spaces`, {
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
        const spaceId = data.space?.id;
        
        if (spaceId) {
          console.log('✅ Space created with ID:', spaceId);
          
          // Immediately verify if it exists in the list
          console.log('🔍 Verifying existence in spaces list...');
          const listResponse = await fetch(`${API_BASE_URL}/v1/spaces`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Anytype-Version': API_VERSION
            }
          });
          
          if (listResponse.ok) {
            const listData = await listResponse.json();
            const foundSpace = listData.spaces?.find(s => s.id === spaceId);
            
            if (foundSpace) {
              console.log('✅ Space exists in spaces list:', foundSpace.name);
              break; // Found working combination
            } else {
              console.log('❌ Space not found in spaces list');
              console.log('Available spaces:', listData.spaces?.map(s => `${s.name} (${s.id})`));
            }
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
    
    console.log('-----------------------------------');
  }
}

debugCreateSpace();