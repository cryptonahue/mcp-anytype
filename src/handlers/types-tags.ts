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
 * List templates for a specific type in a space
 * Updated according to official Anytype API 2025-05-20 documentation
 * Requires type_id as templates are associated with types
 */
export async function handleListTemplates(args: any) {
  const { space_id, type_id, limit = 100, offset = 0 } = args;
  
  // type_id is required according to official API docs
  if (!type_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "type_id" is required for listing templates',
          provided_parameters: Object.keys(args),
          note: 'Templates are associated with specific types in Anytype API 2025-05-20'
        }, null, 2) 
      }] 
    };
  }
  
  // Build query parameters according to official API docs
  const queryParams = new URLSearchParams({ 
    limit: limit.toString(), 
    offset: offset.toString() 
  });
  
  // Use the correct endpoint according to official API documentation
  try {
    const response = await makeRequest(`/v1/spaces/${space_id}/types/${type_id}/templates?${queryParams}`);
    return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
  } catch (error: any) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Templates endpoint error',
          message: 'Failed to list templates using official API endpoint',
          endpoint: `/v1/spaces/${space_id}/types/${type_id}/templates`,
          error_details: error?.message || String(error),
          suggestions: [
            'Verify that the type_id exists in this space',
            'Check if templates are available for this type',
            'Ensure API permissions for template access',
            'Verify both space_id and type_id are correct'
          ]
        }, null, 2) 
      }] 
    };
  }
}

/**
 * Get a specific template
 * Updated according to official Anytype API 2025-05-20 documentation
 * Requires both type_id and template_id as templates are associated with types
 */
export async function handleGetTemplate(args: any) {
  const { space_id, type_id, template_id } = args;
  
  // type_id is required according to official API docs
  if (!type_id) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Missing required parameter',
          message: 'Field "type_id" is required for getting a template',
          provided_parameters: Object.keys(args),
          note: 'Templates are associated with specific types in Anytype API 2025-05-20'
        }, null, 2) 
      }] 
    };
  }
  
  try {
    const response = await makeRequest(`/v1/spaces/${space_id}/types/${type_id}/templates/${template_id}`);
    return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
  } catch (error: any) {
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          error: 'Template retrieval error',
          message: 'Failed to get template using official API endpoint',
          endpoint: `/v1/spaces/${space_id}/types/${type_id}/templates/${template_id}`,
          error_details: error?.message || String(error),
          suggestions: [
            'Verify that the type_id exists in this space',
            'Verify that the template_id exists for this type',
            'Check API permissions for template access',
            'Ensure space_id, type_id, and template_id are all correct'
          ]
        }, null, 2) 
      }] 
    };
  }
}