# 🌐 Frontend - Control de Proyectos

Aplicación React para la gestión visual de proyectos y gastos industriales.

## 📋 Características

- ✅ Interfaz moderna con React 19
- ✅ Comunicación con API REST
- ✅ Manejo de estados y errores
- ✅ Diseño responsive
- ✅ Variables de entorno configurables
- ✅ Optimizado para Vercel

## 🛠️ Tecnologías

- **React** (19.1.0)
- **Axios** (1.6.0) - Cliente HTTP
- **Firebase** (11.9.1) - Base de datos opcional
- **CSS3** - Estilos personalizados

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── AgregarGasto.jsx
│   │   ├── CrearProyecto.jsx
│   │   ├── ListaProyectos.jsx
│   │   ├── PanelProyectos.jsx
│   │   └── Sidebar.jsx
│   ├── services/        # Servicios y APIs
│   │   ├── api.js       # Cliente API principal
│   │   └── firebase.js  # Configuración Firebase
│   ├── views/           # Vistas principales
│   │   ├── Dashboard.jsx
│   │   ├── ProyectosView.jsx
│   │   ├── GastosView.jsx
│   │   └── ReportesView.jsx
│   ├── App.js          # Componente principal
│   └── index.js        # Punto de entrada
├── package.json        # Dependencias
├── env.example         # Variables de entorno ejemplo
└── README.md          # Documentación
```

## 🔧 Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/PabloArayaG/CP-ERP.git
   cd CP-ERP/frontend
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

5. **Construye para producción:**
   ```bash
   npm run build
   ```

## 🌐 Deploy en Vercel

### Método 1: Deploy directo desde GitHub (Recomendado)

1. **Preparar el repositorio:**
   - Asegúrate de que el código esté en GitHub
   - El frontend debe estar en la carpeta `/frontend`

2. **Crear proyecto en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Click "New Project"
   - Importa tu repositorio

3. **Configurar el proyecto:**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Variables de entorno en Vercel:**
   En "Environment Variables" agrega:
   ```
   REACT_APP_API_URL = https://tu-backend.onrender.com
   REACT_APP_NAME = Control de Proyectos
   REACT_APP_VERSION = 1.0.0
   REACT_APP_ENV = production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Vercel automáticamente construirá y desplegará tu app
   - Tu app estará en: `https://tu-proyecto.vercel.app`

### Método 2: Deploy con Vercel CLI

1. **Instala Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Ejecuta deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Sigue las instrucciones del CLI**

## ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL del backend | `https://api.onrender.com` |
| `REACT_APP_NAME` | Nombre de la app | `Control de Proyectos` |
| `REACT_APP_VERSION` | Versión | `1.0.0` |
| `REACT_APP_ENV` | Entorno | `production` |

## 🔗 Conexión con Backend

El frontend se conecta al backend usando:

1. **Servicio API centralizado:** `src/services/api.js`
2. **Variable de entorno:** `REACT_APP_API_URL`
3. **Cliente HTTP:** Axios con interceptors

### Ejemplo de uso:
```javascript
import { proyectosAPI } from '../services/api';

// Obtener proyectos
const proyectos = await proyectosAPI.obtenerTodos();

// Crear proyecto
const nuevoProyecto = await proyectosAPI.crear({
  nombre: 'Mi Proyecto',
  descripcion: 'Descripción del proyecto'
});
```

## 📱 Funcionalidades Principales

### Dashboard
- Métricas generales (proyectos activos, gastos totales)
- Lista de proyectos recientes
- Acciones rápidas
- Estado de conexión con backend

### Gestión de Proyectos
- Crear nuevos proyectos
- Ver lista completa
- Editar proyectos existentes
- Seguimiento de progreso

### Control de Gastos
- Agregar gastos por proyecto
- Categorización automática
- Visualización de totales
- Historial de gastos

### Reportes
- Resúmenes financieros
- Gráficos de gastos
- Exportación de datos

## 🚨 Troubleshooting

### Error de Conexión con Backend
```
❌ Error de conexión con backend
API URL: No configurada
```

**Solución:**
1. Verifica que `REACT_APP_API_URL` esté configurada
2. Asegúrate de que el backend esté funcionando
3. Verifica que no haya problemas de CORS

### Error 404 en Vercel
**Problema:** Las rutas de React no funcionan en producción

**Solución:** Vercel maneja automáticamente las SPA, pero si hay problemas:
1. Agrega un archivo `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Variables de Entorno no Funcionan
**Problema:** Las variables no se cargan en producción

**Solución:**
1. Asegúrate de que empiecen con `REACT_APP_`
2. Configúralas en el dashboard de Vercel
3. Redeploy la aplicación

### Build Failures
**Problema:** Error durante el build

**Solución:**
1. Verifica que todas las dependencias estén instaladas
2. Elimina `node_modules` y `package-lock.json`
3. Ejecuta `npm install` nuevamente
4. Ejecuta `npm run build` localmente para debuggear

## 📊 Performance

### Optimizaciones Incluidas
- ✅ Code splitting automático con React
- ✅ Lazy loading de componentes
- ✅ Optimización de imágenes
- ✅ Minificación automática
- ✅ Gzip compression por Vercel

### Métricas Objetivo
- **First Contentful Paint:** < 2s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Create React App](https://create-react-app.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Backend del proyecto](../backend/README.md)

## 🐛 Debugging en Producción

### Ver Logs en Vercel
1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions" o "Edge Network"
4. Revisa los logs de build y runtime

### Debugging Local
```bash
# Ver logs detallados
REACT_APP_API_URL=http://localhost:5000 npm start

# Build con análisis
npm run build -- --analyze
```

## 🚀 Próximas Mejoras

- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Notificaciones push
- [ ] Tema oscuro
- [ ] Internacionalización
- [ ] Tests automatizados
