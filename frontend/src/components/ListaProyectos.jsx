// src/components/ListaProyectos.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import './ListaProyectos.css';

function ListaProyectos({ onVerDetalle }) {
  const [proyectos, setProyectos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      // Cargar proyectos
      const proyectosSnapshot = await getDocs(collection(db, 'proyectos'));
      const proyectosData = proyectosSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));

      // Cargar gastos
      const gastosSnapshot = await getDocs(collection(db, 'gastos'));
      const gastosData = gastosSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));

      // Calcular gastos por proyecto
      const proyectosConGastos = proyectosData.map(proyecto => {
        const gastosDelProyecto = gastosData.filter(gasto => gasto.proyectoId === proyecto.id);
        const gastoTotal = gastosDelProyecto.reduce((total, gasto) => total + (gasto.monto || 0), 0);
        
        return {
          ...proyecto,
          gastoTotal,
          cantidadGastos: gastosDelProyecto.length,
          progreso: proyecto.progreso || (proyecto.estado === 'Completado' ? 100 : 
                   proyecto.estado === 'En Progreso' ? 50 : 25)
        };
      });

      setProyectos(proyectosConGastos);
      setGastos(gastosData);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    if (fecha.toDate) {
      return fecha.toDate().toLocaleDateString();
    }
    return new Date(fecha).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="lista-proyectos">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="lista-proyectos">
        <div className="estado-vacio">
          <div className="vacio-icon">🏗️</div>
          <h3>No hay proyectos creados</h3>
          <p>Crea tu primer proyecto para comenzar a gestionar tus gastos industriales</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-proyectos">
      <div className="proyectos-stats">
        <div className="stat-item">
          <span className="stat-numero">{proyectos.length}</span>
          <span className="stat-label">Proyectos Totales</span>
        </div>
        <div className="stat-item">
          <span className="stat-numero">{proyectos.filter(p => p.estado === 'En Progreso').length}</span>
          <span className="stat-label">En Progreso</span>
        </div>
        <div className="stat-item">
          <span className="stat-numero">{proyectos.filter(p => p.estado === 'Completado').length}</span>
          <span className="stat-label">Completados</span>
        </div>
        <div className="stat-item">
          <span className="stat-numero">
            {formatearMoneda(proyectos.reduce((total, p) => total + p.gastoTotal, 0))}
          </span>
          <span className="stat-label">Gastos Totales</span>
        </div>
      </div>

      <div className="proyectos-grid">
        {proyectos.map(proyecto => (
          <div 
            key={proyecto.id} 
            className="proyecto-card"
            onClick={() => onVerDetalle && onVerDetalle(proyecto.id)}
          >
            <div className="card-header">
              <div className="proyecto-titulo">
                <h3>{proyecto.nombre}</h3>
                <span 
                  className="estado-badge"
                  style={{ backgroundColor: obtenerColorEstado(proyecto.estado) }}
                >
                  {proyecto.estado || 'Planificación'}
                </span>
              </div>
              <div className="proyecto-meta">
                <span className="proyecto-tipo">{proyecto.tipo || 'Industrial'}</span>
                <span className="proyecto-fecha">
                  {formatearFecha(proyecto.fecha_creacion)}
                </span>
              </div>
            </div>

            <div className="card-body">
              <p className="proyecto-descripcion">
                {proyecto.descripcion || 'Sin descripción disponible'}
              </p>
              
              {/* Información de la empresa */}
              {proyecto.nombreEmpresa && (
                <div className="empresa-info">
                  <span className="empresa-nombre">🏢 {proyecto.nombreEmpresa}</span>
                  {proyecto.rutEmpresa && (
                    <span className="empresa-rut">RUT: {proyecto.rutEmpresa}</span>
                  )}
                </div>
              )}
              
              <div className="proyecto-metricas">
                <div className="metrica">
                  <span className="metrica-label">Gastos</span>
                  <span className="metrica-valor">{formatearMoneda(proyecto.gastoTotal)}</span>
                </div>
                <div className="metrica">
                  <span className="metrica-label">Registros</span>
                  <span className="metrica-valor">{proyecto.cantidadGastos}</span>
                </div>
                <div className="metrica">
                  <span className="metrica-label">Progreso</span>
                  <span className="metrica-valor">{proyecto.progreso}%</span>
                </div>
              </div>

              <div className="progreso-container">
                <div className="progreso-barra">
                  <div 
                    className="progreso-fill"
                    style={{ 
                      width: `${proyecto.progreso}%`,
                      backgroundColor: obtenerColorEstado(proyecto.estado)
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="acciones">
                <button 
                  className="btn-ver-detalle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerDetalle && onVerDetalle(proyecto.id);
                  }}
                >
                  👁️ Ver Detalle
                </button>
                <div className="indicadores">
                  {proyecto.cantidadGastos > 0 && (
                    <span className="indicador gastos">💰 {proyecto.cantidadGastos}</span>
                  )}
                  {proyecto.valorVenta && (
                    <span className="indicador venta">💎</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaProyectos;
