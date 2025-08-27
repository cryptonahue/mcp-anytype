// Debug script to intercept the exact request
import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE_URL = process.env.ANYTYPE_API_URL || 'http://localhost:31009';
const API_VERSION = '2025-05-20';

async function debugRequest() {
  console.log('🔍 Testing exact MCP request...');
  
  const apiKey = process.env.ANYTYPE_API_KEY;
  console.log('🔑 API Key present:', !!apiKey);
  console.log('🌐 API URL:', API_BASE_URL);
  console.log('📅 API Version:', API_VERSION);
  
  const args = {
    name: 'MCP Debug Space',
    description: 'Espacio creado con debug directo del MCP'
  };
  
  const endpoint = '/v1/spaces';
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('📤 Full URL:', url);
  console.log('📤 Request body:', JSON.stringify(args, null, 2));
  
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Anytype-Version': API_VERSION
    }
  };
  
  console.log('📤 Headers:', JSON.stringify(requestOptions.headers, null, 2));
  
  try {
    console.log('🚀 Making request...');
    const response = await fetch(url, requestOptions);
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('📥 Response body:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      const spaceId = data.space.id;
      
      console.log('✅ Space created with ID:', spaceId);
      
      // Immediately check if it exists
      console.log('🔍 Checking if space exists...');
      const checkResponse = await fetch(`${API_BASE_URL}/v1/spaces/${spaceId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Anytype-Version': API_VERSION
        }
      });
      
      console.log('🔍 Check status:', checkResponse.status);
      const checkText = await checkResponse.text();
      console.log('🔍 Check body:', checkText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugRequest();