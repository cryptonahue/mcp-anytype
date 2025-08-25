/**
 * Common schemas used by Anytype MCP tools
 */

// Schema for icons
export const iconSchema = {
  type: 'object',
  properties: {
    emoji: { type: 'string' },
    format: { type: 'string', default: 'emoji' },
  },
  description: 'Icono',
};

// Schema for pagination
export const paginationSchema = {
  limit: {
    type: 'number',
    description: 'Límite de resultados (default: 20)',
    default: 20,
  },
  offset: {
    type: 'number',
    description: 'Offset para paginación (default: 0)',
    default: 0,
  },
};

// Schema for object properties
export const objectPropertiesSchema = {
  type: 'array',
  description: 'Propiedades del objeto',
  items: {
    type: 'object',
    properties: {
      key: { type: 'string' },
      text: { type: 'string' },
      checkbox: { type: 'boolean' },
      number: { type: 'number' },
      url: { type: 'string' },
    },
  },
};

// Base schema for required space_id
export const spaceIdSchema = {
  space_id: { 
    type: 'string', 
    description: 'ID del espacio', 
    required: true 
  },
};

// Base schema for required object_id
export const objectIdSchema = {
  object_id: { 
    type: 'string', 
    description: 'ID del objeto', 
    required: true 
  },
};