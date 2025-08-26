@echo off
echo 🔨 Building Anytype MCP Server...

call npx tsc

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo.
    echo You can now run:
    echo   node test_fixes.js     - Run the comprehensive test suite
    echo   node dist/index.js     - Start the MCP server
) else (
    echo ❌ Build failed!
    exit /b 1
)
