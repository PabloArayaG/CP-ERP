import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import './ReportesView.css';

function ReportesView() {
  const [reportes, setReportes] = useState({
    gastosPorCategoria: [],
    gastosPorProyecto: [],
    tendenciasMensuales: [],
    resumenGeneral: {
      totalProyectos: 0,
      totalGastos: 0,
      promedioGastoPorProyecto: 0,
      categoriaConMayorGasto: ''
    }
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    generarReportes();
  }, []);

  const generarReportes = async () => {
    try {
      setCargando(true);
      
      // Obtener datos de proyectos y gastos
      const proyectosSnapshot = await getDocs(collection(db, 'proyectos'));
      const gastosSnapshot = await getDocs(collection(db, 'gastos'));
      
      const proyectos = proyectosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const gastos = gastosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Análisis por categoría
      const gastosPorCategoria = {};
      gastos.forEach(gasto => {
        const categoria = gasto.categoria || 'Sin categoría';
        gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + (gasto.monto || 0);
      });

      // Análisis por proyecto
      const gastosPorProyecto = {};
      gastos.forEach(gasto => {
        const proyecto = gasto.proyectoId || 'Sin proyecto';
        gastosPorProyecto[proyecto] = (gastosPorProyecto[proyecto] || 0) + (gasto.monto || 0);
      });

      // Calcular resumen general
      const totalProyectos = proyectos.length;
      const totalGastos = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
      const promedioGastoPorProyecto = totalProyectos > 0 ? totalGastos / totalProyectos : 0;
      const categoriaConMayorGasto = Object.keys(gastosPorCategoria).reduce((a, b) => 
        gastosPorCategoria[a] > gastosPorCategoria[b] ? a : b, 'N/A'
      );

      setReportes({
        gastosPorCategoria: Object.entries(gastosPorCategoria).map(([categoria, monto]) => ({ categoria, monto })),
        gastosPorProyecto: Object.entries(gastosPorProyecto).map(([proyecto, monto]) => ({ proyecto, monto })),
        tendenciasMensuales: [], // Se puede implementar más adelante
        resumenGeneral: {
          totalProyectos,
          totalGastos,
          promedioGastoPorProyecto,
          categoriaConMayorGasto
        }
      });

    } catch (error) {
      console.error('Error generando reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  if (cargando) {
    return (
      <div className="reportes-view">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Generando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reportes-view">
      <div className="reportes-header">
        <div className="header-content">
          <h1>📊 Reportes y Análisis</h1>
          <p>Análisis detallado de gastos y rendimiento de proyectos</p>
        </div>
        <button className="actualizar-btn" onClick={generarReportes}>
          🔄 Actualizar
        </button>
      </div>

      <div className="reportes-content">
        {/* Resumen General */}
        <div className="resumen-grid">
        <div className="resumen-card primary">
          <div className="resumen-icon">🏗️</div>
          <div className="resumen-content">
            <h3>{reportes.resumenGeneral.totalProyectos}</h3>
            <p>Proyectos Totales</p>
          </div>
        </div>

        <div className="resumen-card danger">
          <div className="resumen-icon">💰</div>
          <div className="resumen-content">
            <h3>{formatCurrency(reportes.resumenGeneral.totalGastos)}</h3>
            <p>Gastos Totales</p>
          </div>
        </div>

        <div className="resumen-card warning">
          <div className="resumen-icon">📈</div>
          <div className="resumen-content">
            <h3>{formatCurrency(reportes.resumenGeneral.promedioGastoPorProyecto)}</h3>
            <p>Promedio por Proyecto</p>
          </div>
        </div>

        <div className="resumen-card success">
          <div className="resumen-icon">🎯</div>
          <div className="resumen-content">
            <h3>{reportes.resumenGeneral.categoriaConMayorGasto}</h3>
            <p>Categoría Principal</p>
          </div>
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="analisis-container">
        <div className="analisis-section">
          <h2>📋 Gastos por Categoría</h2>
          <div className="tabla-container">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Monto Total</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {reportes.gastosPorCategoria.map((item, index) => (
                  <tr key={index}>
                    <td>{item.categoria}</td>
                    <td>{formatCurrency(item.monto)}</td>
                    <td>
                      {((item.monto / reportes.resumenGeneral.totalGastos) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="analisis-section">
          <h2>🏗️ Gastos por Proyecto</h2>
          <div className="tabla-container">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Monto Total</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {reportes.gastosPorProyecto.map((item, index) => (
                  <tr key={index}>
                    <td>{item.proyecto}</td>
                    <td>{formatCurrency(item.monto)}</td>
                    <td>
                      {((item.monto / reportes.resumenGeneral.totalGastos) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ReportesView; 