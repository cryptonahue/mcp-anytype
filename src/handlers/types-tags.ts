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
 * Fixed based on Context7 documentation - including all required fields
 */
export async function handleCreateType(args: any) {
  const { space_id, name, description, icon, key, layout, properties, ...typeData } = args;
  
  // Validate required field based on Context7 API docs
  if (!name) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required field',
          message: 'Field "name" is required for creating a type',
          required_fields: ['name'],
          provided_fields: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  // Build request body according to Context7 API specification
  const requestBody = {
    name,
    description,
    icon,
    key, // Optional unique key
    layout, // Optional layout specification
    properties: properties || [], // Array of property IDs
    ...typeData
  };
  
  const response = await makeRequest(`/v1/spaces/${space_id}/types`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
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
 * Fixed based on Context7 documentation - using property_key instead of property_id
 */
export async function handleListTags(args: any) {
  const { space_id, property_key, property_id, limit = 20, offset = 0 } = args;
  
  // Use property_key if provided, otherwise fall back to property_id for backwards compatibility
  const propertyIdentifier = property_key || property_id;
  
  if (!propertyIdentifier) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Either "property_key" or "property_id" is required',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${propertyIdentifier}/tags?limit=${limit}&offset=${offset}`);
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
 * Fixed based on Context7 documentation - using property_key and proper validation
 */
export async function handleCreateTag(args: any) {
  const { space_id, property_key, property_id, name, color = 'yellow', ...tagData } = args;
  
  // Use property_key if provided, otherwise fall back to property_id for backwards compatibility
  const propertyIdentifier = property_key || property_id;
  
  // Validate required fields based on Context7 API docs
  if (!propertyIdentifier) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Either "property_key" or "property_id" is required',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  if (!name) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required field',
          message: 'Field "name" is required for creating a tag',
          provided_fields: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  // According to Context7 API docs, color and name are required
  const requestBody = {
    name,
    color,
    ...tagData
  };
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${propertyIdentifier}/tags`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
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
 * Updated to handle different API versions and potential endpoint variations
 */
export async function handleListTemplates(args: any) {
  const { space_id, type_id, limit = 20, offset = 0 } = args;
  
  // Build query parameters
  const queryParams = new URLSearchParams({ 
    limit: limit.toString(), 
    offset: offset.toString() 
  });
  if (type_id) queryParams.append('type_id', type_id);
  
  // Try the primary endpoint first
  try {
    const response = await makeRequest(`/v1/spaces/${space_id}/templates?${queryParams}`);
    return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
  } catch (primaryError: any) {
    console.error('Primary templates endpoint failed:', primaryError?.message || String(primaryError));
    
    // Try alternative endpoints if the primary fails
    const alternativeEndpoints = [
      `/v1/templates?space_id=${space_id}&${queryParams}`,
      `/v1/spaces/${space_id}/object-templates?${queryParams}`,
      `/v1/spaces/${space_id}/page-templates?${queryParams}`
    ];
    
    for (const endpoint of alternativeEndpoints) {
      try {
        const response = await makeRequest(endpoint);
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              message: `Templates found using alternative endpoint: ${endpoint}`,
              data: response,
              note: "Primary endpoint /v1/spaces/{space_id}/templates failed, using alternative"
            }, null, 2) 
          }] 
        };
      } catch (altError: any) {
        console.error(`Alternative endpoint ${endpoint} also failed:`, altError?.message || String(altError));
      }
    }
    
    // If all endpoints fail, return informative error
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Templates endpoint not available',
          message: 'The templates endpoint may not be supported in your Anytype version or configuration',
          attempted_endpoints: [
            `/v1/spaces/${space_id}/templates`,
            ...alternativeEndpoints
          ],
          primary_error: primaryError?.message || String(primaryError),
          suggestions: [
            'Check if your Anytype instance supports templates API',
            'Verify API version compatibility',
            'Use types endpoint instead - some template functionality may be available through object types'
          ],
          workaround: 'Try using the anytype_list_types function instead'
        }, null, 2) 
      }] 
    };
  }
}

/**
 * Get a specific template
 */
export async function handleGetTemplate(args: any) {
  const { space_id, template_id } = args;
  const response = await makeRequest(`/v1/spaces/${space_id}/templates/${template_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}