// Test different layouts for type creation
import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE_URL = process.env.ANYTYPE_API_URL || 'http://localhost:31009';
const API_VERSION = '2025-05-20';
const SPACE_ID = 'bafyreibgqorgaglkdj4hpqud625klq76cnz4inqjhfmy4uwmc3c5hercua';

async function testLayouts() {
  console.log('🔍 TESTING DIFFERENT LAYOUTS');
  
  const apiKey = process.env.ANYTYPE_API_KEY;
  
  const layouts = ['basic', 'note', 'todo', 'kanban', 'profile', 'page', 'set', 'objectType', 'relation', 'dashboard'];
  
  for (const layout of layouts) {
    console.log(`\n🧪 Testing layout: "${layout}"`);
    
    const requestBody = {
      name: `Test ${layout}`,
      plural_name: `Test ${layout}s`,
      layout: layout,
      key: `test_${layout}_${Date.now()}` // unique key
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/spaces/${SPACE_ID}/types`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Anytype-Version': API_VERSION
        }
      });
      
      console.log('📥 Status:', response.status);
      const responseText = await response.text();
      console.log('📥 Response:', responseText.substring(0, 200));
      
      if (response.status === 201) {
        console.log('✅ SUCCESS with layout:', layout);
        const data = JSON.parse(responseText);
        console.log('🆔 Type ID:', data.type?.id);
        break; // Stop at first success
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

testLayouts();