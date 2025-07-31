# Plataforma de Chatbot con IA - GEMS Innovations

Una plataforma moderna para gestionar conversaciones de WhatsApp con asistencia de IA, desarrollada con React, TypeScript y Tailwind CSS.

## 🎨 Brand Colors & Dark Mode

La aplicación utiliza los colores oficiales de **GEMS Innovations**:

- **Primary**: `#0C7F9D` - Azul principal
- **Secondary**: `#2089A2` - Azul secundario  
- **Accent**: `#E22977` - Rosa/Magenta de acento

### 🌙 Modo Oscuro
- Implementado con `darkMode: 'class'` en Tailwind
- Toggle automático con persistencia en localStorage
- Todos los componentes adaptados para modo claro y oscuro

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

#### 🔄 Gestión de Conversaciones
- **Lista de conversaciones** con filtros por estado
- **Búsqueda** por cliente o contenido de mensaje
- **Estados visuales** (Abierta, Cerrada, Pendiente)
- **Indicadores de IA** (ON/OFF)

#### 💬 Chat Inteligente
- **Historial completo** de mensajes
- **Toggle IA ON/OFF** por conversación
- **Mensajes diferenciados** (Bot, Agente, Cliente)
- **Scroll automático** a nuevos mensajes
- **Clasificación y resumen** automático de conversaciones

#### 🧠 Base de Conocimiento
- **CRUD completo** de entradas
- **Búsqueda y filtrado**
- **Tags y categorización**
- **Estado activo/inactivo**

#### 📊 Reportes y Analytics
- **Métricas clave** (conversaciones, ventas, tiempo respuesta)
- **Filtros por fecha**
- **Exportación CSV**
- **Gráficos de clasificación**

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router DOM** - Navegación
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

### Arquitectura
- **Slicing Architecture** - Organización por features
- **Custom Hooks** - Lógica reutilizable
- **Componentes UI** - Sistema de diseño unificado
- **Mock API** - Servicios simulados

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes UI reutilizables
│   ├── ui/              # Componentes base (Button, Input, Card, etc.)
│   └── Layout.tsx       # Layout principal con sidebar
├── features/            # Slices de funcionalidad
│   ├── conversations/   # Gestión de conversaciones
│   └── chat/           # Interfaz de chat
├── hooks/              # Custom hooks
├── services/           # Servicios de API (mock)
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades
└── pages/              # Páginas principales
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd sales-assistant

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🎯 Funcionalidades del Chatbot

### 1. **Gestión de Conversaciones**
- Visualización de todas las conversaciones activas/pasadas
- Filtrado por estado (abierta, cerrada, pendiente)
- Búsqueda por nombre de cliente o contenido
- Indicadores visuales de estado y actividad de IA

### 2. **Interacción Inteligente**
- **IA Automática**: El bot responde automáticamente usando la base de conocimiento
- **Control Manual**: Toggle IA ON/OFF para intervención humana
- **Historial Completo**: Todos los mensajes quedan registrados
- **Clasificación Automática**: Al finalizar, la IA clasifica y resume la conversación

### 3. **Base de Conocimiento**
- Gestión completa de preguntas y respuestas
- Tags para categorización
- Estado activo/inactivo por entrada
- Búsqueda y filtrado avanzado

### 4. **Analytics y Reportes**
- Métricas de rendimiento del bot
- Clasificación de conversaciones
- Tiempos de respuesta
- Exportación de datos

## 🔧 Configuración de API

### Servicios Mock Implementados

#### Conversaciones
```typescript
// Listar conversaciones
conversacionesAPI.listarConversaciones(filtros?)

// Obtener historial de mensajes
conversacionesAPI.obtenerHistorialMensajes(conversacionId)

// Toggle IA ON/OFF
conversacionesAPI.toggleIA(conversacionId, estado)

// Enviar mensaje humano
conversacionesAPI.enviarMensajeHumano(conversacionId, contenido)
```

#### Base de Conocimiento
```typescript
// CRUD completo
baseConocimientoAPI.listarBaseConocimiento()
baseConocimientoAPI.crearEntrada(datos)
baseConocimientoAPI.actualizarEntrada(id, datos)
baseConocimientoAPI.eliminarEntrada(id)
```

#### Reportes
```typescript
// Obtener reporte por fecha
reportesAPI.obtenerReporte(fechaInicio, fechaFin)
```

## 🎨 Sistema de Diseño

### Componentes UI
- **Button**: Múltiples variantes (primary, secondary, outline, ghost, danger, accent)
- **Input**: Con soporte para iconos y validación
- **Card**: Contenedor con header, body y footer
- **Badge**: Etiquetas para estados y categorías
- **Modal**: Ventana modal con backdrop
- **LoadingSpinner**: Indicador de carga
- **Logo**: Logo de GEMS Innovations

### Colores de Marca
```css
--brand-primary: #0C7F9D    /* Azul principal */
--brand-secondary: #2089A2  /* Azul secundario */
--brand-accent: #E22977     /* Rosa/Magenta */
```

### Modo Oscuro
- Implementado con Tailwind CSS `darkMode: 'class'`
- Toggle automático con persistencia
- Todos los componentes adaptados

## 📱 Diseño Responsivo

- **Mobile First**: Diseño optimizado para móviles
- **Sidebar colapsible**: En dispositivos móviles
- **Grid adaptativo**: Layout que se ajusta al tamaño de pantalla
- **Touch friendly**: Interacciones optimizadas para touch

## 🔮 Próximas Funcionalidades

### Mejoras Planificadas
- [ ] **Autenticación**: Sistema de login/logout
- [ ] **Notificaciones**: Alertas en tiempo real
- [ ] **Archivos**: Soporte para imágenes y documentos
- [ ] **Integración WhatsApp**: Conexión real con WhatsApp Business API
- [ ] **Analytics Avanzados**: Métricas más detalladas
- [ ] **Multiidioma**: Soporte para múltiples idiomas

### Mejoras Técnicas
- [ ] **Testing**: Jest y React Testing Library
- [ ] **Storybook**: Documentación de componentes
- [ ] **PWA**: Progressive Web App
- [ ] **Performance**: Optimizaciones de rendimiento
- [ ] **Accessibility**: Mejoras de accesibilidad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado por **GEMS Innovations** - Soluciones tecnológicas innovadoras.

---

**GEMS INNOVATIONS** - Transformando la comunicación empresarial con IA 🤖✨
