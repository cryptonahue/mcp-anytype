@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: =============================================================================
:: 🔧 ANYTYPE API DEBUG TOOL - WINDOWS BATCH VERSION
:: =============================================================================
:: Este script hace pruebas sistemáticas de la API de Anytype
:: para diagnosticar por qué no se actualiza el contenido markdown

:: Configuración
set API_BASE=http://localhost:31009
set API_KEY=xtVSxolbbxsUsgv49p4cCgfv//HAl7HB09DCupT4KEM=
set API_VERSION=2025-05-20
set SPACE_ID=bafyreieezkotenzua6722avng7ywgihgi6yn2fd2s56qt4acxroxmvz4gu.1mmy9s6wnxg7
set OBJECT_ID=bafyreibndmhoeycnim3b3ay5aoefjehv3sfizwi3n4ypmmwuhw3prvkvbi
set TIMESTAMP=%date% %time%

:: Crear carpeta para logs
if not exist "anytype_debug_logs" mkdir anytype_debug_logs

echo.
echo ████████████████████████████████████████████████████████
echo 🔧 ANYTYPE API DEBUG TOOL
echo ████████████████████████████████████████████████████████
echo.
echo 📋 Configuración:
echo    API Base: %API_BASE%
echo    API Version: %API_VERSION%
echo    Space ID: %SPACE_ID%
echo    Object ID: %OBJECT_ID%
echo    Timestamp: %TIMESTAMP%
echo.

pause

:: =============================================================================
:: TEST 1: Verificar conectividad
:: =============================================================================
echo.
echo 🧪 TEST 1: Verificando conectividad...
echo ════════════════════════════════════════════════════════════════════════════
echo.

curl -X GET "%API_BASE%/v1/spaces" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/01_spaces.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 1 EXITOSO - Conectividad OK
    echo 📄 Respuesta guardada en: anytype_debug_logs/01_spaces.json
) else (
    echo ❌ Test 1 FALLÓ - No se puede conectar a la API
    echo 💡 Verifica que Anytype esté corriendo y la API esté habilitada
    pause
    exit /b 1
)

echo.
pause

:: =============================================================================
:: TEST 2: Obtener objeto actual
:: =============================================================================
echo.
echo 🧪 TEST 2: Obteniendo estado actual del objeto...
echo ════════════════════════════════════════════════════════════════════════════
echo.

curl -X GET "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/02_object_before.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 2 EXITOSO - Objeto obtenido
    echo 📄 Estado actual guardado en: anytype_debug_logs/02_object_before.json
) else (
    echo ❌ Test 2 FALLÓ - No se pudo obtener el objeto
    pause
    exit /b 1
)

echo.
pause

:: =============================================================================
:: TEST 3: Actualizar SOLO el nombre
:: =============================================================================
echo.
echo 🧪 TEST 3: Actualizando SOLO el nombre del objeto...
echo ════════════════════════════════════════════════════════════════════════════
echo.

set "NAME_TEST=Debug Test Name - %TIMESTAMP%"

echo Enviando payload:
echo {
echo   "name": "%NAME_TEST%"
echo }
echo.

curl -X PATCH "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"%NAME_TEST%\"}" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/03_update_name.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 3 EXITOSO - Nombre actualizado
    echo 📄 Respuesta guardada en: anytype_debug_logs/03_update_name.json
) else (
    echo ❌ Test 3 FALLÓ - No se pudo actualizar el nombre
)

echo.
pause

:: =============================================================================
:: TEST 4: Actualizar SOLO el markdown (Prueba 1)
:: =============================================================================
echo.
echo 🧪 TEST 4: Actualizando SOLO el markdown (Método 1)...
echo ════════════════════════════════════════════════════════════════════════════
echo.

echo Enviando payload markdown (Método 1):
echo {
echo   "markdown": "# Debug Test Markdown - %TIMESTAMP%\n\nEste contenido viene del script .bat\n\n**Timestamp:** %TIMESTAMP%\n\n🚀 Si ves esto, ¡el markdown funciona!"
echo }
echo.

curl -X PATCH "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -d "{\"markdown\": \"# Debug Test Markdown - %TIMESTAMP%\\n\\nEste contenido viene del script .bat\\n\\n**Timestamp:** %TIMESTAMP%\\n\\n🚀 Si ves esto, ¡el markdown funciona!\"}" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/04_update_markdown_v1.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 4 EXITOSO - Request enviado
    echo 📄 Respuesta guardada en: anytype_debug_logs/04_update_markdown_v1.json
) else (
    echo ❌ Test 4 FALLÓ - Error en el request
)

echo.
pause

:: =============================================================================
:: TEST 5: Verificar si el markdown cambió
:: =============================================================================
echo.
echo 🧪 TEST 5: Verificando si el markdown realmente cambió...
echo ════════════════════════════════════════════════════════════════════════════
echo.

curl -X GET "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/05_object_after_markdown.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 5 EXITOSO - Estado post-actualización obtenido
    echo 📄 Estado guardado en: anytype_debug_logs/05_object_after_markdown.json
    echo.
    echo 💡 COMPARA LOS ARCHIVOS:
    echo    - ANTES:  anytype_debug_logs/02_object_before.json
    echo    - DESPUÉS: anytype_debug_logs/05_object_after_markdown.json
    echo.
    echo    Busca diferencias en los campos "markdown" y "snippet"
) else (
    echo ❌ Test 5 FALLÓ - No se pudo verificar el estado
)

echo.
pause

:: =============================================================================
:: TEST 6: Probar con "body" en lugar de "markdown"
:: =============================================================================
echo.
echo 🧪 TEST 6: Probando con campo "body" en lugar de "markdown"...
echo ════════════════════════════════════════════════════════════════════════════
echo.

echo Enviando payload con "body":
echo {
echo   "body": "# Debug Test Body - %TIMESTAMP%\n\nUsando campo BODY en lugar de markdown\n\n**Timestamp:** %TIMESTAMP%"
echo }
echo.

curl -X PATCH "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -d "{\"body\": \"# Debug Test Body - %TIMESTAMP%\\n\\nUsando campo BODY en lugar de markdown\\n\\n**Timestamp:** %TIMESTAMP%\"}" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/06_update_body.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 6 EXITOSO - Request con "body" enviado
    echo 📄 Respuesta guardada en: anytype_debug_logs/06_update_body.json
) else (
    echo ❌ Test 6 FALLÓ - Error con campo "body"
)

echo.
pause

:: =============================================================================
:: TEST 7: Probar con "content" 
:: =============================================================================
echo.
echo 🧪 TEST 7: Probando con campo "content"...
echo ════════════════════════════════════════════════════════════════════════════
echo.

echo Enviando payload con "content":
echo {
echo   "content": "# Debug Test Content - %TIMESTAMP%\n\nUsando campo CONTENT\n\n**Timestamp:** %TIMESTAMP%"
echo }
echo.

curl -X PATCH "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -d "{\"content\": \"# Debug Test Content - %TIMESTAMP%\\n\\nUsando campo CONTENT\\n\\n**Timestamp:** %TIMESTAMP%\"}" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/07_update_content.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 7 EXITOSO - Request con "content" enviado
    echo 📄 Respuesta guardada en: anytype_debug_logs/07_update_content.json
) else (
    echo ❌ Test 7 FALLÓ - Error con campo "content"
)

echo.
pause

:: =============================================================================
:: TEST 8: Estado final y comparación
:: =============================================================================
echo.
echo 🧪 TEST 8: Obteniendo estado final para comparación...
echo ════════════════════════════════════════════════════════════════════════════
echo.

curl -X GET "%API_BASE%/v1/spaces/%SPACE_ID%/objects/%OBJECT_ID%" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -H "Anytype-Version: %API_VERSION%" ^
  -H "Content-Type: application/json" ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n" ^
  -o "anytype_debug_logs/08_object_final.json" ^
  -s

if %errorlevel% == 0 (
    echo ✅ Test 8 EXITOSO - Estado final obtenido
    echo 📄 Estado final guardado en: anytype_debug_logs/08_object_final.json
) else (
    echo ❌ Test 8 FALLÓ - No se pudo obtener estado final
)

echo.

:: =============================================================================
:: RESUMEN Y ANÁLISIS
:: =============================================================================
echo ████████████████████████████████████████████████████████
echo 📊 RESUMEN DE PRUEBAS COMPLETADO
echo ████████████████████████████████████████████████████████
echo.
echo 📁 Archivos generados en: anytype_debug_logs/
echo    01_spaces.json - Lista de espacios
echo    02_object_before.json - Estado inicial del objeto  
echo    03_update_name.json - Respuesta actualización nombre
echo    04_update_markdown_v1.json - Respuesta actualización markdown
echo    05_object_after_markdown.json - Estado después de markdown
echo    06_update_body.json - Respuesta con campo "body"
echo    07_update_content.json - Respuesta con campo "content"  
echo    08_object_final.json - Estado final del objeto
echo.
echo 🔍 ANÁLISIS RECOMENDADO:
echo    1. Compara los archivos JSON para ver qué cambió
echo    2. Busca diferencias en los campos "markdown", "snippet", "body"
echo    3. Verifica los status codes de cada request
echo    4. Revisa si algún campo de contenido se actualizó
echo.
echo 💡 PRÓXIMOS PASOS:
echo    1. Abre los archivos JSON en un editor
echo    2. Verifica en Anytype si el contenido cambió visualmente
echo    3. Si el contenido SÍ cambió en Anytype pero no en la API response,
echo       entonces hay un cache/delay en la API
echo    4. Si NO cambió nada, hay un problema con los campos o permisos
echo.

echo ¿Quieres abrir la carpeta de logs? (s/n)
set /p open_logs=
if /i "%open_logs%"=="s" start "" "anytype_debug_logs"

echo.
echo 🎯 Script completado. Revisa los logs y comparte los resultados.
echo.
pause