import 'dotenv/config';
import { makeRequest } from './dist/utils.js';

console.log('=== ANYTYPE API DEBUGGING ===');
console.log('API Key present:', process.env.ANYTYPE_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', process.env.ANYTYPE_API_KEY ? process.env.ANYTYPE_API_KEY.length : 'N/A');
console.log('API Base URL:', process.env.ANYTYPE_API_URL || 'http://localhost:31009');
console.log('');

// Test 1: Try to list spaces first
console.log('=== TEST 1: List Spaces ===');
try {
  const response = await makeRequest('/v1/spaces');
  console.log('✅ List spaces SUCCESS');
  console.log('Number of spaces:', response.data ? response.data.length : 'Unknown');
  if (response.data && response.data.length > 0) {
    console.log('First space ID:', response.data[0].id);
    console.log('First space name:', response.data[0].name);
  }
} catch (error) {
  console.log('❌ List spaces FAILED');
  console.log('Error:', error.message);
  console.log('Stack:', error.stack);
  console.log('');
  console.log('This might indicate:');
  console.log('1. Anytype desktop app is not running');
  console.log('2. API is not enabled in Anytype');
  console.log('3. Wrong API key');
  console.log('4. Wrong API URL');
  console.log('');
  console.log('Please ensure:');
  console.log('- Anytype desktop app is running');
  console.log('- API is enabled in settings');
  console.log('- API key is correct');
  process.exit(1);
}

// If we get here, the connection is working
const testSpaceId = 'bafyreihkz7mab6f7tvnn3h257bfztkxjiy5ghogppmyddghv3fmmogtume.1mmy9s6wnxg7';

console.log('\n=== TEST 2: Simple Object Creation ===');
const simplePayload = {
  name: 'API Debug Test Simple',
  type_key: 'page'
};

try {
  console.log('Sending payload:', JSON.stringify(simplePayload, null, 2));
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/objects`, {
    method: 'POST',
    body: JSON.stringify(simplePayload),
  });
  console.log('✅ Simple object creation SUCCESS');
  console.log('Created object ID:', response.object ? response.object.id : 'Unknown');
  console.log('Created object name:', response.object ? response.object.name : 'Unknown');
} catch (error) {
  console.log('❌ Simple object creation FAILED');
  console.log('Error message:', error.message);
  
  // Try to parse the error for more details
  if (error.message.includes('API request failed:')) {
    const parts = error.message.split(' - ');
    if (parts.length > 1) {
      console.log('API Response:', parts[1]);
      try {
        const errorData = JSON.parse(parts[1]);
        console.log('Parsed error:', JSON.stringify(errorData, null, 2));
      } catch (parseError) {
        console.log('Could not parse error response as JSON');
      }
    }
  }
}

console.log('\n=== TEST 3: Object with Body ===');
const payloadWithBody = {
  name: 'API Debug Test With Content',
  type_key: 'page',
  body: '# Test Content\n\nThis is a test object created via API debugging.'
};

try {
  console.log('Sending payload:', JSON.stringify(payloadWithBody, null, 2));
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/objects`, {
    method: 'POST',
    body: JSON.stringify(payloadWithBody),
  });
  console.log('✅ Object with body creation SUCCESS');
  console.log('Created object ID:', response.object ? response.object.id : 'Unknown');
  console.log('Created object name:', response.object ? response.object.name : 'Unknown');
} catch (error) {
  console.log('❌ Object with body creation FAILED');
  console.log('Error message:', error.message);
  
  if (error.message.includes('API request failed:')) {
    const parts = error.message.split(' - ');
    if (parts.length > 1) {
      console.log('API Response:', parts[1]);
    }
  }
}

console.log('\n=== DEBUGGING COMPLETE ===');
