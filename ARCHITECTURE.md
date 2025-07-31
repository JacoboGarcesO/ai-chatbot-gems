# Arquitectura de la Plataforma de Chatbot

## 🏗️ Slicing Architecture

La aplicación ha sido refactorizada siguiendo los principios de **Slicing Architecture** para mejorar la modularidad, reutilización y mantenibilidad del código.

### 📁 Estructura de Carpetas

```
src/
├── components/           # Componentes UI reutilizables
│   ├── ui/              # Componentes base (Button, Input, Card, etc.)
│   └── Layout.tsx       # Layout principal
├── features/            # Slices de funcionalidad
│   ├── conversations/   # Slice de conversaciones
│   │   └── components/  # Componentes específicos de conversaciones
│   └── chat/           # Slice de chat
│       └── components/  # Componentes específicos de chat
├── hooks/              # Custom hooks
├── services/           # Servicios de API
├── types/              # Definiciones de TypeScript
├── utils/              # Utilidades
└── pages/              # Páginas principales
```

## 🧩 Componentes UI Reutilizables

### Componentes Base
- **Button**: Botón con múltiples variantes (primary, secondary, outline, ghost, danger)
- **Input**: Campo de entrada con soporte para iconos y validación
- **Card**: Contenedor con header, body y footer
- **Badge**: Etiquetas para estados y categorías
- **Modal**: Ventana modal con backdrop
- **LoadingSpinner**: Indicador de carga

### Características
- ✅ **TypeScript**: Tipado completo
- ✅ **Variantes**: Múltiples estilos y tamaños
- ✅ **Accesibilidad**: ARIA labels y navegación por teclado
- ✅ **Responsive**: Diseño adaptativo
- ✅ **Consistencia**: Sistema de diseño unificado

## 🎣 Custom Hooks

### useConversations
```typescript
const { conversations, loading, error, toggleIA, sendMessage } = useConversations({
  filters: { estado: 'abierta' }
});
```

### useMessages
```typescript
const { messages, loading, sendMessage, addMessage } = useMessages(conversationId);
```

### useKnowledgeBase
```typescript
const { entries, createEntry, updateEntry, deleteEntry, searchEntries } = useKnowledgeBase();
```

### useReports
```typescript
const { report, loading, dateRange, updateDateRange, exportReport } = useReports();
```

## 🔧 Slices de Funcionalidad

### Conversations Slice
**Ubicación**: `src/features/conversations/`

**Componentes**:
- `ConversationItem`: Item individual de conversación
- `ConversationFilters`: Filtros de búsqueda y estado
- `ConversationsList`: Lista completa de conversaciones

**Responsabilidades**:
- Gestión de lista de conversaciones
- Filtrado y búsqueda
- Selección de conversación activa

### Chat Slice
**Ubicación**: `src/features/chat/`

**Componentes**:
- `ChatHeader`: Header con información del cliente y controles IA
- `MessageBubble`: Burbuja de mensaje individual
- `MessageInput`: Input para enviar mensajes
- `Chat`: Componente principal del chat

**Responsabilidades**:
- Visualización de mensajes
- Envío de mensajes
- Control de IA ON/OFF
- Scroll automático

## 🎨 Sistema de Diseño

### Colores
```css
/* Primarios */
--blue-600: #2563eb
--blue-700: #1d4ed8

/* Estados */
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--info: #3b82f6
```

### Espaciado
```css
/* Base */
--spacing-1: 0.25rem
--spacing-2: 0.5rem
--spacing-4: 1rem
--spacing-6: 1.5rem
```

### Tipografía
```css
/* Fuente principal */
font-family: 'Inter', system-ui, sans-serif
```

## 🔄 Flujo de Datos

### 1. Conversaciones
```
useConversations → ConversationsList → ConversationItem
     ↓
API Service → Mock Data
```

### 2. Chat
```
useMessages → Chat → MessageBubble
     ↓
useConversations → ChatHeader → IA Toggle
```

### 3. Base de Conocimiento
```
useKnowledgeBase → KnowledgeBase → CRUD Operations
     ↓
API Service → Mock Data
```

## 📦 Beneficios de la Arquitectura

### ✅ Modularidad
- Cada slice es independiente
- Fácil agregar nuevas funcionalidades
- Separación clara de responsabilidades

### ✅ Reutilización
- Componentes UI compartidos
- Custom hooks reutilizables
- Lógica de negocio centralizada

### ✅ Mantenibilidad
- Código organizado y predecible
- Fácil debugging
- Testing simplificado

### ✅ Escalabilidad
- Arquitectura preparada para crecimiento
- Fácil integración de nuevas features
- Performance optimizada

## 🚀 Patrones Utilizados

### 1. **Container/Presentational Pattern**
```typescript
// Container (lógica)
const ConversationsList = () => {
  const { conversations } = useConversations();
  return <ConversationItem conversation={conversation} />;
};

// Presentational (UI)
const ConversationItem = ({ conversation }) => {
  return <div>{conversation.name}</div>;
};
```

### 2. **Custom Hooks Pattern**
```typescript
// Lógica reutilizable
const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  // ... lógica
  return { conversations, loading, error };
};
```

### 3. **Compound Components Pattern**
```typescript
// Componente compuesto
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

## 🔮 Próximos Pasos

### Mejoras Planificadas
- [ ] **State Management**: Implementar Zustand o Redux Toolkit
- [ ] **Testing**: Agregar Jest y React Testing Library
- [ ] **Storybook**: Documentación de componentes
- [ ] **Error Boundaries**: Manejo de errores global
- [ ] **Performance**: React.memo y useMemo optimizations
- [ ] **Accessibility**: Mejorar a11y con ARIA
- [ ] **Internationalization**: Soporte multiidioma
- [ ] **Theme System**: Tema oscuro/claro

### Nuevos Slices
- [ ] **Authentication**: Login/logout
- [ ] **Settings**: Configuración de usuario
- [ ] **Analytics**: Métricas avanzadas
- [ ] **Notifications**: Sistema de notificaciones

---

Esta arquitectura proporciona una base sólida y escalable para el crecimiento futuro de la plataforma de chatbot. 