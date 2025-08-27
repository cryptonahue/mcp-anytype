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
 * Fixed based on Context7 documentation - including all required fields including plural_name
 */
export async function handleCreateType(args: any) {
  const { space_id, name, plural_name, description, icon, key, layout, properties, ...typeData } = args;
  
  // Validate required fields based on API testing and best practices
  if (!name) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required field',
          message: 'Field "name" is required for creating a type',
          required_fields: ['name', 'plural_name'],
          provided_fields: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  // Auto-generate plural_name if not provided
  const finalPluralName = plural_name || (name.endsWith('s') ? name : name + 's');
  
  // Build request body according to API specification with required plural_name and key
  const requestBody = {
    name,
    plural_name: finalPluralName, // Required field (not documented but mandatory)
    description,
    icon,
    key: key || `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`, // Generate unique key if not provided
    layout: layout || 'basic', // Default to basic layout (required field)
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
 * Fixed based on official API documentation - using property_id in URL path
 */
export async function handleListTags(args: any) {
  const { space_id, property_key, property_id, limit = 20, offset = 0 } = args;
  
  // Use property_id if provided, otherwise fall back to property_key for backwards compatibility
  const propertyIdentifier = property_id || property_key;
  
  if (!propertyIdentifier) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "property_id" is required for listing tags',
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
 * Fixed based on official API documentation - tags are nested under properties
 */
export async function handleGetTag(args: any) {
  const { space_id, property_id, tag_id } = args;
  
  if (!property_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "property_id" is required for getting a tag',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}/tags/${tag_id}`);
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}



/**
 * Create a new tag
 * Fixed based on official API documentation - using property_id and proper validation
 */
export async function handleCreateTag(args: any) {
  const { space_id, property_key, property_id, name, color = 'yellow', ...tagData } = args;
  
  // Use property_id if provided, otherwise fall back to property_key for backwards compatibility
  const propertyIdentifier = property_id || property_key;
  
  // Validate required fields based on official API docs
  if (!propertyIdentifier) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "property_id" is required for creating a tag',
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
  
  // Validate color if provided
  const validColors = ['grey', 'yellow', 'orange', 'red', 'pink', 'purple', 'blue', 'ice', 'teal', 'lime'];
  if (color && !validColors.includes(color)) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Invalid color',
          message: `Color "${color}" is not valid. Valid colors are: ${validColors.join(', ')}`,
          provided_color: color,
          valid_colors: validColors
        }, null, 2) 
      }] 
    };
  }
  
  // According to official API docs, color and name are required
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
 * Fixed based on official API documentation - tags are nested under properties
 */
export async function handleUpdateTag(args: any) {
  const { space_id, property_id, tag_id, ...updateData } = args;
  
  if (!property_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "property_id" is required for updating a tag',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}/tags/${tag_id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Delete a tag
 * Fixed based on official API documentation - tags are nested under properties
 */
export async function handleDeleteTag(args: any) {
  const { space_id, property_id, tag_id } = args;
  
  if (!property_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "property_id" is required for deleting a tag',
          provided_parameters: Object.keys(args)
        }, null, 2) 
      }] 
    };
  }
  
  const response = await makeRequest(`/v1/spaces/${space_id}/properties/${property_id}/tags/${tag_id}`, {
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