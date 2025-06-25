# 🏭 Control de Proyectos ERP

Sistema completo de gestión de proyectos y gastos para empresas industriales. Aplicación fullstack con backend en **Render** y frontend en **Vercel**.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Backend](https://img.shields.io/badge/Backend-Render-purple)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)

## 🌟 Demo en Vivo

- **🌐 Frontend:** [https://tu-proyecto.vercel.app](https://tu-proyecto.vercel.app)
- **🚀 API Backend:** [https://tu-api.onrender.com](https://tu-api.onrender.com)
- **📊 Health Check:** [https://tu-api.onrender.com/health](https://tu-api.onrender.com/health)

## 🏗️ Arquitectura

```
┌─────────────────┐       ┌─────────────────┐
│   FRONTEND      │────── │    BACKEND      │
│   (Vercel)      │ HTTP  │   (Render)      │
│   React + Axios │ API   │ Express + Node  │
└─────────────────┘       └─────────────────┘
```

## 📁 Estructura del Proyecto

```
Control-proyectos-app/
├── 📁 backend/           # API REST (Node.js + Express)
│   ├── index.js         # Servidor principal
│   ├── package.json     # Dependencias backend
│   ├── env.example      # Variables entorno backend
│   └── README.md        # Docs backend
├── 📁 frontend/          # App React
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── services/    # API client
│   │   └── views/       # Páginas principales
│   ├── package.json     # Dependencias frontend
│   ├── env.example      # Variables entorno frontend
│   └── README.md        # Docs frontend
└── README.md            # Este archivo
```

## 🚀 Deploy Rápido

### 1️⃣ Backend en Render

```bash
# 1. Sube el código a GitHub (ya hecho)
# 2. Ve a render.com
# 3. New Web Service
# 4. Conecta este repositorio
# 5. Configuración:
Root Directory: backend
Build Command: npm install
Start Command: npm start
Environment Variables:
  NODE_ENV=production
  FRONTEND_URL=https://tu-frontend.vercel.app
```

### 2️⃣ Frontend en Vercel

```bash
# 1. Ve a vercel.com
# 2. New Project
# 3. Importa este repositorio
# 4. Configuración:
Framework: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Environment Variables:
  REACT_APP_API_URL=https://tu-backend.onrender.com
```

## 💻 Desarrollo Local

### Prerrequisitos
- Node.js ≥ 18.0.0
- npm ≥ 8.0.0
- Git

### Instalación Completa

1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/PabloArayaG/CP-ERP.git
   cd CP-ERP
   ```

2. **Configurar Backend:**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Editar .env con tus configuraciones
   npm run dev
   ```

3. **Configurar Frontend (nueva terminal):**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   # Configurar REACT_APP_API_URL=http://localhost:5000
   npm run dev
   ```

4. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - API Health: http://localhost:5000/health

## 🔧 Variables de Entorno

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME="Control de Proyectos"
REACT_APP_VERSION="1.0.0"
```

## 🌐 APIs Disponibles

### Proyectos
- `GET /api/proyectos` - Listar proyectos
- `POST /api/proyectos` - Crear proyecto

### Gastos
- `GET /api/gastos/:proyectoId` - Gastos por proyecto
- `POST /api/gastos` - Agregar gasto

### Sistema
- `GET /` - Información de la API
- `GET /health` - Estado del servidor

## 🧪 Testing

### Probar Backend
```bash
cd backend
npm start

# En otra terminal
curl http://localhost:5000/health
```

### Probar Frontend
```bash
cd frontend
npm run build
npm start
```

### Probar Conexión Completa
1. Inicia el backend: `cd backend && npm run dev`
2. Inicia el frontend: `cd frontend && npm run dev`
3. Ve a http://localhost:3000
4. Verifica que aparezca "Backend Conectado ✅"

## 🚨 Troubleshooting

### ❌ Error de CORS
**Problema:** Frontend no puede conectar con backend
**Solución:**
1. Verifica que `FRONTEND_URL` esté configurada en el backend
2. Asegúrate de que las URLs sean exactas (sin barra final)

### ❌ Error 404 en Vercel
**Problema:** Rutas de React no funcionan
**Solución:** Ya está solucionado con `vercel.json`

### ❌ Backend no inicia en Render
**Problema:** Error al hacer deploy
**Solución:**
1. Verifica que `Root Directory` sea `backend`
2. Confirma que `Start Command` sea `npm start`
3. Revisa los logs en Render dashboard

### ❌ Variables de entorno no funcionan
**Problema:** Configuración no se aplica
**Solución:**
1. Frontend: Variables deben empezar con `REACT_APP_`
2. Backend: Reinicia el servicio en Render
3. Verifica que estén configuradas en los dashboards

## 📊 Funcionalidades

### ✅ Gestión de Proyectos
- Crear, editar y eliminar proyectos
- Seguimiento de progreso
- Estados personalizables
- Categorización por tipo

### ✅ Control de Gastos
- Registro detallado de gastos
- Categorización automática
- Totales en tiempo real
- Historial completo

### ✅ Dashboard Inteligente
- Métricas en tiempo real
- Gráficos informativos
- Accesos rápidos
- Estado de conexión

### ✅ Reportes
- Resúmenes financieros
- Análisis por proyecto
- Exportación de datos
- Visualizaciones

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1.0
- **CORS:** Configurado para producción
- **Deploy:** Render.com

### Frontend
- **Framework:** React 19.1.0
- **HTTP Client:** Axios 1.6.0
- **Styling:** CSS3 personalizado
- **Deploy:** Vercel.com

### DevOps
- **Version Control:** Git + GitHub
- **CI/CD:** Automático con Vercel/Render
- **Monitoring:** Health checks integrados

## 📈 Roadmap

### Versión 1.1 (Próximamente)
- [ ] Autenticación de usuarios
- [ ] Base de datos PostgreSQL
- [ ] Notificaciones en tiempo real
- [ ] PWA (Progressive Web App)

### Versión 1.2 (Futuro)
- [ ] Dashboard de administración
- [ ] API de reportes avanzados
- [ ] Integración con sistemas ERP
- [ ] App móvil nativa

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia ISC. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Pablo Araya**
- GitHub: [@PabloArayaG](https://github.com/PabloArayaG)
- Proyecto: [CP-ERP](https://github.com/PabloArayaG/CP-ERP)

## 🙏 Agradecimientos

- [Render.com](https://render.com) por el hosting del backend
- [Vercel.com](https://vercel.com) por el hosting del frontend
- [React](https://reactjs.org) por el framework frontend
- [Express.js](https://expressjs.com) por el framework backend

---

**🚀 ¡Listo para producción!** Sigue las instrucciones de deploy y tendrás tu sistema ERP funcionando en minutos. 