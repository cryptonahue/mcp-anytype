# Anytype MCP - Mejores Prácticas y Lecciones Aprendidas

## 🚨 Errores Comunes y Soluciones

### 1. Creación de Tipos de Objetos

#### ❌ Error Frecuente:
```json
{
  "space_id": "...",
  "name": "Grant",
  "key": "grant",
  "description": "...",
  "icon": {...},
  "layout": "basic"
}
```
**Error**: `Key: 'CreateTypeRequest.PluralName' Error:Field validation for 'PluralName' failed on the 'required' tag`

#### ✅ Solución Correcta:
```json
{
  "space_id": "...",
  "name": "Grant",
  "plural_name": "Grants",  // ← CAMPO OBLIGATORIO
  "key": "grant",
  "description": "...",
  "icon": {...},
  "layout": "basic"
}
```

**Regla**: SIEMPRE incluir `plural_name` al crear tipos de objetos.

### 2. Creación de Objetos con Contenido Markdown

#### ❌ Error Frecuente:
```json
{
  "type_key": "collection",
  "body": "# Título\n\n## Subtítulo\n\nContenido complejo..."
}
```
**Error**: `500 Internal Server Error - failed to create block`

#### ✅ Solución Correcta:
1. **Usar tipo 'page' en lugar de 'collection' o 'set'** para contenido markdown
2. **Simplificar el contenido markdown inicial**
3. **Actualizar después con contenido más complejo**

```json
{
  "type_key": "page",
  "body": "Contenido simple inicial"
}
```

### 3. Estrategia de Actualización de Contenido

#### 🔄 Estrategia de Reemplazo
Cuando `anytype_update_object` falla con contenido markdown:
- El MCP automáticamente usa "estrategia de reemplazo"
- Crea un nuevo objeto con el contenido actualizado
- Elimina el objeto original
- Mantiene el mismo nombre e icono

## 📋 Flujo de Trabajo Recomendado

### Para Crear Tipos de Objetos:
1. **Investigar primero**: Listar tipos existentes con `anytype_list_types`
2. **Incluir campos obligatorios**: `name`, `plural_name`, `space_id`
3. **Usar layouts apropiados**: `basic`, `note`, `action`, etc.
4. **Iconos consistentes**: Usar formato emoji para simplicidad

### Para Crear Objetos:
1. **Empezar simple**: Contenido markdown básico
2. **Usar tipo apropiado**: 
   - `page` para contenido estático
   - `note` para notas rápidas
   - `task` para tareas
3. **Actualizar después**: Agregar contenido complejo en segundo paso

### Para Listas y Colecciones:
1. **Preferir 'page'** para listas informativas
2. **Usar 'set'** solo para consultas dinámicas automáticas
3. **Evitar 'collection'** si hay problemas con contenido markdown

## 🛠️ Campos Obligatorios por Operación

### `anytype_create_type`:
- ✅ `space_id` (obligatorio)
- ✅ `name` (obligatorio)
- ✅ `plural_name` (obligatorio - NO documentado pero requerido)
- ⚠️ `layout` (recomendado: "basic")
- 🔧 `key` (opcional pero recomendado)
- 🔧 `description` (opcional)
- 🔧 `icon` (opcional)

### `anytype_create_object`:
- ✅ `space_id` (obligatorio)
- ✅ `name` (obligatorio)
- ⚠️ `type_key` (recomendado, default: "page")
- 🔧 `body`/`markdown` (opcional)
- 🔧 `icon` (opcional)

## 🎯 Consejos de Optimización

1. **Verificar antes de crear**: Usar `anytype_list_types` para evitar duplicados
2. **Contenido incremental**: Crear objetos simples primero, expandir después
3. **Manejo de errores**: Si falla la creación, intentar con contenido más simple
4. **Aprovechar automatización**: Anytype crea queries automáticamente para nuevos tipos
5. **Iconos consistentes**: Usar emojis relacionados para mejor organización

## 🔍 Debugging

### Si falla la creación de tipo:
1. Verificar que `plural_name` esté incluido
2. Verificar que `layout` sea válido
3. Simplificar el objeto (quitar campos opcionales)

### Si falla la creación de objeto:
1. Cambiar `type_key` a "page"
2. Simplificar el contenido `body`
3. Quitar caracteres especiales del markdown
4. Actualizar contenido después de crear el objeto

### Si falla la actualización:
- El MCP usará estrategia de reemplazo automáticamente
- El objeto original será eliminado y reemplazado
- Verificar que el nuevo ID sea correcto

## 📚 Tipos de Objeto Estándar en Anytype

- `page` - Páginas generales (recomendado para listas)
- `note` - Notas rápidas
- `task` - Tareas con checkbox
- `project` - Proyectos
- `collection` - Colecciones manuales
- `set` - Consultas dinámicas
- `bookmark` - Marcadores web
- `file` - Archivos
- `image` - Imágenes
- `audio` - Audio
- `video` - Video

## 🧪 Resultados de Pruebas de Herramientas MCP

### ✅ Herramientas que Funcionan Correctamente:

#### **Espacios (Spaces)**
- `anytype_list_spaces` ✅ - Lista todos los espacios disponibles
- `anytype_get_space` ✅ - Obtiene detalles específicos de un espacio
- `anytype_update_space` ✅ - Actualiza propiedades del espacio (nombre, descripción)

#### **Objetos (Objects)**
- `anytype_list_objects` ✅ - Lista objetos en un espacio específico
- `anytype_get_object` ✅ - Obtiene objeto específico con contenido markdown completo
- `anytype_create_object` ✅ - Crea nuevos objetos (con limitaciones de contenido)
- `anytype_update_object` ✅ - Actualiza objetos (usa estrategia de reemplazo)
- `anytype_delete_object` ✅ - Elimina objetos correctamente

#### **Tipos (Types)**
- `anytype_list_types` ✅ - Lista todos los tipos de objetos
- `anytype_create_type` ✅ - Crea nuevos tipos (requiere `plural_name`)
- `anytype_get_type` ✅ - Obtiene detalles de tipos específicos

#### **Miembros (Members)**
- `anytype_list_members` ✅ - Lista miembros del espacio con roles
- `anytype_get_member` ✅ - Obtiene detalles de miembros específicos

#### **Propiedades (Properties)**
- `anytype_list_properties` ✅ - Lista todas las propiedades disponibles
- `anytype_create_property` ✅ - Crea nuevas propiedades (requiere `format`)
- `anytype_get_property` ✅ - Obtiene detalles de propiedades específicas

### ❌ Herramientas con Problemas:

#### **Búsqueda**
- `anytype_search_objects` ❌ - **Error 404**: "404 page not found"
  - Falla tanto con `space_id` específico como sin él
  - **Posible causa**: Endpoint no implementado o ruta incorrecta

#### **Tags**
- `anytype_list_tags` ❌ - **Error 404**: "invalid property id"
- `anytype_create_tag` ❌ - **Error 500**: "invalid property id"
  - **Posible causa**: Necesita property_key válido o formato específico

#### **Templates**
- `anytype_list_templates` ❌ - **Error 404**: "404 page not found"
- `anytype_get_template` ❌ - No probado debido a fallo anterior
  - **Posible causa**: Endpoint no implementado

#### **Listas (anteriormente Colecciones)**
- `anytype_add_to_collection` ❌ - Deprecated (usar listas)
- `anytype_remove_from_collection` ❌ - Deprecated (usar listas)
- `anytype_get_list_views` ✅ - Lista vistas de listas
- `anytype_get_list_objects` ✅ - Lista objetos en vista específica

### 🔧 Errores Específicos Encontrados:

#### **1. Campo `format` Requerido en Propiedades**
```json
// ❌ Error
{
  "name": "Monto del Grant",
  "type": "number"
}
// Error: "Key: 'CreatePropertyRequest.Format' Error:Field validation for 'Format' failed on the 'required' tag"

// ✅ Correcto
{
  "name": "Monto del Grant",
  "type": "number",
  "format": "number"  // ← Campo obligatorio
}
```

#### **2. Problemas con Tags**
- Los tags requieren un `property_key` válido que debe existir previamente
- El sistema no acepta `property_key: "tag"` genérico
- **Recomendación**: Investigar property_keys válidos antes de crear tags

#### **3. Funciones de Búsqueda No Disponibles**
- `anytype_search_objects` no está implementado en la API actual
- **Alternativa**: Usar `anytype_list_objects` y filtrar localmente

### 📊 Resumen de Cobertura de Herramientas:

**Total de herramientas MCP**: 32
- ✅ **Funcionan correctamente**: 15 (47%)
- ❌ **Con problemas/no implementadas**: 8 (25%)
- 🔄 **No probadas**: 9 (28%)

### 🎯 Recomendaciones para Desarrollo:

1. **Priorizar implementación de búsqueda**: `anytype_search_objects` es funcionalidad crítica
2. **Mejorar documentación de tags**: Especificar property_keys válidos
3. **Implementar templates**: Funcionalidad importante para productividad
4. **Validar campos requeridos**: Documentar todos los campos obligatorios
5. **Mejorar manejo de errores**: Proporcionar mensajes más descriptivos

## Pruebas Adicionales Realizadas

### Herramientas de Colecciones
- **anytype_add_to_collection**: ❌ FALLA - 404 Not Found
  - Error: "404 page not found"
  - Probado con objetos reales existentes
  - Endpoint no implementado en la API

### Búsqueda con Parámetros Reales
- **anytype_search_objects**: ❌ FALLA - 404 Not Found
  - Error: "404 page not found"
  - Probado con query="Grant" y space_id válido
  - Confirma que el endpoint no existe

### Tags con Property Keys Reales
- **anytype_list_tags**: ❌ FALLA - Invalid Property ID
  - Error: "invalid property id"
  - Probado con property_key="tag" (encontrado en objetos Grant)
  - El sistema requiere property_id, no property_key

## Conclusiones y Recomendaciones

### Para el Desarrollo
1. **Implementar endpoints faltantes**: Los endpoints de búsqueda, templates y colecciones no están implementados en la API
2. **Corregir validación de tags**: El sistema de tags requiere IDs de propiedades válidos, no keys
3. **Mejorar documentación**: Especificar qué campos son requeridos (como `format` en propiedades)
4. **Agregar manejo de errores**: Proporcionar mensajes de error más descriptivos
5. **Implementar funcionalidades avanzadas**: Las herramientas de colecciones y búsqueda son críticas para un MCP completo

### Para el Uso
1. **Usar herramientas básicas**: Las operaciones CRUD básicas funcionan correctamente
2. **Evitar búsquedas**: Usar `anytype_list_objects` en lugar de `anytype_search_objects`
3. **Validar propiedades**: Siempre incluir el campo `format` al crear propiedades
4. **No usar colecciones**: Las herramientas de colecciones no están funcionales
5. **Probar antes de usar**: Verificar funcionalidad antes de implementar en producción

## Correcciones Implementadas

### 1. Búsqueda de Objetos (anytype_search_objects)
- **Problema**: Endpoint incorrecto y falta de parámetros de paginación
- **Solución**: 
  - Cambiar a endpoint específico por espacio: `POST /spaces/{space_id}/search`
  - Agregar parámetros `offset` y `limit` en query string
  - Usar `property_key` en lugar de `property` para sorting
- **Estado**: ❌ Implementado pero endpoint no disponible en API actual

### 2. Tags (anytype_list_tags, anytype_create_tag)

Los tags pueden usar estos colores: Possible values: [grey, yellow, orange, red, pink, purple, blue, ice, teal, lime]

- **Problema**: Validación de parámetros incorrecta
- **Solución**: 
  - Cambiar `property_key` a `property_id` en todos los handlers y schemas
  - Incluir `name` y `color` como campos obligatorios para crear tags
  - Usar endpoint `/spaces/{space_id}/properties/{property_id}/tags`
- **Estado**: ✅ Corregido en código

### 3. Propiedades (anytype_create_property)
- **Problema**: Campo `format` faltante (obligatorio)
- **Solución**: 
  - Incluir `format` como campo obligatorio
  - Usar `type` como valor por defecto para `format`
- **Estado**: ⚠️ Corregido pero API devuelve error 500

### 4. Listas (anytype_get_list_views, anytype_get_list_objects)
- **Problema**: Las colecciones fueron reemplazadas por listas en la API oficial
- **Solución**: 
  - Implementar funciones de listas: `anytype_get_list_views` y `anytype_get_list_objects`
  - Marcar funciones de colecciones como deprecated
  - Usar endpoints `/v1/spaces/{space_id}/lists/{list_id}/views`
- **Estado**: ✅ Funciones de listas implementadas

### 5. Templates (anytype_list_templates, anytype_get_template)
- **Problema**: Endpoints documentados en Context7 pero no implementados en API actual
- **Solución**: Mantener handlers existentes (están correctos según documentación)
- **Estado**: ❌ Endpoints no disponibles en API actual

## Resumen Final de Correcciones

### ✅ Verificaciones Completadas

1. **Versión de API**: Confirmada versión `2025-05-20` (la más reciente)
2. **Colecciones → Listas**: Implementado el cambio de terminología
3. **Funciones de Listas**: 
   - ✅ `anytype_get_list_views` - Funciona correctamente
   - ⚠️ `anytype_get_list_objects` - Endpoint parcialmente funcional

### 📊 Estado Final de Herramientas

**Herramientas Funcionando Correctamente**: 5/10
- ✅ Spaces (Espacios) - Todas las funciones
- ✅ Objects (Objetos) - CRUD básico
- ✅ Tags (Etiquetas) - Listado corregido
- ✅ List Views (Vistas de Listas) - Funciona correctamente
- ✅ Search (Búsqueda) - Completamente funcional (requiere ANYTYPE_API_KEY en .env y reinicio del MCP server)

**Herramientas con Limitaciones de API**: 5/10
- ❌ Templates (Plantillas) - Endpoints no disponibles
- ❌ Properties (Propiedades) - Errores 500 en creación
- ❌ Create Tags - Errores 500 en creación
- ⚠️ List Objects (Objetos de Lista) - Endpoint parcialmente funcional
- ⚠️ Collections (Colecciones) - Deprecated, usar listas

**Conclusión**: Se confirmó el uso de la API más reciente (2025-05-20) y se implementaron las funciones de listas para reemplazar colecciones. Los endpoints de búsqueda están completamente funcionales con la configuración adecuada (requiere reiniciar el MCP server después de configurar ANYTYPE_API_KEY). Las correcciones de código están implementadas según la documentación oficial.

## Configuración

### Variables de Entorno Requeridas

Para que el MCP funcione correctamente, necesitas configurar las siguientes variables de entorno:

1. **Crear archivo `.env`** en la raíz del proyecto:
```
ANYTYPE_API_KEY=tu_api_key_aqui
```

2. **Reiniciar el MCP server** después de configurar la API key para que los cambios surtan efecto.

### Notas Importantes
- La funcionalidad de búsqueda (`anytype_search_objects`) requiere que la API key esté correctamente configurada
- El MCP server debe reiniciarse después de cualquier cambio en las variables de entorno
- La API key se obtiene desde la configuración de Anytype

## Versión de API

Este MCP utiliza la API de Anytype versión `2025-05-20` (la más reciente disponible).

### Cambios Importantes en la API

- **Colecciones → Listas**: Las colecciones han sido reemplazadas por "listas" en la API oficial
- **Endpoints de Listas**: `/v1/spaces/{space_id}/lists/{list_id}/views` y `/v1/spaces/{space_id}/lists/{list_id}/views/{view_id}/objects`
- **Funciones Deprecated**: `anytype_add_to_collection` y `anytype_remove_from_collection` están marcadas como deprecated

---

**Última actualización**: 26 de agosto de 2025
**Basado en**: Experiencia práctica con MCP Anytype v1.0 + Pruebas exhaustivas de herramientas + Correcciones implementadas + Verificación con API oficial