#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

const API_BASE_URL = process.env.ANYTYPE_API_URL || 'http://localhost:31009';
const API_VERSION = '2025-05-20';

interface AnytypeSpace {
  id: string;
  name: string;
  description?: string;
  icon?: {
    emoji?: string;
    format?: string;
  };
}

interface AnytypeObject {
  id: string;
  name: string;
  type: string;
  space_id: string;
  body?: string;
  icon?: {
    emoji?: string;
    format?: string;
  };
  properties?: any[];
  archived?: boolean;
}

class AnytypeServer {
  private server: Server;
  private apiKey: string | undefined;

  constructor() {
    this.server = new Server(
      {
        name: 'anytype-mcp-custom',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.ANYTYPE_API_KEY;
    this.setupToolHandlers();
  }

  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    if (!this.apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        'API key not configured. Set ANYTYPE_API_KEY environment variable.'
      );
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Anytype-Version': API_VERSION,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new McpError(
        ErrorCode.InternalError,
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'anytype_list_spaces',
          description: 'Lista todos los espacios disponibles en Anytype',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'anytype_search_objects',
          description: 'Busca objetos en todos los espacios o en un espacio específico',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Texto a buscar',
              },
              space_id: {
                type: 'string',
                description: 'ID del espacio específico (opcional)',
              },
              types: {
                type: 'array',
                items: { type: 'string' },
                description: 'Tipos de objetos a filtrar (ej: ["page", "note"])',
              },
              limit: {
                type: 'number',
                description: 'Límite de resultados (default: 20)',
                default: 20,
              },
            },
          },
        },
        {
          name: 'anytype_get_object',
          description: 'Obtiene un objeto específico por su ID',
          inputSchema: {
            type: 'object',
            properties: {
              space_id: {
                type: 'string',
                description: 'ID del espacio',
                required: true,
              },
              object_id: {
                type: 'string',
                description: 'ID del objeto',
                required: true,
              },
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
              space_id: {
                type: 'string',
                description: 'ID del espacio donde crear el objeto',
                required: true,
              },
              name: {
                type: 'string',
                description: 'Nombre del objeto',
                required: true,
              },
              type_key: {
                type: 'string',
                description: 'Tipo de objeto (ej: "page", "note")',
                default: 'page',
              },
              body: {
                type: 'string',
                description: 'Contenido del objeto (soporta Markdown)',
              },
              icon: {
                type: 'object',
                properties: {
                  emoji: { type: 'string' },
                  format: { type: 'string', default: 'emoji' },
                },
                description: 'Icono del objeto',
              },
              properties: {
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
              },
              template_id: {
                type: 'string',
                description: 'ID de plantilla para usar como base (opcional)',
              },
            },
            required: ['space_id', 'name'],
          },
        },
        {
          name: 'anytype_update_object',
          description: 'Actualiza un objeto existente - Esta es la funcionalidad clave que faltaba en el MCP oficial',
          inputSchema: {
            type: 'object',
            properties: {
              space_id: {
                type: 'string',
                description: 'ID del espacio',
                required: true,
              },
              object_id: {
                type: 'string',
                description: 'ID del objeto a actualizar',
                required: true,
              },
              name: {
                type: 'string',
                description: 'Nuevo nombre del objeto',
              },
              body: {
                type: 'string',
                description: 'Nuevo contenido del objeto (soporta Markdown)',
              },
              icon: {
                type: 'object',
                properties: {
                  emoji: { type: 'string' },
                  format: { type: 'string', default: 'emoji' },
                },
                description: 'Nuevo icono del objeto',
              },
              properties: {
                type: 'array',
                description: 'Propiedades actualizadas del objeto',
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
              },
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
              space_id: {
                type: 'string',
                description: 'ID del espacio',
                required: true,
              },
              object_id: {
                type: 'string',
                description: 'ID del objeto a eliminar',
                required: true,
              },
            },
            required: ['space_id', 'object_id'],
          },
        },
        {
          name: 'anytype_list_objects',
          description: 'Lista objetos en un espacio específico',
          inputSchema: {
            type: 'object',
            properties: {
              space_id: {
                type: 'string',
                description: 'ID del espacio',
                required: true,
              },
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
            },
            required: ['space_id'],
          },
        },
        {
          name: 'anytype_list_types',
          description: 'Lista todos los tipos de objetos disponibles en un espacio',
          inputSchema: {
            type: 'object',
            properties: {
              space_id: {
                type: 'string',
                description: 'ID del espacio',
                required: true,
              },
            },
            required: ['space_id'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'anytype_list_spaces':
            return await this.listSpaces();

          case 'anytype_search_objects':
            return await this.searchObjects(args);

          case 'anytype_get_object':
            return await this.getObject(args);

          case 'anytype_create_object':
            return await this.createObject(args);

          case 'anytype_update_object':
            return await this.updateObject(args);

          case 'anytype_delete_object':
            return await this.deleteObject(args);

          case 'anytype_list_objects':
            return await this.listObjects(args);

          case 'anytype_list_types':
            return await this.listTypes(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Tool not found: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  private async listSpaces() {
    const response = await this.makeRequest('/v1/spaces') as any;
    return {
      content: [
        {
          type: 'text',
          text: `Espacios encontrados: ${response.data?.length || 0}\n\n` +
                JSON.stringify(response.data || [], null, 2),
        },
      ],
    };
  }

  private async searchObjects(args: any) {
    const { query = '', space_id, types = [], limit = 20 } = args;
    
    let endpoint: string;
    let payload: any = {
      query,
      types,
      sort: {
        direction: 'desc',
        property_key: 'last_modified_date',
      },
    };

    if (space_id) {
      endpoint = `/v1/spaces/${space_id}/search?limit=${limit}`;
    } else {
      endpoint = `/v1/search?limit=${limit}`;
    }

    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as any;

    return {
      content: [
        {
          type: 'text',
          text: `Objetos encontrados: ${response.data?.length || 0}\n\n` +
                JSON.stringify(response.data || [], null, 2),
        },
      ],
    };
  }

  private async getObject(args: any) {
    const { space_id, object_id } = args;
    const response = await this.makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`) as any;
    
    return {
      content: [
        {
          type: 'text',
          text: `Objeto obtenido:\n\n${JSON.stringify(response.object || response, null, 2)}`,
        },
      ],
    };
  }

  private async createObject(args: any) {
    const { space_id, ...objectData } = args;
    
    const payload = {
      type_key: 'page',
      ...objectData,
    };

    const response = await this.makeRequest(`/v1/spaces/${space_id}/objects`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as any;

    return {
      content: [
        {
          type: 'text',
          text: `Objeto creado exitosamente:\n\n${JSON.stringify(response.object || response, null, 2)}`,
        },
      ],
    };
  }

  private async updateObject(args: any) {
    const { space_id, object_id, ...updateData } = args;
    
    // Filtrar campos undefined/null para enviar solo lo que se quiere actualizar
    const payload = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
    );

    const response = await this.makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }) as any;

    return {
      content: [
        {
          type: 'text',
          text: `Objeto actualizado exitosamente:\n\n${JSON.stringify(response.object || response, null, 2)}`,
        },
      ],
    };
  }

  private async deleteObject(args: any) {
    const { space_id, object_id } = args;
    
    await this.makeRequest(`/v1/spaces/${space_id}/objects/${object_id}`, {
      method: 'DELETE',
    });

    return {
      content: [
        {
          type: 'text',
          text: `Objeto ${object_id} eliminado (archivado) exitosamente.`,
        },
      ],
    };
  }

  private async listObjects(args: any) {
    const { space_id, limit = 20, offset = 0 } = args;
    
    const response = await this.makeRequest(`/v1/spaces/${space_id}/objects?limit=${limit}&offset=${offset}`) as any;

    return {
      content: [
        {
          type: 'text',
          text: `Objetos en el espacio (${response.data?.length || 0} de ${response.pagination?.total || 0}):\n\n` +
                JSON.stringify(response.data || [], null, 2),
        },
      ],
    };
  }

  private async listTypes(args: any) {
    const { space_id } = args;
    
    const response = await this.makeRequest(`/v1/spaces/${space_id}/types`) as any;

    return {
      content: [
        {
          type: 'text',
          text: `Tipos disponibles en el espacio:\n\n${JSON.stringify(response.data || [], null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Servidor MCP Anytype personalizado iniciado');
  }
}

const server = new AnytypeServer();
await server.run();