#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// Import tool modules
import { spaceTools } from './tools/spaces.js';
import { objectTools } from './tools/objects.js';
import { propertyTools } from './tools/properties.js';
import { typeTools } from './tools/types.js';
import { tagTools } from './tools/tags.js';
import { templateTools } from './tools/templates.js';

// API configuration
const API_BASE_URL = 'http://localhost:31009/v1';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Anytype-Version': '2025-05-20',
    // Note: Authorization header should be added per request if needed
    // 'Authorization': 'Bearer YOUR_API_KEY'
  },
});

// Create the server
const server = new Server(
  {
    name: 'anytype-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Combine all tools from modules
const tools = [
  ...spaceTools,
  ...objectTools,
  ...propertyTools,
  ...typeTools,
  ...tagTools,
  ...templateTools,
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Spaces
      case 'anytype_list_spaces': {
        const response = await apiClient.get('/space/list');
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_space': {
        const { space_id } = args as { space_id: string };
        const response = await apiClient.get(`/space/${space_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_create_space': {
        const response = await apiClient.post('/space/create', args);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_update_space': {
        const { space_id, ...updateData } = args as { space_id: string; [key: string]: any };
        const response = await apiClient.put(`/space/${space_id}`, updateData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_list_members': {
        const { space_id, limit = 20, offset = 0 } = args as { space_id: string; limit?: number; offset?: number };
        const response = await apiClient.get(`/space/${space_id}/members?limit=${limit}&offset=${offset}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_member': {
        const { space_id, member_id } = args as { space_id: string; member_id: string };
        const response = await apiClient.get(`/space/${space_id}/members/${member_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }

      // Objects
      case 'anytype_search_objects': {
        const { query, space_id, types, limit = 20 } = args as {
          query: string;
          space_id?: string;
          types?: string[];
          limit?: number;
        };
        const response = await apiClient.post('/object/search', { query, space_id, types, limit });
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_list_objects': {
        const { space_id, limit = 20, offset = 0 } = args as { space_id: string; limit?: number; offset?: number };
        const response = await apiClient.get(`/spaces/${space_id}/objects?limit=${limit}&offset=${offset}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_object': {
        const { space_id, object_id } = args as { space_id: string; object_id: string };
        const response = await apiClient.get(`/spaces/${space_id}/objects/${object_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_create_object': {
        const { space_id, ...objectData } = args as { space_id: string; [key: string]: any };
        const response = await apiClient.post(`/spaces/${space_id}/objects`, objectData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_update_object': {
        const { space_id, object_id, ...updateData } = args as { space_id: string; object_id: string; [key: string]: any };
        const response = await apiClient.put(`/spaces/${space_id}/objects/${object_id}`, updateData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_delete_object': {
        const { space_id, object_id } = args as { space_id: string; object_id: string };
        const response = await apiClient.delete(`/spaces/${space_id}/objects/${object_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }

      // Properties
      case 'anytype_list_properties': {
        const { space_id, limit = 20, offset = 0 } = args as { space_id: string; limit?: number; offset?: number };
        const response = await apiClient.get(`/space/${space_id}/properties?limit=${limit}&offset=${offset}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_property': {
        const { space_id, property_id } = args as { space_id: string; property_id: string };
        const response = await apiClient.get(`/space/${space_id}/properties/${property_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_create_property': {
        const { space_id, ...propertyData } = args as { space_id: string; [key: string]: any };
        const response = await apiClient.post(`/space/${space_id}/properties`, propertyData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_update_property': {
        const { space_id, property_id, ...updateData } = args as { space_id: string; property_id: string; [key: string]: any };
        const response = await apiClient.put(`/space/${space_id}/properties/${property_id}`, updateData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_delete_property': {
        const { space_id, property_id } = args as { space_id: string; property_id: string };
        const response = await apiClient.delete(`/space/${space_id}/properties/${property_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }

      // Types
      case 'anytype_list_types': {
        const { space_id } = args as { space_id: string };
        const response = await apiClient.get(`/space/${space_id}/types`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_type': {
        const { space_id, type_id } = args as { space_id: string; type_id: string };
        const response = await apiClient.get(`/space/${space_id}/types/${type_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_create_type': {
        const { space_id, ...typeData } = args as { space_id: string; [key: string]: any };
        const response = await apiClient.post(`/space/${space_id}/types`, typeData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_update_type': {
        const { space_id, type_id, ...updateData } = args as { space_id: string; type_id: string; [key: string]: any };
        const response = await apiClient.put(`/space/${space_id}/types/${type_id}`, updateData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_delete_type': {
        const { space_id, type_id } = args as { space_id: string; type_id: string };
        const response = await apiClient.delete(`/space/${space_id}/types/${type_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }

      // Tags
      case 'anytype_list_tags': {
        const { space_id, property_key, limit = 20, offset = 0 } = args as { space_id: string; property_key: string; limit?: number; offset?: number };
        const response = await apiClient.get(`/space/${space_id}/properties/${property_key}/tags?limit=${limit}&offset=${offset}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_tag': {
        const { space_id, tag_id } = args as { space_id: string; tag_id: string };
        const response = await apiClient.get(`/space/${space_id}/tags/${tag_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_create_tag': {
        const { space_id, property_key, ...tagData } = args as { space_id: string; property_key: string; [key: string]: any };
        const response = await apiClient.post(`/space/${space_id}/properties/${property_key}/tags`, tagData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_update_tag': {
        const { space_id, tag_id, ...updateData } = args as { space_id: string; tag_id: string; [key: string]: any };
        const response = await apiClient.put(`/space/${space_id}/tags/${tag_id}`, updateData);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_delete_tag': {
        const { space_id, tag_id } = args as { space_id: string; tag_id: string };
        const response = await apiClient.delete(`/space/${space_id}/tags/${tag_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }

      // Templates
      case 'anytype_list_templates': {
        const { space_id, type_id, limit = 20, offset = 0 } = args as { space_id: string; type_id?: string; limit?: number; offset?: number };
        const queryParams = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
        if (type_id) queryParams.append('type_id', type_id);
        const response = await apiClient.get(`/space/${space_id}/templates?${queryParams}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_template': {
        const { space_id, template_id } = args as { space_id: string; template_id: string };
        const response = await apiClient.get(`/space/${space_id}/templates/${template_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_add_to_collection': {
        const { space_id, collection_id, object_id } = args as { space_id: string; collection_id: string; object_id: string };
        const response = await apiClient.post(`/space/${space_id}/collections/${collection_id}/objects`, { object_id });
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_remove_from_collection': {
        const { space_id, collection_id, object_id } = args as { space_id: string; collection_id: string; object_id: string };
        const response = await apiClient.delete(`/space/${space_id}/collections/${collection_id}/objects/${object_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_list_views': {
        const { space_id, list_id } = args as { space_id: string; list_id: string };
        const response = await apiClient.get(`/space/${space_id}/lists/${list_id}/views`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }
      case 'anytype_get_list_objects': {
        const { space_id, list_id, view_id, limit, offset } = args as { space_id: string; list_id: string; view_id: string; limit?: number; offset?: number };
        const queryParams = new URLSearchParams({ view_id });
        if (limit) queryParams.append('limit', limit.toString());
        if (offset) queryParams.append('offset', offset.toString());
        const response = await apiClient.get(`/space/${space_id}/lists/${list_id}/objects?${queryParams}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing ${name}: ${errorMessage}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Anytype MCP server running on stdio');
}

await main();