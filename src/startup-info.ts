import { makeRequest } from './utils.js';
import fs from 'fs';
import path from 'path';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

function getPackageInfo(): PackageInfo {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    return {
      name: packageJson.name || 'unknown',
      version: packageJson.version || '0.0.0',
      description: packageJson.description || 'No description'
    };
  } catch (error) {
    return {
      name: 'my-mcp-anytype',
      version: '1.0.0',
      description: 'Custom MCP server for Anytype'
    };
  }
}

function getAnytypePort(): string {
  return process.env.ANYTYPE_API_URL?.replace('http://localhost:', '') || '31009';
}

function getMCPPort(): string {
  // El MCP server usa stdio, no un puerto HTTP específico
  return 'stdio (standard input/output)';
}

async function testAnytypeConnection(): Promise<{ success: boolean; message: string; spacesCount?: number }> {
  try {
    const response = await makeRequest('/v1/spaces');
    
    // La respuesta puede ser un objeto con una propiedad que contiene el array
    let spaces = response;
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      // Buscar el array de espacios en las propiedades del objeto
      const possibleArrays = Object.values(response).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        spaces = possibleArrays[0];
      }
    }
    
    if (Array.isArray(spaces)) {
      return {
        success: true,
        message: 'Conexión exitosa',
        spacesCount: spaces.length
      };
    } else if (response) {
      return {
        success: true,
        message: 'Conexión exitosa (formato de respuesta no estándar)',
        spacesCount: undefined
      };
    } else {
      return {
        success: false,
        message: 'Respuesta vacía de la API'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

function formatDateTime(): string {
  return new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export async function displayStartupInfo(): Promise<void> {
  const packageInfo = getPackageInfo();
  const anytypePort = getAnytypePort();
  const mcpPort = getMCPPort();
  const apiKeyStatus = process.env.ANYTYPE_API_KEY ? '✅ Presente' : '❌ Faltante';
  
  console.log('\n' + '='.repeat(60));
  console.log('🚀 ANYTYPE MCP SERVER - INFORMACIÓN DE INICIO');
  console.log('='.repeat(60));
  
  console.log(`📦 Nombre: ${packageInfo.name}`);
  console.log(`🏷️  Versión: ${packageInfo.version}`);
  console.log(`📝 Descripción: ${packageInfo.description}`);
  console.log(`⏰ Iniciado: ${formatDateTime()}`);
  
  console.log('\n' + '-'.repeat(40));
  console.log('🔌 CONFIGURACIÓN DE PUERTOS');
  console.log('-'.repeat(40));
  console.log(`🖥️  MCP Server: ${mcpPort}`);
  console.log(`🔗 Anytype API: localhost:${anytypePort}`);
  console.log(`🔑 API Key: ${apiKeyStatus}`);
  
  console.log('\n' + '-'.repeat(40));
  console.log('🧪 PRUEBA DE CONECTIVIDAD');
  console.log('-'.repeat(40));
  
  const testResult = await testAnytypeConnection();
  
  if (testResult.success) {
    console.log(`✅ Anytype API: ${testResult.message}`);
    if (testResult.spacesCount !== undefined) {
      console.log(`📊 Espacios encontrados: ${testResult.spacesCount}`);
    }
  } else {
    console.log(`❌ Anytype API: ${testResult.message}`);
  }
  
  console.log('\n' + '-'.repeat(40));
  console.log('🛠️  HERRAMIENTAS DISPONIBLES');
  console.log('-'.repeat(40));
  console.log('📁 Espacios: list, get, create, update, members');
  console.log('📄 Objetos: search, list, get, create, update, delete');
  console.log('🏷️  Propiedades: list, get, create, update, delete');
  console.log('🎯 Tipos: list, get, create, update, delete');
  console.log('🏷️  Tags: list, get, create, update, delete');
  console.log('📋 Plantillas: list, get');
  console.log('📝 Listas: get_views, get_objects');
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Servidor MCP listo para recibir conexiones');
  console.log('='.repeat(60) + '\n');
}