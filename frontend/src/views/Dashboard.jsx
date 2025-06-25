import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { proyectosAPI, gastosAPI, verificarConexion } from '../services/api';

function Dashboard({ cambiarVista }) {
  const [proyectos, setProyectos] = useState([]);
  const [gastosTotales, setGastosTotales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conexionBackend, setConexionBackend] = useState(false);

  // Verificar conexión con backend al montar el componente
  useEffect(() => {
    const verificarBackend = async () => {
      console.log('🔍 Verificando conexión con backend...');
      const conectado = await verificarConexion();
      setConexionBackend(conectado);
      
      if (!conectado) {
        setError('No se pudo conectar con el backend. Verifica que esté funcionando.');
      }
    };

    verificarBackend();
  }, []);

  // Cargar datos del backend
  useEffect(() => {
    const cargarDatos = async () => {
      if (!conexionBackend) return;

      console.log('🔄 Cargando datos del backend...');
      try {
        setLoading(true);
        setError(null);

        // Obtener proyectos
        const responseProyectos = await proyectosAPI.obtenerTodos();
        console.log('📋 Respuesta proyectos:', responseProyectos);

        // Simular algunos proyectos para demostración
        const proyectosDemo = [
          {
            id: 1,
            nombre: 'Diseño Industrial - Maquinaria',
            descripcion: 'Desarrollo de nueva línea de maquinaria industrial',
            estado: 'En Progreso',
            tipo: 'Industrial',
            progreso: 65,
            gastos: 0
          },
          {
            id: 2,
            nombre: 'Prototipo Automatización',
            descripcion: 'Sistema de automatización para línea de producción',
            estado: 'Planificación',
            tipo: 'Automatización',
            progreso: 25,
            gastos: 0
          },
          {
            id: 3,
            nombre: 'Optimización de Procesos',
            descripcion: 'Mejora de eficiencia en procesos productivos',
            estado: 'Completado',
            tipo: 'Consultoría',
            progreso: 100,
            gastos: 0
          }
        ];

        // Obtener gastos para cada proyecto
        let totalGastos = 0;
        const proyectosConGastos = await Promise.all(
          proyectosDemo.map(async (proyecto) => {
            try {
              const responseGastos = await gastosAPI.obtenerPorProyecto(proyecto.id);
              console.log(`💰 Gastos proyecto ${proyecto.id}:`, responseGastos);
              
              // Simular algunos gastos para demostración
              const gastosSimulados = [
                { monto: 150000, categoria: 'Materiales' },
                { monto: 80000, categoria: 'Mano de obra' },
                { monto: 45000, categoria: 'Equipos' }
              ];

              const gastoTotal = gastosSimulados.reduce((total, gasto) => total + gasto.monto, 0);
              totalGastos += gastoTotal;

              return {
                ...proyecto,
                gastos: gastoTotal
              };
            } catch (error) {
              console.error(`Error al obtener gastos del proyecto ${proyecto.id}:`, error);
              return {
                ...proyecto,
                gastos: 0
              };
            }
          })
        );

        console.log('✅ Proyectos cargados:', proyectosConGastos);
        setProyectos(proyectosConGastos);
        setGastosTotales(totalGastos);
        setLoading(false);

      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        setError(`Error al cargar datos: ${error.message}`);
        setLoading(false);
      }
    };

    cargarDatos();
  }, [conexionBackend]);

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad);
  };

  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'En Progreso': return '#3498db';
      case 'Completado': return '#27ae60';
      case 'Planificación': return '#f39c12';
      case 'Pausado': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Mostrar error de conexión
  if (error && !conexionBackend) {
    return (
      <div className="dashboard-clean">
        <div className="dashboard-header">
          <h1>Control de Proyectos</h1>
          <p>Sistema de gestión industrial</p>
        </div>
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Error de Conexión</h3>
          <p>{error}</p>
          <p>API URL: {process.env.REACT_APP_API_URL || 'No configurada'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="dashboard-clean">
        <div className="dashboard-header">
          <h1>Control de Proyectos</h1>
          <p>Sistema de gestión industrial - Conectado al Backend ✅</p>
        </div>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Cargando información del servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-clean">
      <div className="dashboard-header">
        <h1>Control de Proyectos</h1>
        <p>Sistema de gestión industrial - Backend Conectado ✅</p>
        <div className="connection-status">
          <span className={`status-indicator ${conexionBackend ? 'connected' : 'disconnected'}`}>
            {conexionBackend ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Métricas principales */}
        <div className="metricas-grid">
          <div className="metrica-card">
            <div className="metrica-icon">📊</div>
            <div className="metrica-info">
              <h3>{proyectos.length}</h3>
              <p>Proyectos Activos</p>
            </div>
          </div>
          
          <div className="metrica-card">
            <div className="metrica-icon">💰</div>
            <div className="metrica-info">
              <h3>{formatearMoneda(gastosTotales)}</h3>
              <p>Gastos Totales</p>
            </div>
          </div>
          
          <div className="metrica-card">
            <div className="metrica-icon">⚡</div>
            <div className="metrica-info">
              <h3>{proyectos.filter(p => p.estado === 'En Progreso').length}</h3>
              <p>En Progreso</p>
            </div>
          </div>
          
          <div className="metrica-card">
            <div className="metrica-icon">✅</div>
            <div className="metrica-info">
              <h3>{proyectos.filter(p => p.estado === 'Completado').length}</h3>
              <p>Completados</p>
            </div>
          </div>
        </div>

        {/* Lista de proyectos */}
        <div className="proyectos-recientes">
          <div className="seccion-header">
            <h2>Proyectos Recientes</h2>
            <button 
              className="btn-ver-todos"
              onClick={() => cambiarVista('proyectos')}
            >
              Ver Todos
            </button>
          </div>
          
          <div className="proyectos-lista">
            {proyectos.slice(0, 3).map((proyecto) => (
              <div key={proyecto.id} className="proyecto-card">
                <div className="proyecto-header">
                  <h3>{proyecto.nombre}</h3>
                  <span 
                    className="estado-badge"
                    style={{ backgroundColor: obtenerColorEstado(proyecto.estado) }}
                  >
                    {proyecto.estado}
                  </span>
                </div>
                
                <p className="proyecto-descripcion">{proyecto.descripcion}</p>
                
                <div className="proyecto-stats">
                  <div className="stat">
                    <span className="stat-label">Tipo:</span>
                    <span className="stat-value">{proyecto.tipo}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Gastos:</span>
                    <span className="stat-value">{formatearMoneda(proyecto.gastos)}</span>
                  </div>
                </div>
                
                <div className="proyecto-progreso">
                  <div className="progreso-header">
                    <span>Progreso</span>
                    <span>{proyecto.progreso}%</span>
                  </div>
                  <div className="progreso-bar">
                    <div 
                      className="progreso-fill"
                      style={{ width: `${proyecto.progreso}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="acciones-rapidas">
          <h2>Acciones Rápidas</h2>
          <div className="acciones-grid">
            <button 
              className="accion-btn"
              onClick={() => cambiarVista('crear-proyecto')}
            >
              <div className="accion-icon">➕</div>
              <span>Nuevo Proyecto</span>
            </button>
            
            <button 
              className="accion-btn"
              onClick={() => cambiarVista('gastos')}
            >
              <div className="accion-icon">💰</div>
              <span>Registrar Gasto</span>
            </button>
            
            <button 
              className="accion-btn"
              onClick={() => cambiarVista('reportes')}
            >
              <div className="accion-icon">📊</div>
              <span>Ver Reportes</span>
            </button>
            
            <button 
              className="accion-btn"
              onClick={() => cambiarVista('proyectos')}
            >
              <div className="accion-icon">📋</div>
              <span>Todos los Proyectos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 