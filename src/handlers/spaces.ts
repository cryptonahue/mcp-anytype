import { makeRequest } from '../utils.js';

/**
 * List all spaces
 */
export async function handleListSpaces() {
  const response = await makeRequest('/v1/spaces');
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
 */
export async function handleCreateSpace(args: any) {
  const response = await makeRequest('/v1/spaces', {
    method: 'POST',
    body: JSON.stringify(args),
  });
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