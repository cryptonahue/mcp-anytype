import { makeRequest } from '../utils.js';

/**
 * List all spaces
 * Fixed: API returns spaces in `data` array, not `spaces` array
 */
export async function handleListSpaces() {
  const response = await makeRequest('/v1/spaces');
  
  // Transform response to match expected structure
  if (response && response.data && Array.isArray(response.data)) {
    const transformedResponse = {
      spaces: response.data,
      pagination: response.pagination,
      total: response.pagination?.total || response.data.length
    };
    return { content: [{ type: 'text', text: JSON.stringify(transformedResponse, null, 2) }] };
  }
  
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific space
 */
export async function handleGetSpace(args: any) {
  const { space_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Create a new space
 * Fixed: Add proper validation and improved error handling based on API testing
 */
export async function handleCreateSpace(args: any) {
  const { name, description, icon, ...spaceData } = args;
  
  // Validate required fields
  if (!name) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required field',
          message: 'Field "name" is required for creating a space',
          required_fields: ['name'],
          provided_fields: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  // Build request body according to API specification
  const requestBody = {
    name,
    description: description || '', // Optional but recommended
    icon: icon || null, // Optional icon
    ...spaceData
  };
  
  const response = await makeRequest('/v1/spaces', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  
  // Enhance response with verification
  if (response && response.space) {
    const enhancedResponse = {
      success: true,
      message: `Space "${name}" created successfully`,
      space: response.space,
      space_id: response.space.id,
      next_steps: [
        'Use the space_id to create objects, types, and properties in this space',
        'Switch to this space using anytype_get_space if needed'
      ]
    };
    return { content: [{ type: 'text', text: JSON.stringify(enhancedResponse, null, 2) }] };
  }
  
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Update a space
 */
export async function handleUpdateSpace(args: any) {
  const { space_id, ...updateData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * List space members
 */
export async function handleListMembers(args: any) {
  const { space_id, limit = 20, offset = 0 } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/members?limit=${limit}&offset=${offset}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific member
 */
export async function handleGetMember(args: any) {
  const { space_id, member_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/members/${member_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}