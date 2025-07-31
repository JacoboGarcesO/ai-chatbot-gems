# 🔗 Integración con API Real de WhatsApp Business

## 📋 Resumen de Cambios

Se ha reemplazado completamente el sistema de mocks por la integración con la API real de WhatsApp Business. Todos los endpoints relacionados con conversaciones, mensajes y funcionalidades de IA ahora utilizan la API real.

## 🚀 Funcionalidades Implementadas

### ✅ Conversaciones
- **Listar conversaciones**: `GET /api/conversations`
- **Búsqueda de conversaciones**: `GET /api/conversations/search/:query`
- **Historial de conversación**: `GET /api/conversations/:phone`
- **Marcar como leída**: `POST /api/conversations/:phone/read`

### ✅ Mensajes
- **Envío manual**: `POST /api/send-message`
- **Envío con IA**: `POST /api/send-ai-message`
- **Consulta directa a IA**: `POST /api/ask-ai`

### ✅ Estado del Sistema
- **Health check**: `GET /api/health`
- **Estado del bot**: `GET /api/auto-response/status`
- **Activar/Desactivar bot**: `POST /api/auto-response/toggle`
- **Estadísticas**: `GET /api/stats`

## 🏗️ Arquitectura de la Integración

### 📁 Estructura de Archivos

```
src/
├── config/
│   └── api.ts                 # Configuración centralizada de la API
├── services/
│   └── api.ts                 # Servicios de API real (reemplaza mocks)
├── hooks/
│   ├── useConversations.ts    # Hook actualizado para conversaciones
│   └── useBotStatus.ts        # Nuevo hook para estado del bot
├── components/
│   ├── Chat.tsx              # Componente actualizado con IA
│   └── ConversationsList.tsx # Lista con búsqueda real
└── pages/
    └── ConversationsPage.tsx  # Página con estado del bot
```

### 🔧 Configuración

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://twilio-9ubt.onrender.com',
  ENDPOINTS: {
    HEALTH: '/api/health',
    BOT_STATUS: '/api/auto-response/status',
    BOT_TOGGLE: '/api/auto-response/toggle',
    CONVERSATIONS: '/api/conversations',
    SEND_MESSAGE: '/api/send-message',
    SEND_AI_MESSAGE: '/api/send-ai-message',
    ASK_AI: '/api/ask-ai',
    STATS: '/api/stats',
  },
  TIMEOUT: 10000, // 10 seconds
};
```

## 🎯 Nuevas Funcionalidades

### 🤖 Mensajes con IA
- Botón "AI Message" en el chat
- Campo de entrada para describir lo que debe decir la IA
- Envío automático con contexto de clínica médica

### 🔍 Búsqueda en Tiempo Real
- Búsqueda de conversaciones por texto
- Filtrado por estado
- Debounce de 500ms para optimizar requests

### 📊 Panel de Estado
- Estado del bot (Activo/Inactivo)
- Estado de conexión con la API
- Estadísticas en tiempo real
- Botón para activar/desactivar el bot

### ✅ Marcado Automático
- Las conversaciones se marcan como leídas automáticamente
- Indicadores visuales de estado

## 🔄 Transformación de Datos

### Conversaciones
```typescript
// API Response → Frontend Interface
{
  phone: "+1234567890",           // → id, customer_id
  customer_name: "Juan Pérez",    // → customer.name
  message: "Hola",               // → last_message
  timestamp: "2024-01-15T10:30:00Z" // → last_timestamp
}
```

### Mensajes
```typescript
// API Response → Frontend Interface
{
  from: "+1234567890",           // → sender_type (customer/bot)
  body: "Hola",                  // → content
  date: "2024-01-15T10:30:00Z"   // → timestamp
}
```

## 🛡️ Manejo de Errores

### Timeout de Requests
- Timeout configurable de 10 segundos
- Cancelación automática de requests lentos

### Estados de Error
- Indicadores visuales de errores
- Mensajes de error específicos
- Fallbacks para datos faltantes

### Logging
- Logs detallados en consola
- Tracking de errores de API
- Información de debugging

## 🚀 Uso de la API

### Ejemplo de Envío de Mensaje
```typescript
// Mensaje manual
await conversationsAPI.sendHumanMessage("+1234567890", "Hola, ¿cómo estás?");

// Mensaje con IA
await conversationsAPI.sendAIMessage(
  "+1234567890", 
  "Responde profesionalmente sobre disponibilidad de citas",
  "Clínica médica"
);
```

### Ejemplo de Búsqueda
```typescript
// Búsqueda de conversaciones
const results = await conversationsAPI.searchConversations("cita médica");

// Lista con filtros
const conversations = await conversationsAPI.listConversations({
  status: "open",
  customer: "Juan"
});
```

### Ejemplo de Estado del Bot
```typescript
const { botEnabled, toggleBot } = useBotStatus();

// Activar bot
await toggleBot(true);

// Verificar estado
console.log(botEnabled); // true/false
```

## 🔧 Configuración del Entorno

### Variables de Entorno (Opcional)
```env
VITE_API_BASE_URL=https://twilio-9ubt.onrender.com
VITE_API_TIMEOUT=10000
```

### Personalización
- Cambiar URL base en `src/config/api.ts`
- Ajustar timeout según necesidades
- Modificar contexto por defecto para IA

## 📈 Métricas y Monitoreo

### Estadísticas Disponibles
- Total de conversaciones
- Mensajes del día
- Respuestas de IA
- Estado de conexión

### Indicadores Visuales
- Estado del bot (verde/rojo)
- Estado de la API (conectado/desconectado)
- Contadores en tiempo real

## 🔮 Próximas Mejoras

### Funcionalidades Pendientes
- [ ] Paginación de conversaciones
- [ ] Filtros avanzados
- [ ] Exportación de datos
- [ ] Notificaciones en tiempo real
- [ ] Historial de mensajes mejorado

### Optimizaciones
- [ ] Cache de conversaciones
- [ ] Lazy loading de mensajes
- [ ] Compresión de requests
- [ ] Retry automático en fallos

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión**
   - Verificar URL de la API
   - Revisar estado del servidor
   - Comprobar timeout

2. **Mensajes no se envían**
   - Verificar formato del número de teléfono
   - Comprobar estado del bot
   - Revisar logs de error

3. **Búsqueda no funciona**
   - Verificar sintaxis de búsqueda
   - Comprobar endpoint de búsqueda
   - Revisar encoding de caracteres

### Debugging
```typescript
// Habilitar logs detallados
console.log('API Response:', data);
console.log('Error details:', error);
```

## 📞 Soporte

Para problemas con la API:
- Revisar documentación de Postman
- Verificar endpoints en la colección
- Comprobar estado del servidor en `/api/health` 