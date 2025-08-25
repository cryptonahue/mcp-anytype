/**
 * Tools for Types management in Anytype
 */

import { iconSchema } from './schemas.js';

export const typeTools = [
  {
    name: 'anytype_list_types',
    description: 'Lista todos los tipos de objetos',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
      },
      required: ['space_id'],
    },
  },
  {
    name: 'anytype_get_type',
    description: 'Obtiene un tipo específico',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        type_id: { type: 'string', description: 'ID del tipo', required: true },
      },
      required: ['space_id', 'type_id'],
    },
  },
  {
    name: 'anytype_create_type',
    description: 'Crea un nuevo tipo de objeto',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        key: { type: 'string', description: 'Clave única del tipo' },
        name: { type: 'string', description: 'Nombre del tipo', required: true },
        description: { type: 'string', description: 'Descripción del tipo' },
        icon: iconSchema,
        layout: { type: 'string', description: 'Layout del tipo' },
        properties: { type: 'array', items: { type: 'string' }, description: 'IDs de propiedades' },
      },
      required: ['space_id', 'name'],
    },
  },
  {
    name: 'anytype_update_type',
    description: 'Actualiza un tipo existente',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        type_id: { type: 'string', description: 'ID del tipo', required: true },
        name: { type: 'string', description: 'Nuevo nombre' },
        description: { type: 'string', description: 'Nueva descripción' },
        icon: iconSchema,
        layout: { type: 'string', description: 'Nuevo layout' },
        properties: { type: 'array', items: { type: 'string' }, description: 'Nuevos IDs de propiedades' },
      },
      required: ['space_id', 'type_id'],
    },
  },
  {
    name: 'anytype_delete_type',
    description: 'Elimina un tipo de objeto',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: { type: 'string', description: 'ID del espacio', required: true },
        type_id: { type: 'string', description: 'ID del tipo', required: true },
      },
      required: ['space_id', 'type_id'],
    },
  },
];