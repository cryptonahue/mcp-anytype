/**
 * Tools for Templates and Collections management in Anytype
 */

import { paginationSchema } from './schemas.js';

export const templateTools = [
  {
    name: 'anytype_list_templates',
    description: 'Lists all available templates',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        type_id: { type: 'string', description: 'Type ID to filter' },
        ...paginationSchema,
      },
      required: ['space_id'],
    },
  },
  {
    name: 'anytype_get_template',
    description: 'Gets a specific template',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        template_id: { type: 'string', description: 'Template ID', required: true },
      },
      required: ['space_id', 'template_id'],
    },
  },
  {
    name: 'anytype_add_to_collection',
    description: 'Adds an object to a collection',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        collection_id: { type: 'string', description: 'Collection ID', required: true },
        object_id: { type: 'string', description: 'Object ID', required: true },
      },
      required: ['space_id', 'collection_id', 'object_id'],
    },
  },
  {
    name: 'anytype_remove_from_collection',
    description: 'Removes an object from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        collection_id: { type: 'string', description: 'Collection ID', required: true },
        object_id: { type: 'string', description: 'Object ID', required: true },
      },
      required: ['space_id', 'collection_id', 'object_id'],
    },
  },
  {
    name: 'anytype_get_list_views',
    description: 'Gets available views for a list',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        list_id: { type: 'string', description: 'List ID', required: true },
      },
      required: ['space_id', 'list_id'],
    },
  },
  {
    name: 'anytype_get_list_objects',
    description: 'Gets objects from a list using a specific view',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'Space ID', required: true },
        list_id: { type: 'string', description: 'List ID', required: true },
        view_id: { type: 'string', description: 'View ID', required: true },
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
      required: ['space_id', 'list_id', 'view_id'],
    },
  },
];