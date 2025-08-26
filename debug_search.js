import 'dotenv/config';
import { makeRequest } from './dist/utils.js';

console.log('=== ANYTYPE SEARCH DEBUGGING ===');

const testSpaceId = 'bafyreihkz7mab6f7tvnn3h257bfztkxjiy5ghogppmyddghv3fmmogtume.1mmy9s6wnxg7';

// Test 1: Global search (sin space_id)
console.log('\n=== TEST 1: Global Search ===');
const globalSearchBody = {
  query: "test",
  sort: {
    direction: "desc",
    property_key: "last_modified_date"
  },
  types: ["page"]
};

try {
  console.log('Global search endpoint: /v1/search');
  console.log('Payload:', JSON.stringify(globalSearchBody, null, 2));
  
  const response = await makeRequest('/v1/search?offset=0&limit=10', {
    method: 'POST',
    body: JSON.stringify(globalSearchBody),
  });
  
  console.log('✅ Global search SUCCESS');
  console.log('Results:', JSON.stringify(response, null, 2));
} catch (error) {
  console.log('❌ Global search FAILED');
  console.log('Error message:', error.message);
  
  // Parse detailed error
  if (error.message.includes('API request failed:')) {
    const parts = error.message.split(' - ');
    if (parts.length > 1) {
      console.log('API Response:', parts[1]);
      try {
        const errorData = JSON.parse(parts[1]);
        console.log('Parsed error:', JSON.stringify(errorData, null, 2));
      } catch (parseError) {
        console.log('Raw API error response:', parts[1]);
      }
    }
  }
}

// Test 2: Space-specific search
console.log('\n=== TEST 2: Space-Specific Search ===');
const spaceSearchBody = {
  query: "test", 
  sort: {
    direction: "desc",
    property_key: "last_modified_date"
  },
  types: ["page"]
};

try {
  console.log('Space search endpoint: /v1/spaces/' + testSpaceId + '/search');
  console.log('Payload:', JSON.stringify(spaceSearchBody, null, 2));
  
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/search?offset=0&limit=10`, {
    method: 'POST',
    body: JSON.stringify(spaceSearchBody),
  });
  
  console.log('✅ Space search SUCCESS');
  console.log('Results:', JSON.stringify(response, null, 2));
} catch (error) {
  console.log('❌ Space search FAILED');
  console.log('Error message:', error.message);
  
  // Parse detailed error
  if (error.message.includes('API request failed:')) {
    const parts = error.message.split(' - ');
    if (parts.length > 1) {
      console.log('API Response:', parts[1]);
      try {
        const errorData = JSON.parse(parts[1]);
        console.log('Parsed error:', JSON.stringify(errorData, null, 2));
      } catch (parseError) {
        console.log('Raw API error response:', parts[1]);
      }
    }
  }
}

// Test 3: Minimal search (solo query)
console.log('\n=== TEST 3: Minimal Search ===');
const minimalSearchBody = {
  query: "test"
};

try {
  console.log('Minimal search payload:', JSON.stringify(minimalSearchBody, null, 2));
  
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/search?offset=0&limit=10`, {
    method: 'POST',
    body: JSON.stringify(minimalSearchBody),
  });
  
  console.log('✅ Minimal search SUCCESS');
  console.log('Results:', JSON.stringify(response, null, 2));
} catch (error) {
  console.log('❌ Minimal search FAILED');
  console.log('Error message:', error.message);
}

console.log('\n=== SEARCH DEBUG COMPLETE ===');
