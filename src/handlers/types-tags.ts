import { makeRequest } from '../utils.js';

// Types
/**
 * List types in a space
 */
export async function handleListTypes(args: any) {
  const { space_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/types`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific type
 */
export async function handleGetType(args: any) {
  const { space_id, type_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/types/${type_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Create a new type
 */
export async function handleCreateType(args: any) {
  const { space_id, ...typeData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/types`, {
    method: 'POST',
    body: JSON.stringify(typeData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Update a type
 */
export async function handleUpdateType(args: any) {
  const { space_id, type_id, ...updateData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/types/${type_id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Delete a type
 */
export async function handleDeleteType(args: any) {
  const { space_id, type_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/types/${type_id}`, {
    method: 'DELETE',
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

// Tags
/**
 * List tags for a property
 */
export async function handleListTags(args: any) {
  const { space_id, property_key, limit = 20, offset = 0 } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_key}/tags?limit=${limit}&offset=${offset}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific tag
 */
export async function handleGetTag(args: any) {
  const { space_id, tag_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/tags/${tag_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Create a new tag
 */
export async function handleCreateTag(args: any) {
  const { space_id, property_key, ...tagData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_key}/tags`, {
    method: 'POST',
    body: JSON.stringify(tagData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Update a tag
 */
export async function handleUpdateTag(args: any) {
  const { space_id, tag_id, ...updateData } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/tags/${tag_id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Delete a tag
 */
export async function handleDeleteTag(args: any) {
  const { space_id, tag_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/tags/${tag_id}`, {
    method: 'DELETE',
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

// Templates
/**
 * List templates in a space
 */
export async function handleListTemplates(args: any) {
  const { space_id, type_id, limit = 20, offset = 0 } = args;
  const queryParams = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
  if (type_id) queryParams.append('type_id', type_id);
  const response = await makeRequest(`/v1/spaces/${space_id}/templates?${queryParams}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific template
 */
export async function handleGetTemplate(args: any) {
  const { space_id, template_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/templates/${template_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}