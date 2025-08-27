// Test script to verify fixed space creation
import 'dotenv/config';
import { handleCreateSpace, handleListSpaces } from './dist/handlers/spaces.js';

async function testFixedSpaceCreation() {
  console.log('🧪 TESTING FIXED SPACE CREATION');
  console.log('================================');
  
  // Test 1: Create a new space
  console.log('\n1️⃣ Creating new space...');
  const createArgs = {
    name: 'Fixed Test Space',
    description: 'This space was created with the fixed handler'
  };
  
  try {
    const createResult = await handleCreateSpace(createArgs);
    console.log('📤 Create Result:');
    console.log(JSON.stringify(JSON.parse(createResult.content[0].text), null, 2));
    
    // Test 2: List all spaces to verify it appears
    console.log('\n2️⃣ Listing all spaces...');
    const listResult = await handleListSpaces();
    const listData = JSON.parse(listResult.content[0].text);
    
    console.log('📋 Spaces found:', listData.total);
    
    // Find our newly created space
    const ourSpace = listData.spaces?.find(s => s.name === 'Fixed Test Space');
    if (ourSpace) {
      console.log('✅ SUCCESS: Space found in list!');
      console.log('🆔 Space ID:', ourSpace.id);
      console.log('📝 Description:', ourSpace.description);
    } else {
      console.log('❌ FAILED: Space not found in list');
      console.log('Available spaces:', listData.spaces?.map(s => s.name).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n✅ Test completed!');
}

testFixedSpaceCreation();