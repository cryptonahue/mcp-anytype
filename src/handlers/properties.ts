import { makeRequest } from '../utils.js';

/**
 * List properties in a space
 */
export async function handleListProperties(args: any) {
  const { space_id, limit = 20, offset = 0 } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties?limit=${limit}&offset=${offset}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific property
 */
export async function handleGetProperty(args: any) {
  const { space_id, property_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Create a new property
 */
export async function handleCreateProperty(args: any) {
  const { space_id, ...propertyData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties`, {
    method: 'POST',
    body: JSON.stringify(propertyData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Update a property
 */
export async function handleUpdateProperty(args: any) {
  const { space_id, property_id, ...updateData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Delete a property
 */
export async function handleDeleteProperty(args: any) {
  const { space_id, property_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}`, {
    method: 'DELETE',
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}