import 'dotenv/config';
import { makeRequest } from './dist/utils.js';

console.log('Starting debug test...');
console.log('API Key present:', process.env.ANYTYPE_API_KEY ? 'Yes' : 'No');
console.log('API Base URL:', process.env.ANYTYPE_API_URL || 'http://localhost:31009');

const testSpaceId = 'bafyreihkz7mab6f7tvnn3h257bfztkxjiy5ghogppmyddghv3fmmogtume.1mmy9s6wnxg7';

// Test simple object creation
const simpleObjectData = {
  name: 'Debug Test Object',
  type_key: 'page'
};

try {
  console.log('\n--- Testing simple object creation ---');
  console.log('Request data:', JSON.stringify(simpleObjectData, null, 2));
  
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/objects`, {
    method: 'POST',
    body: JSON.stringify(simpleObjectData),
  });
  
  console.log('Success! Response:', JSON.stringify(response, null, 2));
} catch (error) {
  console.error('Error creating object:', error.message);
  console.error('Full error:', error);
}

// Test object creation with markdown
const objectWithMarkdown = {
  name: 'Debug Test Object with Content',
  type_key: 'page',
  body: '# Test Content\n\nThis is a test object with markdown content.'
};

try {
  console.log('\n--- Testing object with markdown creation ---');
  console.log('Request data:', JSON.stringify(objectWithMarkdown, null, 2));
  
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/objects`, {
    method: 'POST',
    body: JSON.stringify(objectWithMarkdown),
  });
  
  console.log('Success! Response:', JSON.stringify(response, null, 2));
} catch (error) {
  console.error('Error creating object with markdown:', error.message);
  console.error('Full error:', error);
}

// Test search objects
try {
  console.log('\n--- Testing search objects ---');
  
  const searchBody = {
    query: 'test',
    sort: {
      direction: 'desc',
      property_key: 'last_modified_date'
    }
  };
  
  console.log('Search request data:', JSON.stringify(searchBody, null, 2));
  
  const response = await makeRequest(`/v1/spaces/${testSpaceId}/search?offset=0&limit=20`, {
    method: 'POST',
    body: JSON.stringify(searchBody),
  });
  
  console.log('Success! Search response:', JSON.stringify(response, null, 2));
} catch (error) {
  console.error('Error searching objects:', error.message);
  console.error('Full error:', error);
}

console.log('\nDebug test completed.');
