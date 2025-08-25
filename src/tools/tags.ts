/**
 * Tools for Tags management in Anytype
 */

import { paginationSchema } from './schemas.js';

export const tagTools = [
  {
    name: 'anytype_list_tags',
    description: 'Lists all tags for a property',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        property_key: { type: 'string', description: 'Property key', required: true },
        ...paginationSchema,
      },
      required: ['space_id', 'property_key'],
    },
  },
  {
    name: 'anytype_get_tag',
    description: 'Gets a specific tag',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        tag_id: { type: 'string', description: 'Tag ID', required: true },
      },
      required: ['space_id', 'tag_id'],
    },
  },
  {
    name: 'anytype_create_tag',
    description: 'Creates a new tag',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        name: { type: 'string', description: 'Tag name', required: true },
        color: { type: 'string', description: 'Tag color' },
        property_key: { type: 'string', description: 'Property key', required: true },
      },
      required: ['space_id', 'name', 'property_key'],
    },
  },
  {
    name: 'anytype_update_tag',
    description: 'Updates an existing tag',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        tag_id: { type: 'string', description: 'Tag ID', required: true },
        name: { type: 'string', description: 'New name' },
        color: { type: 'string', description: 'New color' },
      },
      required: ['space_id', 'tag_id'],
    },
  },
  {
    name: 'anytype_delete_tag',
    description: 'Deletes a tag',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        tag_id: { type: 'string', description: 'Tag ID', required: true },
      },
      required: ['space_id', 'tag_id'],
    },
  },
];