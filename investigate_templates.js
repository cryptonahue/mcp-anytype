#!/usr/bin/env node

/**
 * Script de diagnóstico para investigar el error 404 en templates
 */

import 'dotenv/config';

const API_KEY = process.env.ANYTYPE_API_KEY;
const BASE_URL = process.env.ANYTYPE_BASE_URL || 'http://localhost:31009';

async function testRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'Anytype-Version': '2025-05-20'
    }
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(url, finalOptions);
    
    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: response.ok ? await response.json() : await response.text()
    };
  } catch (error) {
    return {
      status: 0,
      statusText: error.message,
      ok: false,
      data: null
    };
  }
}

async function investigateTemplates() {
  console.log('🔍 Investigating Templates API Endpoints...\n');
  
  // Get a space first
  console.log('1️⃣ Getting space for testing...');
  const spacesResponse = await testRequest('/v1/spaces?limit=1');
  
  if (!spacesResponse.ok) {
    console.error('❌ Cannot get spaces:', spacesResponse.statusText);
    return;
  }
  
  if (!spacesResponse.data.data || spacesResponse.data.data.length === 0) {
    console.error('❌ No spaces found');
    return;
  }
  
  const spaceId = spacesResponse.data.data[0].id;
  console.log(`✅ Using space: ${spaceId}\n`);
  
  // Test various template endpoints
  const endpointsToTest = [
    `/v1/spaces/${spaceId}/templates`,
    `/v1/spaces/${spaceId}/templates?limit=10`,
    `/v1/spaces/${spaceId}/templates?limit=10&offset=0`,
    `/v1/templates`,
    `/v1/templates?space_id=${spaceId}`,
    // Alternative endpoints that might exist
    `/v1/spaces/${spaceId}/object-templates`,
    `/v1/spaces/${spaceId}/page-templates`
  ];
  
  console.log('2️⃣ Testing different template endpoints...\n');
  
  for (const endpoint of endpointsToTest) {
    console.log(`Testing: ${endpoint}`);
    const response = await testRequest(endpoint);
    
    if (response.ok) {
      console.log(`  ✅ SUCCESS (${response.status}): Found ${response.data.data?.length || 'unknown'} templates`);
      console.log(`  📄 Response preview:`, JSON.stringify(response.data, null, 2).substring(0, 200) + '...\n');
    } else {
      console.log(`  ❌ FAILED (${response.status}): ${response.statusText}`);
      if (response.status === 404) {
        console.log(`  💡 This endpoint doesn't exist`);
      } else if (response.status === 403) {
        console.log(`  💡 Access denied - might need different permissions`);
      } else {
        console.log(`  💡 Error details:`, response.data);
      }
      console.log('');
    }
  }
  
  // Test if we can get types instead (types might include templates)
  console.log('3️⃣ Testing alternative approaches...\n');
  
  console.log('Testing types endpoint (might include template info):');
  const typesResponse = await testRequest(`/v1/spaces/${spaceId}/types`);
  
  if (typesResponse.ok) {
    console.log(`  ✅ Types endpoint works: ${typesResponse.data.data?.length || 0} types found`);
    
    // Check if any types have template-like properties
    const types = typesResponse.data.data || [];
    const templateLikeTypes = types.filter(type => 
      type.name?.toLowerCase().includes('template') || 
      type.description?.toLowerCase().includes('template') ||
      type.layout === 'template'
    );
    
    if (templateLikeTypes.length > 0) {
      console.log(`  💡 Found ${templateLikeTypes.length} template-like types:`, 
        templateLikeTypes.map(t => t.name).join(', '));
    }
  } else {
    console.log(`  ❌ Types endpoint also failed: ${typesResponse.statusText}`);
  }
  
  // Test API info endpoint if it exists
  console.log('\n4️⃣ Testing API info endpoints...\n');
  
  const infoEndpoints = [
    '/v1/info',
    '/v1/version',
    '/v1/status',
    '/v1/health'
  ];
  
  for (const endpoint of infoEndpoints) {
    console.log(`Testing: ${endpoint}`);
    const response = await testRequest(endpoint);
    
    if (response.ok) {
      console.log(`  ✅ Available:`, JSON.stringify(response.data, null, 2));
    } else {
      console.log(`  ❌ Not available (${response.status})`);
    }
  }
}

// Run investigation
investigateTemplates().catch(error => {
  console.error('❌ Investigation failed:', error.message);
  process.exit(1);
});
