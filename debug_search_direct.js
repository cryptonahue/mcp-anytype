import 'dotenv/config';
import fetch from 'node-fetch';

console.log('=== DIRECT SEARCH TEST ===');

const apiKey = process.env.ANYTYPE_API_KEY;
const testSpaceId = 'bafyreihkz7mab6f7tvnn3h257bfztkxjiy5ghogppmyddghv3fmmogtume.1mmy9s6wnxg7';
const baseUrl = 'http://localhost:47800';

const searchPayload = {
  query: "Test",
  sort: {
    direction: "desc", 
    property_key: "last_modified_date"
  },
  types: ["page"]
};

console.log('API Key present:', apiKey ? 'Yes' : 'No');
console.log('Base URL:', baseUrl);
console.log('Search payload:', JSON.stringify(searchPayload, null, 2));

// Test with minimal headers (like the examples)
const url = `${baseUrl}/v1/spaces/${testSpaceId}/search?offset=0&limit=10`;
console.log('Request URL:', url);

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
      // Removed Anytype-Version header to test
    },
    body: JSON.stringify(searchPayload)
  });
  
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (response.ok) {
    const result = await response.json();
    console.log('✅ Search SUCCESS');
    console.log('Results:', JSON.stringify(result, null, 2));
  } else {
    const errorText = await response.text();
    console.log('❌ Search FAILED');
    console.log('Error response:', errorText);
  }
  
} catch (error) {
  console.log('❌ Request FAILED');
  console.log('Error:', error.message);
}

console.log('\n=== DIRECT SEARCH TEST COMPLETE ===');
