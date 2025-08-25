# Custom MCP Server for Anytype

A custom MCP (Model Context Protocol) server for Anytype that includes **full support for object updates**, functionality that is not available in the official Anytype MCP server.

## 🚀 Features

- ✅ **Update existing objects** (main added functionality)
- ✅ Create new objects
- ✅ Search objects (global and by space)
- ✅ List spaces and objects
- ✅ Get specific objects
- ✅ Delete (archive) objects
- ✅ Object type management
- ✅ Full Markdown support in content
- ✅ Custom property handling
- ✅ Icons and metadata

## 📋 Prerequisites

1. **Anytype Desktop** must be running on your machine
2. **Node.js** 18+ installed
3. **Anytype API Key** (obtained through authentication process)

## 🔧 Installation

### 1. Clone or download this project

### 2. Install dependencies

```bash
cd my-mcp-anytype
npm install
```

### 3. Build the project

```bash
npm run build
```

## 🔑 API Key Configuration

### Option 1: Get API Key through challenge

```bash
# 1. Request challenge
curl -X POST "http://localhost:31009/v1/auth/challenges" \
  -H "Content-Type: application/json"

# 2. Use the challenge_id in Anytype Desktop (Settings > API)
# 3. Create the API key
curl -X POST "http://localhost:31009/v1/auth/keys" \
  -H "Content-Type: application/json" \
  -d '{"challenge_id": "YOUR_CHALLENGE_ID"}'
```

### Option 2: Generate from Anytype Desktop

1. Open Anytype Desktop
2. Go to Settings → API
3. Generate a new API Key
4. Copy the generated key

### 3. Set environment variable

```bash
# Windows
set ANYTYPE_API_KEY=your_api_key_here

# PowerShell
$env:ANYTYPE_API_KEY="your_api_key_here"
```

## 🚀 Usage with Claude Desktop

### 1. Configure in Claude Desktop

Edit your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "anytype-custom": {
      "command": "node",
      "args": ["path\\to\\your\\my-mcp-anytype\\dist\\index.js"],
      "env": {
        "ANYTYPE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### 2. Restart Claude Desktop

Restart Claude Desktop to load the new MCP server.

## 📖 Usage Examples

### Update an existing object (Key functionality!)

```
Please update the object with ID "abc123" in space "space456" changing the title to "My updated document" and adding new markdown content.
```

### Create a new object

```
Create a new page in the "my-space" space with the title "My new page" and markdown content with a task list.
```

### Search objects

```
Search for all objects containing "project" in my Anytype spaces.
```

### List objects in a space

```
Show all objects in my main Anytype space.
```

## 🛠️ Available Tools

| Tool | Description |
|------|-------------|
| `anytype_list_spaces` | List all available spaces |
| `anytype_search_objects` | Search objects by text and filters |
| `anytype_get_object` | Get a specific object |
| `anytype_create_object` | Create a new object |
| **`anytype_update_object`** | **Update an existing object** ⭐ |
| `anytype_delete_object` | Delete (archive) an object |
| `anytype_list_objects` | List objects in a space |
| `anytype_list_types` | List available object types |

## 🆚 Differences with the Official MCP

| Feature | Official MCP | Custom MCP |
|---------|-------------|------------|
| Create objects | ✅ | ✅ |
| Read objects | ✅ | ✅ |
| **Update objects** | ❌ | ✅ |
| Delete objects | ✅ | ✅ |
| Advanced search | ✅ | ✅ |
| Type management | ❌ | ✅ |

## 🔧 Development

### Run in development mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Project structure

```
my-mcp-anytype/
├── src/
│   └── index.ts          # Main code
├── dist/                 # Compiled code
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Troubleshooting

### Connection error

- Verify that Anytype Desktop is running
- Check that the API Key is valid
- Ensure port 31009 is available

### Authentication error

- Regenerate your API Key in Anytype Desktop
- Verify that the `ANYTYPE_API_KEY` variable is configured correctly

### Server doesn't appear in Claude

- Verify the path to the compiled file in the configuration
- Make sure you have built the project (`npm run build`)
- Restart Claude Desktop after changing the configuration

## 📝 License

MIT License - Feel free to modify and distribute according to your needs.

## 🤝 Contributions

Contributions are welcome! This server was created to cover the missing object update functionality in the official Anytype MCP.