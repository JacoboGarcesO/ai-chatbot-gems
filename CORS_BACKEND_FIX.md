# 🔧 Configuración CORS Requerida para el Backend

## ❌ **Problema Actual**
El frontend está recibiendo errores de CORS al intentar conectarse a la API desde `http://localhost:5174`. La API en `https://twilio-9ubt.onrender.com` necesita configuración CORS adecuada.

## 🎯 **Solución Requerida**

### 1. **Headers CORS Obligatorios**

El servidor debe enviar estos headers en **TODAS** las respuestas:

```javascript
// Headers que DEBE enviar el servidor
res.setHeader('Access-Control-Allow-Origin', '*'); // O específicamente: 'http://localhost:5174'
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

### 2. **Dominios Permitidos**

Configurar estos orígenes como permitidos:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
  'https://your-production-domain.com' // Cambiar por dominio real
];
```

### 3. **Manejo de Requests OPTIONS (Preflight)**

```javascript
// Middleware para manejar preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  next();
});
```

## 🚀 **Ejemplos de Implementación**

### **Express.js + CORS middleware**

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://your-production-domain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
```

### **Express.js Manual**

```javascript
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});
```

### **FastAPI (Python)**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://your-production-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Node.js Vanilla**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Tu lógica aquí...
});
```

## 🧪 **Cómo Verificar que Funciona**

### **1. Test con curl:**

```bash
curl -H "Origin: http://localhost:5174" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://twilio-9ubt.onrender.com/api/conversations
```

**Respuesta esperada:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### **2. Test con JavaScript (en la consola del navegador):**

```javascript
fetch('https://twilio-9ubt.onrender.com/api/conversations')
  .then(response => response.json())
  .then(data => console.log('✅ CORS funcionando:', data))
  .catch(error => console.error('❌ Error CORS:', error));
```

### **3. Verificar headers en Network tab:**

Abrir DevTools → Network → Ver los headers de respuesta deben incluir:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

## 🎯 **Endpoints que Necesitan CORS**

Asegurarse de que TODOS estos endpoints tengan CORS habilitado:

- ✅ `GET /api/health`
- ✅ `GET /api/conversations`
- ✅ `GET /api/conversations/:phone`
- ✅ `POST /api/send-message`
- ✅ `POST /api/send-ai-message`
- ✅ `POST /api/ask-ai`
- ✅ `GET /api/auto-response/status`
- ✅ `POST /api/auto-response/toggle`
- ✅ `GET /api/stats`

## 🚨 **URGENTE: Configuración Mínima**

Si necesitan una solución rápida, pueden agregar esto al inicio de su aplicación:

```javascript
// SOLUCIÓN RÁPIDA - Agregar al inicio del servidor
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## 📋 **Checklist para Backend**

- [ ] Instalar middleware CORS (si usan Express: `npm install cors`)
- [ ] Configurar orígenes permitidos incluyendo `http://localhost:5174`
- [ ] Manejar requests OPTIONS (preflight)
- [ ] Verificar que todos los endpoints envían headers CORS
- [ ] Probar con curl o desde el navegador
- [ ] Verificar en producción con dominio real

## 🆘 **Si Siguen Teniendo Problemas**

1. **Enviar los logs del servidor** cuando se hace una request desde el frontend
2. **Verificar si el middleware CORS está antes de las rutas**
3. **Comprobar que no hay otro middleware bloqueando CORS**
4. **Revisar si usan algún proxy o load balancer que necesite configuración CORS**

## 📞 **Contacto**

Una vez implementen la configuración CORS, pueden probar con:
- `http://localhost:5174/test-api.html` (página de test automático)
- `http://localhost:5174/debug` (página de diagnóstico completo)

¡Gracias por solucionar esto desde el backend! 🙏
