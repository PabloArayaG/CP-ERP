import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Instancia de axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    // Manejo de errores específicos
    if (error.response) {
      // Error con respuesta del servidor
      const { status, data } = error.response;
      console.error(`Server Error ${status}:`, data);
    } else if (error.request) {
      // Error de red
      console.error('Network Error:', error.message);
    } else {
      // Error de configuración
      console.error('Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ====================================
// SERVICIOS DE PROYECTOS
// ====================================

export const proyectosAPI = {
  // Obtener todos los proyectos
  obtenerTodos: async () => {
    try {
      const response = await api.get('/api/proyectos');
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener proyectos: ${error.message}`);
    }
  },

  // Crear nuevo proyecto
  crear: async (proyecto) => {
    try {
      const response = await api.post('/api/proyectos', proyecto);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear proyecto: ${error.message}`);
    }
  },
};

// ====================================
// SERVICIOS DE GASTOS
// ====================================

export const gastosAPI = {
  // Obtener gastos de un proyecto
  obtenerPorProyecto: async (proyectoId) => {
    try {
      const response = await api.get(`/api/gastos/${proyectoId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener gastos: ${error.message}`);
    }
  },

  // Agregar nuevo gasto
  agregar: async (gasto) => {
    try {
      const response = await api.post('/api/gastos', gasto);
      return response.data;
    } catch (error) {
      throw new Error(`Error al agregar gasto: ${error.message}`);
    }
  },
};

// ====================================
// SERVICIOS DE RESUMEN
// ====================================

export const resumenAPI = {
  // Obtener resumen de un proyecto
  obtener: async (proyectoId) => {
    try {
      const response = await api.get(`/api/resumen/${proyectoId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener resumen: ${error.message}`);
    }
  },
};

// ====================================
// SERVICIO DE HEALTH CHECK
// ====================================

export const healthAPI = {
  // Verificar estado del servidor
  check: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Error en health check: ${error.message}`);
    }
  },
};

// ====================================
// UTILIDADES
// ====================================

// Función para verificar conexión con el backend
export const verificarConexion = async () => {
  try {
    const health = await healthAPI.check();
    console.log('✅ Conexión con backend exitosa:', health);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión con backend:', error.message);
    return false;
  }
};

// Exportar instancia de axios por si se necesita personalización adicional
export default api; 