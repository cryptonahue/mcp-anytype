/**
 * Tools for Objects management in Anytype
 */

import { iconSchema, paginationSchema, objectPropertiesSchema } from './schemas.js';

export const objectTools = [
  {
    name: 'anytype_search_objects',
    description: 'Busca objetos en todos los espacios o en un espacio específico',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Texto a buscar' },
        space_id: { type: 'string', description: 'ID del espacio específico (opcional)' },
        types: { type: 'array', items: { type: 'string' }, description: 'Tipos de objetos a filtrar' },
        limit: { type: 'number', description: 'Límite de resultados', default: 20 },
      },
    },
  },
  {
    name: 'anytype_list_objects',
    description: 'Lista objetos en un espacio específico',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        ...paginationSchema,
      },
      required: ['space_id'],
    },
  },
  {
    name: 'anytype_get_object',
    description: 'Obtiene un objeto específico por su ID',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        object_id: { type: 'string', description: 'ID del objeto', required: true },
      },
      required: ['space_id', 'object_id'],
    },
  },
  {
    name: 'anytype_create_object',
    description: 'Crea un nuevo objeto en un espacio',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        name: { type: 'string', description: 'Nombre del objeto', required: true },
        type_key: { type: 'string', description: 'Tipo de objeto', default: 'page' },
        body: { type: 'string', description: 'Contenido del objeto (Markdown)' },
        icon: iconSchema,
        properties: objectPropertiesSchema,
        template_id: { type: 'string', description: 'ID de plantilla' },
      },
      required: ['space_id', 'name'],
    },
  },
  {
    name: 'anytype_update_object',
    description: 'Actualiza un objeto existente',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        object_id: { type: 'string', description: 'ID del objeto', required: true },
        name: { type: 'string', description: 'Nuevo nombre del objeto' },
        body: { type: 'string', description: 'Nuevo contenido (Markdown)' },
        icon: iconSchema,
        properties: objectPropertiesSchema,
      },
      required: ['space_id', 'object_id'],
    },
  },
  {
    name: 'anytype_delete_object',
    description: 'Elimina (archiva) un objeto',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        object_id: { type: 'string', description: 'ID del objeto', required: true },
      },
      required: ['space_id', 'object_id'],
    },
  },
];