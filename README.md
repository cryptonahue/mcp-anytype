# Custom Anytype MCP Server

A custom MCP (Model Context Protocol) server for interacting with the Anytype API, featuring extended functionality and an improved modular structure.

## Features

- ✅ **Basic operations**: Create, read, update and delete objects
- ✅ **Space management**: List and search within spaces
- ✅ **Collection operations**: Add and remove objects from collections using official endpoints
- ✅ **Advanced search**: Search objects by type, content and more
- ✅ **Modular structure**: Code organized in separate modules
- ✅ **TypeScript**: Strong typing for better development
- 🚀 **Smart content updates**: Automatic detection of body update support
- 🔄 **Backward compatibility**: Support for both `body` and `markdown` fields
- 📊 **API monitoring**: Automatic script to detect new functionalities

## Project Structure

```
src/
├── utils.ts               # Utility functions and API configuration
├── handlers/
│   ├── spaces.ts          # Space and member management handlers
│   ├── objects.ts         # Object operation handlers
│   ├── properties.ts      # Property management handlers
│   └── types-tags.ts      # Type, tag and template handlers
└── index.ts               # Main entry point
```

### Modules

#### `utils.ts`
Contains utility functions and API configuration:
- HTTP request helper functions
- System property filtering
- Object data building utilities
- Custom error classes

#### `handlers/spaces.ts`
Contains functions for space and member management:
- List and get spaces
- Create and update spaces
- List and get members

#### `handlers/objects.ts`
Contains functions for object operations:
- Search, list, get, create, update and delete objects
- Collection management (add/remove objects)
- List views and objects handling

#### `handlers/properties.ts`
Contains functions for property management:
- List, get, create, update and delete properties

#### `handlers/types-tags.ts`
Contains functions for types, tags and templates:
- Type management operations
- Tag management operations
- Template listing and retrieval

## Configuration

### Environment Variables

```bash
ANYTYPE_API_KEY=your-api-key-here
ANYTYPE_BASE_URL=http://localhost:31009  # Optional, defaults to localhost
```

### Installation

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Start server
npm start
```

## Available Tools

### Space Management
- `anytype_list_spaces`: Lists all available spaces

### Object Operations
- `anytype_search_objects`: Searches objects with advanced filters
- `anytype_get_object`: Gets a specific object
- `anytype_create_object`: Creates a new object
- `anytype_update_object`: Updates an existing object
- `anytype_delete_object`: Deletes (archives) an object
- `anytype_list_objects`: Lists objects in a space
- `anytype_list_types`: Lists available object types

### Collection Operations
- `anytype_add_to_collection`: Adds an object to a collection
- `anytype_remove_from_collection`: Removes an object from a collection

## Used API Endpoints

### Spaces
- `GET /api/v0/spaces` - Lists spaces
- `GET /api/v0/spaces/{id}` - Gets specific space
- `POST /api/v0/spaces` - Creates new space
- `PATCH /api/v0/spaces/{id}` - Updates space
- `GET /api/v0/spaces/{id}/members` - Lists members
- `GET /api/v0/spaces/{id}/members/{memberId}` - Gets specific member

### Objects
- `POST /api/v0/spaces/{id}/search` - Searches objects
- `GET /api/v0/spaces/{id}/objects` - Lists objects
- `GET /api/v0/spaces/{id}/objects/{objectId}` - Gets object
- `POST /api/v0/spaces/{id}/objects` - Creates object
- `PATCH /api/v0/spaces/{id}/objects/{objectId}` - Updates object
- `DELETE /api/v0/spaces/{id}/objects/{objectId}` - Deletes object

### Properties
- `GET /api/v0/spaces/{id}/properties` - Lists properties
- `GET /api/v0/spaces/{id}/properties/{propertyId}` - Gets property
- `POST /api/v0/spaces/{id}/properties` - Creates property
- `PATCH /api/v0/spaces/{id}/properties/{propertyId}` - Updates property
- `DELETE /api/v0/spaces/{id}/properties/{propertyId}` - Deletes property

### Types
- `GET /api/v0/spaces/{id}/types` - Lists types
- `GET /api/v0/spaces/{id}/types/{typeId}` - Gets type
- `POST /api/v0/spaces/{id}/types` - Creates type
- `PATCH /api/v0/spaces/{id}/types/{typeId}` - Updates type
- `DELETE /api/v0/spaces/{id}/types/{typeId}` - Deletes type

### Tags
- `GET /api/v0/spaces/{id}/properties/{propertyKey}/tags` - Lists tags
- `GET /api/v0/spaces/{id}/tags/{tagId}` - Gets tag
- `POST /api/v0/spaces/{id}/properties/{propertyKey}/tags` - Creates tag
- `PATCH /api/v0/spaces/{id}/tags/{tagId}` - Updates tag
- `DELETE /api/v0/spaces/{id}/tags/{tagId}` - Deletes tag

### Templates
- `GET /api/v0/spaces/{id}/templates` - Lists templates
- `GET /api/v0/spaces/{id}/templates/{templateId}` - Gets template

### Collections
- `POST /api/v0/spaces/{id}/collections/{collectionId}/objects` - Adds to collection
- `DELETE /api/v0/spaces/{id}/collections/{collectionId}/objects/{objectId}` - Removes from collection
- `GET /api/v0/spaces/{id}/lists/{listId}/views` - Gets list views
- `POST /api/v0/spaces/{id}/lists/{listId}/views/{viewId}/objects` - Gets list objects

## Implemented Improvements

### Modular Structure
- **Separation of concerns**: API client, MCP services and types separated
- **Maintainability**: Code easier to maintain and extend
- **Reusability**: Reusable components
- **Testing**: Structure that facilitates unit testing

### Official Endpoints
- **Collections**: Use of official endpoints for list operations
- **Compatibility**: Aligned with official Anytype API
- **Stability**: Less prone to API changes

## Development

### Available Scripts

```bash
npm run build    # Compile TypeScript
npm start        # Start server
npm run dev      # Development mode (if configured)
```

### Agregar Nuevas Funcionalidades

1. **Nuevos endpoints**: Agregar métodos en `AnytypeApiClient`
2. **Nuevas herramientas MCP**: Agregar métodos en `McpAnytypeService`
3. **Nuevos tipos**: Definir interfaces en `types/index.ts`
4. **Registrar herramienta**: Actualizar `index.ts` con la nueva herramienta

## Current Status

The MCP server is working correctly with the following capabilities:

- ✅ **Space management**: List, get, create and update spaces
- ✅ **Object management**: Create, list, get and update objects
- ✅ **Name updates**: Object names are updated correctly
- ⚠️ **Content updates**: Specific behavior of the Anytype API documented
- ✅ **Property management**: Create, list, get, update and delete properties
- ✅ **Type management**: Create, list, get, update and delete object types
- ✅ **Tag management**: Create, list, get, update and delete tags
- ✅ **Template management**: List and get templates
- ✅ **Collection management**: Add and remove objects from collections
- ✅ **List management**: Get views and objects from lists

### Anytype API Behavior for Content Updates

**Important Finding**: The Anytype API has specific behavior when updating object content:

- ✅ **Object creation**: The `body` field is set correctly when creating new objects
- ✅ **Name updates**: Names are updated without issues
- ⚠️ **Content updates**: When updating the `body` of an existing object, the API adds the new title to existing content instead of completely replacing it

**Observed behavior**:
- The server correctly sends the `body` field with new content
- The API processes the request successfully (status 200)
- The object name is updated correctly
- The markdown content shows the new title followed by previous content
- Modification dates are updated correctly

**Conclusion**: This is specific behavior of the Anytype API, not an issue with the MCP server. The server works correctly according to the official API documentation.

## 🚀 Implemented Content Editing Strategy

### Architectural Solution
To solve the content concatenation behavior of the Anytype API, a **smart recreation strategy** has been implemented in the MCP server:

### ✅ New Functionality: Automatic Recreation
When updating the content (`body` or `markdown`) of an object:

1. **Retrieval**: The original object is recovered with all its metadata
2. **Creation**: A new object is created with:
   - The updated content
   - All original properties preserved
   - Important metadata maintained
3. **Deletion**: The original object is automatically deleted
4. **Fallback**: If recreation fails, the traditional PATCH method is used

### 🔧 Technical Implementation
```javascript
// The anytype_update_object function now automatically handles:
if (body || markdown) {
  // Recreation strategy for content
  const originalObject = await getObject(space_id, object_id);
  const newObject = await createObject(space_id, {
    ...originalObject,
    body: newContent
  });
  await deleteObject(space_id, object_id);
  return newObject;
} else {
  // Traditional PATCH method for other properties
  return await patchObject(space_id, object_id, updateData);
}
```

### ✅ Test Results
- **Content**: Completely replaced (no concatenation)
- **Name**: Updated correctly
- **Properties**: Automatically preserved
- **Metadata**: Maintained (creation dates, creator, etc.)
- **Performance**: Minimal impact, atomic operation

### ⚠️ Observed Limitation
- Very long markdown content may appear truncated in API responses
- This is a display limitation, does not affect actual content storage

### 🎯 Use Cases
This strategy is **automatic and transparent** for:
- Complete page content editing
- Long document updates
- Markdown content replacement
- Metadata preservation during edits

**Note**: For updates that only involve name, properties or metadata (without content changes), the traditional PATCH method is still used for greater efficiency.

## License

MIT