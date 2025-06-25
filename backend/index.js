const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS para producción
const corsOptions = {
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://vercel.app', 'https://*.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para logs en producción
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API de Control de Proyectos funcionando 🚀',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            proyectos: '/api/proyectos',
            gastos: '/api/gastos',
            resumen: '/api/resumen/:proyectoId'
        }
    });
});

// Health check endpoint para Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Endpoints para proyectos
app.get('/api/proyectos', (req, res) => {
    res.json({ 
        success: true,
        message: 'Endpoint para obtener proyectos',
        data: [],
        note: 'Este endpoint se puede usar para sincronizar con Firebase o como backup'
    });
});

app.post('/api/proyectos', (req, res) => {
    const { nombre, descripcion, estado } = req.body;
    
    if (!nombre || !descripcion) {
        return res.status(400).json({ 
            success: false,
            error: 'Nombre y descripción son requeridos' 
        });
    }
    
    res.json({ 
        success: true,
        message: 'Proyecto creado exitosamente',
        data: { 
            id: Date.now(), // En producción usarías un ID real
            nombre, 
            descripcion, 
            estado: estado || 'en curso',
            fechaCreacion: new Date().toISOString()
        }
    });
});

// Endpoints para gastos
app.get('/api/gastos/:proyectoId', (req, res) => {
    const { proyectoId } = req.params;
    res.json({ 
        success: true,
        message: `Gastos del proyecto ${proyectoId}`,
        data: [],
        proyectoId,
        note: 'Este endpoint se puede usar para obtener gastos específicos de un proyecto'
    });
});

app.post('/api/gastos', (req, res) => {
    const { monto, categoria, observacion, proyectoId } = req.body;
    
    if (!monto || !categoria || !proyectoId) {
        return res.status(400).json({ 
            success: false,
            error: 'Monto, categoría y proyectoId son requeridos' 
        });
    }
    
    res.json({ 
        success: true,
        message: 'Gasto agregado exitosamente',
        data: { 
            id: Date.now(),
            monto: parseFloat(monto), 
            categoria, 
            observacion, 
            proyectoId,
            fecha: new Date().toISOString()
        }
    });
});

// Endpoint para resumen de gastos
app.get('/api/resumen/:proyectoId', (req, res) => {
    const { proyectoId } = req.params;
    res.json({ 
        success: true,
        message: `Resumen financiero del proyecto ${proyectoId}`,
        data: {
            proyectoId,
            totalGastos: 0,
            totalCategorias: 0,
            ultimaActualizacion: new Date().toISOString()
        },
        note: 'Aquí se puede implementar lógica para calcular totales y estadísticas'
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 API de Control de Proyectos lista para usar`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
