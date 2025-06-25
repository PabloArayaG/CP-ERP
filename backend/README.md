# 🚀 Backend - Control de Proyectos

API REST para la gestión de proyectos y gastos industriales.

## 📋 Características

- ✅ API REST con Express.js
- ✅ CORS configurado para producción
- ✅ Manejo de errores robusto
- ✅ Health check endpoint
- ✅ Logs detallados
- ✅ Preparado para Render

## 🛠️ Tecnologías

- **Node.js** (>=18.0.0)
- **Express.js** (5.1.0)
- **CORS** (2.8.5)
- **dotenv** (16.5.0)

## 📁 Endpoints Disponibles

### Principales
- `GET /` - Información general de la API
- `GET /health` - Health check para monitoreo

### Proyectos
- `GET /api/proyectos` - Obtener todos los proyectos
- `POST /api/proyectos` - Crear nuevo proyecto

### Gastos
- `GET /api/gastos/:proyectoId` - Obtener gastos de un proyecto
- `POST /api/gastos` - Agregar nuevo gasto

### Resumen
- `GET /api/resumen/:proyectoId` - Resumen financiero del proyecto

## 🔧 Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/PabloArayaG/CP-ERP.git
   cd CP-ERP/backend
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   ```bash
   cp env.example .env
   # Edita el archivo .env con tus valores
   ```

4. **Ejecuta en desarrollo:**
   ```bash
   npm run dev
   ```

5. **Ejecuta en producción:**
   ```bash
   npm start
   ```

## 🌐 Deploy en Render

### Paso 1: Preparar el repositorio
1. Asegúrate de que el código esté en GitHub
2. El backend debe estar en la carpeta `/backend`

### Paso 2: Crear servicio en Render
1. Ve a [Render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. Click "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura el servicio:

   **Configuración básica:**
   - **Name:** `control-proyectos-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Paso 3: Variables de entorno en Render
En la sección "Environment Variables" agrega:

```
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
```

### Paso 4: Deploy
1. Click "Create Web Service"
2. Render automáticamente instalará dependencias y ejecutará el servidor
3. Tu API estará disponible en: `https://tu-servicio.onrender.com`

### Paso 5: Verificar funcionamiento
Visita: `https://tu-servicio.onrender.com/health`

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00Z",
  "uptime": 123.45
}
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `5000` |
| `NODE_ENV` | Entorno de ejecución | `production` |
| `FRONTEND_URL` | URL del frontend para CORS | `https://app.vercel.app` |

## 🔍 Estructura del Proyecto

```
backend/
├── index.js          # Servidor principal
├── package.json      # Dependencias y scripts
├── env.example       # Ejemplo de variables de entorno
├── .env             # Variables de entorno (no subir a Git)
└── README.md        # Documentación
```

## 🚨 Troubleshooting

### Error de CORS
- Asegúrate de que `FRONTEND_URL` esté configurada correctamente
- Verifica que la URL del frontend sea exacta (sin barra final)

### Error 404 en Render
- Verifica que el `Root Directory` sea `backend`
- Confirma que el `Start Command` sea `npm start`

### Error de Puerto
- Render asigna el puerto automáticamente via `process.env.PORT`
- No hardcodees el puerto en el código

## 📝 Notas Importantes

1. **Free Tier de Render:** El servicio puede "dormir" después de 15 minutos de inactividad
2. **Cold Start:** El primer request después del "sueño" puede tardar 30-60 segundos
3. **Logs:** Puedes ver los logs en tiempo real en el dashboard de Render

## 🔗 Enlaces Útiles

- [Documentación de Render](https://render.com/docs)
- [Express.js](https://expressjs.com/)
- [Frontend del proyecto](../frontend/README.md) 