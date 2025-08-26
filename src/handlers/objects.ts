import { makeRequest, buildNewObjectData, AnytypeApiError } from '../utils.js';

/**
 * Search objects across spaces
 */
export async function handleSearchObjects(args: any) {
  const { query, space_id, types, limit = 20 } = args;
  const response = await makeRequest('/v1/object/search', {
    method: 'POST',
    body: JSON.stringify({ query, space_id, types, limit }),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * List objects in a space
 */
export async function handleListObjects(args: any) {
  const { space_id, limit = 20, offset = 0 } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/objects?limit=${limit}&offset=${offset}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific object
 */
export async function handleGetObject(args: any) {
  const { space_id, object_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Create a new object
 */
export async function handleCreateObject(args: any) {
  const { space_id, ...objectData } = args;
  
  // Handle markdown alias
  if (objectData.markdown && !objectData.body) {
    objectData.body = objectData.markdown;
    delete objectData.markdown;
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/objects`, {
    method: 'POST',
    body: JSON.stringify(objectData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Update an object with replacement strategy for content updates
 */
export async function handleUpdateObject(args: any) {
  const { space_id, object_id, body, markdown, ...updateData } = args;
  
  // Handle markdown alias
  const contentField = markdown || body;
  
  // If there's content to update, use replacement strategy
  if (contentField) {
    try {
      // Get current object
      const currentObject = await makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`);
      
      // Build new object data
      const newObjectData = buildNewObjectData(updateData, currentObject, contentField);
      
      // Create new object
      const newObjectResponse = await makeRequest(`/v1/spaces/${space_id}/objects`, {
        method: 'POST',
        body: JSON.stringify(newObjectData),
      });
      
      // Delete old object
      await makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`, {
        method: 'DELETE',
      });
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: 'Object updated successfully using replacement strategy',
            old_object_id: object_id,
            new_object: newObjectResponse,
            strategy: 'replacement'
          }, null, 2)
        }]
      };
    } catch (replacementError) {
      console.error('Replacement strategy failed, trying traditional update:', replacementError);
      
      // Fallback to traditional PATCH method
      try {
        const response = await makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`, {
          method: 'PATCH',
          body: JSON.stringify({ body: contentField, ...updateData }),
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: 'Object updated using traditional method (replacement failed)',
              object: response,
              strategy: 'traditional',
              replacement_error: replacementError instanceof Error ? replacementError.message : 'Unknown error'
            }, null, 2)
          }]
        };
      } catch (traditionalError) {
        throw new AnytypeApiError(
          `Both replacement and traditional update methods failed. Replacement error: ${replacementError instanceof Error ? replacementError.message : 'Unknown'}. Traditional error: ${traditionalError instanceof Error ? traditionalError.message : 'Unknown'}`,
          500,
          { replacementError, traditionalError }
        );
      }
    }
  } else {
    // No content update, use traditional PATCH
    const response = await makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
  }
}

/**
 * Delete an object
 */
export async function handleDeleteObject(args: any) {
  const { space_id, object_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`, {
    method: 'DELETE',
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Add object to collection
 */
export async function handleAddToCollection(args: any) {
  const { space_id, collection_id, object_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/collections/${collection_id}/objects`, {
    method: 'POST',
    body: JSON.stringify({ object_id }),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Remove object from collection
 */
export async function handleRemoveFromCollection(args: any) {
  const { space_id, collection_id, object_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/collections/${collection_id}/objects/${object_id}`, {
    method: 'DELETE',
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get list views
 */
export async function handleGetListViews(args: any) {
  const { space_id, list_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/lists/${list_id}/views`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get list objects
 */
export async function handleGetListObjects(args: any) {
  const { space_id, list_id, view_id, limit, offset } = args;
  let endpoint = `/v1/spaces/${space_id}/lists/${list_id}/views/${view_id}/objects`;
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  if (params.toString()) endpoint += `?${params.toString()}`;
  
  const response = await makeRequest(endpoint);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}