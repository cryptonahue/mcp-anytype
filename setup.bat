@echo off
echo Installing dependencies...
npm install

echo.
echo Building the project...
npm run build

echo.
echo ========================================
echo ✅ Anytype MCP Server created successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure Anytype Desktop is running
echo 2. Get your Anytype API Key (see README.md)
echo 3. Set the environment variable:
echo    set ANYTYPE_API_KEY=your_api_key_here
echo 4. Add the server to your Claude Desktop configuration
echo.
echo Claude Desktop configuration file:
echo %%APPDATA%%\Claude\claude_desktop_config.json
echo.
echo Configuration example:
echo {
echo   "mcpServers": {
echo     "anytype-custom": {
echo       "command": "node",
echo       "args": ["path\\to\\your\\my-mcp-anytype\\dist\\index.js"],
echo       "env": {
echo         "ANYTYPE_API_KEY": "your_api_key_here"
echo       }
echo     }
echo   }
echo }
echo.
pause