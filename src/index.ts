#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { displayStartupInfo } from './startup-info.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import tool modules
import { spaceTools } from './tools/spaces.js';
import { objectTools } from './tools/objects.js';
import { propertyTools } from './tools/properties.js';
import { typeTools } from './tools/types.js';
import { tagTools } from './tools/tags.js';
import { templateTools } from './tools/templates.js';
import { listTools } from './tools/lists.js';

// Import handlers
import {
  handleListSpaces,
  handleGetSpace,
  handleCreateSpace,
  handleUpdateSpace,
  handleListMembers,
  handleGetMember
} from './handlers/spaces.js';

import {
  handleSearchObjects,
  handleListObjects,
  handleGetObject,
  handleCreateObject,
  handleUpdateObject,
  handleDeleteObject,
  handleAddToCollection,
  handleRemoveFromCollection,
  handleGetListViews,
  handleGetListObjects
} from './handlers/objects.js';

import {
  handleListProperties,
  handleGetProperty,
  handleCreateProperty,
  handleUpdateProperty,
  handleDeleteProperty
} from './handlers/properties.js';

import {
  handleListTypes,
  handleGetType,
  handleCreateType,
  handleUpdateType,
  handleDeleteType,
  handleListTags,
  handleGetTag,
  handleCreateTag,
  handleUpdateTag,
  handleDeleteTag,
  handleListTemplates,
  handleGetTemplate
} from './handlers/types-tags.js';

console.error('API Key:', process.env.ANYTYPE_API_KEY ? 'Present' : 'Missing');

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
  ...listTools,
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
      case 'anytype_list_spaces':
        return await handleListSpaces();
      case 'anytype_get_space':
        return await handleGetSpace(args);
      case 'anytype_create_space':
        return await handleCreateSpace(args);
      case 'anytype_update_space':
        return await handleUpdateSpace(args);
      case 'anytype_list_members':
        return await handleListMembers(args);
      case 'anytype_get_member':
        return await handleGetMember(args);

      // Objects
      case 'anytype_search_objects':
        return await handleSearchObjects(args);
      case 'anytype_list_objects':
        return await handleListObjects(args);
      case 'anytype_get_object':
        return await handleGetObject(args);
      case 'anytype_create_object':
        return await handleCreateObject(args);
      case 'anytype_update_object':
        return await handleUpdateObject(args);
      case 'anytype_delete_object':
        return await handleDeleteObject(args);

      // Properties
      case 'anytype_list_properties':
        return await handleListProperties(args);
      case 'anytype_get_property':
        return await handleGetProperty(args);
      case 'anytype_create_property':
        return await handleCreateProperty(args);
      case 'anytype_update_property':
        return await handleUpdateProperty(args);
      case 'anytype_delete_property':
        return await handleDeleteProperty(args);

      // Types
      case 'anytype_list_types':
        return await handleListTypes(args);
      case 'anytype_get_type':
        return await handleGetType(args);
      case 'anytype_create_type':
        return await handleCreateType(args);
      case 'anytype_update_type':
        return await handleUpdateType(args);
      case 'anytype_delete_type':
        return await handleDeleteType(args);

      // Tags
      case 'anytype_list_tags':
        return await handleListTags(args);
      case 'anytype_get_tag':
        return await handleGetTag(args);
      case 'anytype_create_tag':
        return await handleCreateTag(args);
      case 'anytype_update_tag':
        return await handleUpdateTag(args);
      case 'anytype_delete_tag':
        return await handleDeleteTag(args);

      // Templates
      case 'anytype_list_templates':
        return await handleListTemplates(args);
      case 'anytype_get_template':
        return await handleGetTemplate(args);

      // Lists (reemplazan las colecciones)
      case 'anytype_get_list_views':
        return await handleGetListViews(args);
      case 'anytype_get_list_objects':
        return await handleGetListObjects(args);

      // Colecciones (DEPRECATED - usar listas en su lugar)
      case 'anytype_add_to_collection':
        return await handleAddToCollection(args);
      case 'anytype_remove_from_collection':
        return await handleRemoveFromCollection(args);

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
  // Display startup information
  await displayStartupInfo();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🎯 Servidor MCP conectado y listo para recibir solicitudes');
}

await main();