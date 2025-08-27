import { makeRequest } from '../utils.js';

/**
 * List properties in a space
 * Based on official API documentation: GET /v1/spaces/{space_id}/properties
 */
export async function handleListProperties(args: any) {
  const { space_id, limit = 20, offset = 0 } = args;
  
  if (!space_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "space_id" is required for listing properties',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties?limit=${limit}&offset=${offset}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Get a specific property
 * Based on official API documentation: GET /v1/spaces/{space_id}/properties/{property_id}
 */
export async function handleGetProperty(args: any) {
  const { space_id, property_id } = args;
  
  if (!space_id || !property_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameters',
          message: 'Fields "space_id" and "property_id" are required for getting a property',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Create a new property
 * Based on official API documentation: POST /v1/spaces/{space_id}/properties
 */
export async function handleCreateProperty(args: any) {
  const { space_id, name, type, format, description, source_object, read_only_value = false, key, ...propertyData } = args;
  
  if (!space_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "space_id" is required for creating a property',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  // Validate required fields based on official API docs
  if (!name || !type) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required fields',
          message: 'Both "name" and "type" are required for creating a property',
          required_fields: ['name', 'type'],
          provided_fields: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const requestBody = {
    name,
    type,
    format: format || type, // Format defaults to type if not provided
    description,
    source_object,
    read_only_value,
    key, // Optional unique key
    ...propertyData
  };
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Update a property
 * Based on official API documentation: PATCH /v1/spaces/{space_id}/properties/{property_id}
 */
export async function handleUpdateProperty(args: any) {
  const { space_id, property_id, name, description, format, source_object, read_only_value, ...updateData } = args;
  
  if (!space_id || !property_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameters',
          message: 'Fields "space_id" and "property_id" are required for updating a property',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  // Build update payload with only provided fields
  const requestBody: any = {};
  if (name !== undefined) requestBody.name = name;
  if (description !== undefined) requestBody.description = description;
  if (format !== undefined) requestBody.format = format;
  if (source_object !== undefined) requestBody.source_object = source_object;
  if (read_only_value !== undefined) requestBody.read_only_value = read_only_value;
  
  // Add any additional update data
  Object.assign(requestBody, updateData);
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}`, {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Delete a property
 * Based on official API documentation: DELETE /v1/spaces/{space_id}/properties/{property_id}
 */
export async function handleDeleteProperty(args: any) {
  const { space_id, property_id } = args;
  
  if (!space_id || !property_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameters',
          message: 'Fields "space_id" and "property_id" are required for deleting a property',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}`, {
    method: 'DELETE',
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}