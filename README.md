# Plataforma de Chatbot con IA

Una plataforma web moderna para gestionar conversaciones de WhatsApp con asistencia de IA, construida con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

### Gestión de Conversaciones
- **Lista de Conversaciones**: Vista completa de todas las conversaciones de WhatsApp activas y pasadas
- **Filtros y Búsqueda**: Filtrado por estado y búsqueda por cliente o mensaje
- **Chat en Tiempo Real**: Interfaz de chat completa con historial de mensajes
- **Toggle IA ON/OFF**: Control manual para activar/desactivar respuestas automáticas del bot

### Base de Conocimiento
- **CRUD Completo**: Crear, leer, actualizar y eliminar entradas de conocimiento
- **Etiquetas**: Sistema de etiquetas para organizar respuestas
- **Búsqueda Avanzada**: Búsqueda por pregunta, respuesta o etiquetas
- **Estado Activo/Inactivo**: Control de qué respuestas están disponibles para el bot

### Reportes y Analytics
- **Métricas Clave**: Total de conversaciones, ventas cerradas, tiempo de respuesta
- **Clasificación IA**: Análisis automático de conversaciones (Venta Cerrada, Cliente Interesado, etc.)
- **Gráficos Visuales**: Visualización de datos con barras de progreso
- **Exportación**: Descarga de reportes en formato CSV
- **Filtros por Fecha**: Análisis de períodos específicos

### Interfaz Moderna
- **Diseño Responsivo**: Funciona en desktop, tablet y móvil
- **Navegación Intuitiva**: Sidebar con navegación clara
- **Componentes Reutilizables**: Arquitectura modular y escalable
- **Iconografía**: Iconos de Lucide React para mejor UX

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Hooks

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con navegación
│   ├── ConversationsList.tsx  # Lista de conversaciones
│   ├── Chat.tsx        # Componente de chat individual
│   ├── KnowledgeBase.tsx      # Gestión de base de conocimiento
│   └── Reports.tsx     # Reportes y analytics
├── pages/              # Páginas principales
│   ├── ConversationsPage.tsx
│   ├── KnowledgeBasePage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── services/           # Servicios de API
│   └── api.ts         # Mock API services
├── types/              # Definiciones de TypeScript
│   └── index.ts       # Interfaces y tipos
├── App.tsx            # Componente principal
└── main.tsx           # Punto de entrada
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd sales-assistant
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Ejecutar ESLint

## 📊 Funcionalidades Implementadas

### 1. Gestión de Conversaciones
- ✅ Lista de conversaciones con filtros
- ✅ Vista de chat individual
- ✅ Toggle IA ON/OFF
- ✅ Envío de mensajes manuales
- ✅ Historial completo de mensajes
- ✅ Clasificación y resumen de IA

### 2. Base de Conocimiento
- ✅ CRUD completo de entradas
- ✅ Sistema de etiquetas
- ✅ Búsqueda y filtrado
- ✅ Estados activo/inactivo
- ✅ Modal de edición

### 3. Reportes y Analytics
- ✅ Métricas clave
- ✅ Gráficos de clasificación
- ✅ Filtros por fecha
- ✅ Exportación CSV
- ✅ Análisis de rendimiento

### 4. Interfaz de Usuario
- ✅ Diseño responsivo
- ✅ Navegación lateral
- ✅ Componentes modernos
- ✅ Estados de carga
- ✅ Mensajes de error

## 🔧 Configuración de API

Actualmente el proyecto utiliza servicios mock para simular la API. Para integrar con un backend real:

1. Modifica los servicios en `src/services/api.ts`
2. Reemplaza las funciones mock con llamadas HTTP reales
3. Configura las variables de entorno para las URLs de la API

### Estructura de API Esperada

```typescript
// Conversaciones
GET /api/conversaciones
GET /api/conversaciones/:id
GET /api/conversaciones/:id/mensajes
POST /api/conversaciones/:id/mensajes
PUT /api/conversaciones/:id/ia-toggle

// Base de Conocimiento
GET /api/base-conocimiento
POST /api/base-conocimiento
PUT /api/base-conocimiento/:id
DELETE /api/base-conocimiento/:id

// Reportes
GET /api/reportes?fechaInicio=&fechaFin=
```

## 🎨 Personalización

### Colores y Temas
Los colores se pueden personalizar modificando las clases de Tailwind en `src/index.css`:

```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white;
  }
}
```

### Componentes
Todos los componentes están modularizados y pueden ser fácilmente modificados o extendidos.

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsable
- **Mobile**: Navegación móvil optimizada

## 🔮 Próximas Funcionalidades

- [ ] Autenticación de usuarios
- [ ] Integración real con WhatsApp API
- [ ] Notificaciones en tiempo real
- [ ] Chat en vivo entre agentes
- [ ] Análisis de sentimientos
- [ ] Integración con CRM
- [ ] Multiidioma
- [ ] Temas oscuro/claro

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para revolucionar la atención al cliente con IA.
