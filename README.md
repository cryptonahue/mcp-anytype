# Anytype MCP Server Personalizado

Un servidor MCP (Model Context Protocol) personalizado para interactuar con la API de Anytype, con funcionalidades extendidas y una estructura modular mejorada.

## Características

- ✅ **Operaciones básicas**: Crear, leer, actualizar y eliminar objetos
- ✅ **Gestión de espacios**: Listar y buscar en espacios
- ✅ **Operaciones de colecciones**: Agregar y remover objetos de colecciones usando endpoints oficiales
- ✅ **Búsqueda avanzada**: Buscar objetos por tipo, contenido y más
- ✅ **Estructura modular**: Código organizado en módulos separados
- ✅ **TypeScript**: Tipado fuerte para mejor desarrollo

## Estructura del Proyecto

```
src/
├── api/
│   └── client.ts          # Cliente API para comunicación con Anytype
├── services/
│   └── mcp-service.ts     # Lógica de negocio del servidor MCP
├── types/
│   └── index.ts           # Definiciones de tipos TypeScript
└── index.ts               # Punto de entrada principal
```

### Módulos

#### `api/client.ts`
Contiene la clase `AnytypeApiClient` que maneja todas las comunicaciones HTTP con la API de Anytype:
- Configuración de headers y autenticación
- Métodos para todas las operaciones CRUD
- Manejo de errores centralizado
- Soporte para endpoints de listas/colecciones

#### `services/mcp-service.ts`
Contiene la clase `McpAnytypeService` que implementa la lógica específica del servidor MCP:
- Formateo de respuestas para el protocolo MCP
- Manejo de errores específicos del MCP
- Validación de parámetros
- Transformación de datos

#### `types/index.ts`
Definiciones de tipos TypeScript para:
- Entidades de Anytype (espacios, objetos, propiedades)
- Requests de API
- Interfaces de operaciones

## Configuración

### Variables de Entorno

```bash
ANYTYPE_API_KEY=tu-api-key-aqui
ANYTYPE_BASE_URL=http://localhost:31009  # Opcional, por defecto localhost
```

### Instalación

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## Herramientas Disponibles

### Gestión de Espacios
- `anytype_list_spaces`: Lista todos los espacios disponibles

### Operaciones de Objetos
- `anytype_search_objects`: Busca objetos con filtros avanzados
- `anytype_get_object`: Obtiene un objeto específico
- `anytype_create_object`: Crea un nuevo objeto
- `anytype_update_object`: Actualiza un objeto existente
- `anytype_delete_object`: Elimina (archiva) un objeto
- `anytype_list_objects`: Lista objetos en un espacio
- `anytype_list_types`: Lista tipos de objetos disponibles

### Operaciones de Colecciones
- `anytype_add_to_collection`: Agrega un objeto a una colección
- `anytype_remove_from_collection`: Remueve un objeto de una colección

## Endpoints de API Utilizados

Este servidor utiliza los endpoints oficiales de Anytype API v2025-05-20:

- `POST /v1/spaces/{space_id}/lists/{list_id}/objects` - Agregar a colección
- `DELETE /v1/spaces/{space_id}/lists/{list_id}/objects/{object_id}` - Remover de colección
- `GET /v1/spaces/{space_id}/lists/{list_id}/views` - Obtener vistas de lista
- `GET /v1/spaces/{space_id}/lists/{list_id}/views/{view_id}/objects` - Obtener objetos de vista

## Mejoras Implementadas

### Estructura Modular
- **Separación de responsabilidades**: API client, servicios MCP y tipos separados
- **Mantenibilidad**: Código más fácil de mantener y extender
- **Reutilización**: Componentes reutilizables
- **Testing**: Estructura que facilita las pruebas unitarias

### Endpoints Oficiales
- **Colecciones**: Uso de endpoints oficiales para operaciones de lista
- **Compatibilidad**: Alineado con la API oficial de Anytype
- **Estabilidad**: Menos propenso a cambios en la API

## Desarrollo

### Scripts Disponibles

```bash
npm run build    # Compilar TypeScript
npm start        # Iniciar servidor
npm run dev      # Modo desarrollo (si está configurado)
```

### Agregar Nuevas Funcionalidades

1. **Nuevos endpoints**: Agregar métodos en `AnytypeApiClient`
2. **Nuevas herramientas MCP**: Agregar métodos en `McpAnytypeService`
3. **Nuevos tipos**: Definir interfaces en `types/index.ts`
4. **Registrar herramienta**: Actualizar `index.ts` con la nueva herramienta

## Licencia

MIT