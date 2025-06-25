import React, { useState, useEffect } from 'react';
import './ProyectoDetalle.css';
import { db, storage } from '../services/firebase';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProyectoDetalle({ proyectoId, volverAtras }) {
  const [proyecto, setProyecto] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoVenta, setEditandoVenta] = useState(false);
  const [valorVenta, setValorVenta] = useState(0);
  const [mostrarModalGasto, setMostrarModalGasto] = useState(false);
  const [formGasto, setFormGasto] = useState({
    monto: '',
    categoria: '',
    observacion: '',
    archivo: null,
  });
  const [loadingGasto, setLoadingGasto] = useState(false);

  const categorias = [
    'Materiales - Metales',
    'Materiales - Tornillería', 
    'Materiales - Soldadura',
    'Herramientas',
    'Mano de obra',
    'Transporte',
    'Subcontratación',
    'Diseño y planos',
    'Permisos y licencias',
    'Equipamiento',
    'Otros'
  ];

  // Cargar datos del proyecto y sus gastos
  useEffect(() => {
    const cargarDatosProyecto = async () => {
      try {
        console.log('🔄 Cargando proyecto:', proyectoId);
        
        // Obtener datos del proyecto
        const proyectoDoc = await getDoc(doc(db, 'proyectos', proyectoId));
        if (proyectoDoc.exists()) {
          const proyectoData = { id: proyectoDoc.id, ...proyectoDoc.data() };
          setProyecto(proyectoData);
          setValorVenta(proyectoData.valorVenta || 0);
          console.log('📋 Proyecto cargado:', proyectoData);
        }

        // Obtener gastos del proyecto
        const gastosQuery = query(collection(db, 'gastos'), where('proyectoId', '==', proyectoId));
        const gastosSnapshot = await getDocs(gastosQuery);
        const gastosData = [];
        gastosSnapshot.forEach((doc) => {
          gastosData.push({ id: doc.id, ...doc.data() });
        });
        
        setGastos(gastosData);
        console.log('💰 Gastos cargados:', gastosData);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error cargando proyecto:', error);
        setLoading(false);
      }
    };

    if (proyectoId) {
      cargarDatosProyecto();
    }
  }, [proyectoId]);

  // Actualizar valor de venta
  const actualizarValorVenta = async () => {
    try {
      await updateDoc(doc(db, 'proyectos', proyectoId), {
        valorVenta: parseFloat(valorVenta) || 0
      });
      setProyecto(prev => ({ ...prev, valorVenta: parseFloat(valorVenta) || 0 }));
      setEditandoVenta(false);
      console.log('✅ Valor de venta actualizado');
    } catch (error) {
      console.error('❌ Error actualizando valor de venta:', error);
    }
  };

  // Manejar cambios en el formulario de gasto
  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setFormGasto({ ...formGasto, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormGasto({ ...formGasto, archivo: e.target.files[0] });
  };

  // Agregar nuevo gasto
  const agregarGasto = async (e) => {
    e.preventDefault();
    setLoadingGasto(true);

    try {
      let comprobanteUrl = '';
      if (formGasto.archivo) {
        const archivoRef = ref(storage, `comprobantes/${Date.now()}_${formGasto.archivo.name}`);
        await uploadBytes(archivoRef, formGasto.archivo);
        comprobanteUrl = await getDownloadURL(archivoRef);
      }

      const nuevoGasto = {
        monto: Number(formGasto.monto),
        categoria: formGasto.categoria,
        observacion: formGasto.observacion,
        comprobante: comprobanteUrl,
        fecha: Timestamp.now(),
        proyectoId: proyectoId,
      };

      const docRef = await addDoc(collection(db, 'gastos'), nuevoGasto);
      
      // Agregar el gasto a la lista local
      setGastos(prev => [...prev, { id: docRef.id, ...nuevoGasto }]);
      
      // Resetear formulario y cerrar modal
      setFormGasto({ monto: '', categoria: '', observacion: '', archivo: null });
      setMostrarModalGasto(false);
      
      console.log('✅ Gasto agregado correctamente');
    } catch (error) {
      console.error('❌ Error al agregar gasto:', error);
      alert('Error al agregar gasto. Por favor intenta de nuevo.');
    } finally {
      setLoadingGasto(false);
    }
  };

  // Calcular métricas financieras
  const calcularMetricas = () => {
    const costoTotal = gastos.reduce((total, gasto) => total + (gasto.monto || 0), 0);
    const venta = parseFloat(valorVenta) || 0;
    const utilidad = venta - costoTotal;
    const porcentajeUtilidad = venta > 0 ? ((utilidad / venta) * 100) : 0;
    
    return { costoTotal, venta, utilidad, porcentajeUtilidad };
  };

  // Agrupar gastos por categoría para el gráfico
  const agruparGastosPorCategoria = () => {
    const categoriasAgrupadas = {};
    gastos.forEach(gasto => {
      const categoria = gasto.categoria || 'Sin categoría';
      categoriasAgrupadas[categoria] = (categoriasAgrupadas[categoria] || 0) + (gasto.monto || 0);
    });
    return categoriasAgrupadas;
  };

  // Formatear moneda
  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad);
  };

  // Obtener color para estados
  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'En Progreso': return '#3498db';
      case 'Completado': return '#27ae60';
      case 'Planificación': return '#f39c12';
      case 'Pausado': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="proyecto-detalle">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="proyecto-detalle">
        <div className="error-container">
          <h2>❌ Proyecto no encontrado</h2>
          <button onClick={volverAtras} className="btn-volver">
            ← Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

  const metricas = calcularMetricas();
  const categoriasGastos = agruparGastosPorCategoria();
  const progreso = proyecto.progreso || (proyecto.estado === 'Completado' ? 100 : 
                   proyecto.estado === 'En Progreso' ? 50 : 25);

  return (
    <div className="proyecto-detalle">
      {/* Header del proyecto */}
      <div className="proyecto-header">
        <div className="header-navegacion">
          <button onClick={volverAtras} className="btn-volver">
            ← Volver a Proyectos
          </button>
        </div>
        
        <div className="header-info">
          <h1>{proyecto.nombre}</h1>
          <div className="proyecto-meta">
            <span 
              className="estado-badge"
              style={{ backgroundColor: obtenerColorEstado(proyecto.estado) }}
            >
              {proyecto.estado || 'Planificación'}
            </span>
            <span className="proyecto-tipo">{proyecto.tipo || 'Industrial'}</span>
            <span className="proyecto-fecha">
              Creado: {proyecto.fecha_creacion?.toDate?.()?.toLocaleDateString() || 'N/A'}
            </span>
          </div>
          <p className="proyecto-descripcion">{proyecto.descripcion || 'Sin descripción'}</p>
          
          {/* Información de la empresa */}
          {(proyecto.nombreEmpresa || proyecto.rutEmpresa) && (
            <div className="info-empresa">
              <h3>🏢 Información de la Empresa</h3>
              <div className="empresa-detalles">
                {proyecto.nombreEmpresa && (
                  <div className="empresa-dato">
                    <strong>Empresa:</strong> {proyecto.nombreEmpresa}
                  </div>
                )}
                {proyecto.rutEmpresa && (
                  <div className="empresa-dato">
                    <strong>RUT:</strong> {proyecto.rutEmpresa}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Orden de compra */}
          {proyecto.ordenCompra && (
            <div className="orden-compra">
              <h3>📋 Orden de Compra</h3>
              <div className="documento-info">
                <div className="documento-detalle">
                  <span className="documento-nombre">📎 {proyecto.ordenCompra.nombre}</span>
                  <span className="documento-tamaño">
                    ({(proyecto.ordenCompra.tamaño / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <a 
                  href={proyecto.ordenCompra.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-ver-documento"
                >
                  👁️ Ver Documento
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metricas-financieras">
        <div className="metrica-card venta">
          <div className="metrica-header">
            <h3>💰 Valor de Venta</h3>
            <button 
              className="btn-editar"
              onClick={() => setEditandoVenta(!editandoVenta)}
            >
              ✏️
            </button>
          </div>
          {editandoVenta ? (
            <div className="editar-venta">
              <input
                type="number"
                value={valorVenta}
                onChange={(e) => setValorVenta(e.target.value)}
                className="input-venta"
                placeholder="Valor de venta"
              />
              <div className="botones-edicion">
                <button onClick={actualizarValorVenta} className="btn-guardar">✅</button>
                <button onClick={() => setEditandoVenta(false)} className="btn-cancelar">❌</button>
              </div>
            </div>
          ) : (
            <div className="metrica-valor">{formatearMoneda(metricas.venta)}</div>
          )}
        </div>

        <div className="metrica-card costo">
          <h3>📊 Costo Total</h3>
          <div className="metrica-valor">{formatearMoneda(metricas.costoTotal)}</div>
          <div className="metrica-detalle">{gastos.length} gastos registrados</div>
        </div>

        <div className="metrica-card utilidad">
          <h3>💎 Utilidad</h3>
          <div className={`metrica-valor ${metricas.utilidad >= 0 ? 'positiva' : 'negativa'}`}>
            {formatearMoneda(metricas.utilidad)}
          </div>
          <div className="metrica-detalle">
            {metricas.porcentajeUtilidad.toFixed(1)}% de margen
          </div>
        </div>

        <div className="metrica-card progreso">
          <h3>⚡ Progreso</h3>
          <div className="progreso-circular">
            <div className="progreso-numero">{progreso}%</div>
            <div className="progreso-barra">
              <div 
                className="progreso-fill"
                style={{ 
                  width: `${progreso}%`,
                  backgroundColor: obtenerColorEstado(proyecto.estado)
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="proyecto-contenido">
        {/* Gráfico de gastos por categoría */}
        <div className="seccion-grafico">
          <h2>📈 Distribución de Gastos</h2>
          {Object.keys(categoriasGastos).length > 0 ? (
            <div className="grafico-container">
              <div className="grafico-torta">
                {Object.entries(categoriasGastos).map(([categoria, monto], index) => {
                  const porcentaje = (monto / metricas.costoTotal) * 100;
                  const colores = ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'];
                  return (
                    <div 
                      key={categoria} 
                      className="segmento-torta"
                      style={{ 
                        '--porcentaje': `${porcentaje}%`,
                        '--color': colores[index % colores.length]
                      }}
                    >
                      <div className="segmento-info">
                        <span className="categoria-nombre">{categoria}</span>
                        <span className="categoria-monto">{formatearMoneda(monto)}</span>
                        <span className="categoria-porcentaje">{porcentaje.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="leyenda-grafico">
                {Object.entries(categoriasGastos).map(([categoria, monto], index) => {
                  const colores = ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'];
                  return (
                    <div key={categoria} className="leyenda-item">
                      <div 
                        className="color-indicador"
                        style={{ backgroundColor: colores[index % colores.length] }}
                      ></div>
                      <span className="leyenda-texto">
                        {categoria}: {formatearMoneda(monto)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="estado-vacio">
              <div className="vacio-icon">📊</div>
              <h4>Sin gastos registrados</h4>
              <p>Los gastos aparecerán aquí cuando agregues algunos al proyecto</p>
            </div>
          )}
        </div>

        {/* Lista detallada de gastos */}
        <div className="seccion-gastos">
          <h2>💸 Gastos Detallados</h2>
          {gastos.length > 0 ? (
            <div className="gastos-tabla">
              <div className="tabla-header">
                <div>Fecha</div>
                <div>Categoría</div>
                <div>Monto</div>
                <div>Observación</div>
              </div>
              {gastos.map(gasto => (
                <div key={gasto.id} className="tabla-fila">
                  <div className="gasto-fecha">
                    {gasto.fecha?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </div>
                  <div className="gasto-categoria">
                    <span className="categoria-tag">{gasto.categoria || 'Sin categoría'}</span>
                  </div>
                  <div className="gasto-monto">
                    {formatearMoneda(gasto.monto || 0)}
                  </div>
                  <div className="gasto-observacion">
                    {gasto.observacion || 'Sin observación'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="estado-vacio">
              <div className="vacio-icon">💸</div>
              <h4>Sin gastos registrados</h4>
              <p>Agrega gastos para ver el análisis detallado del proyecto</p>
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="acciones-proyecto">
        <button 
          className="accion-btn agregar-gasto"
          onClick={() => setMostrarModalGasto(true)}
        >
          ➕ Agregar Gasto
        </button>
        <button className="accion-btn editar-proyecto">
          ✏️ Editar Proyecto
        </button>
        <button className="accion-btn generar-reporte">
          📊 Generar Reporte
        </button>
      </div>

      {/* Modal para agregar gasto */}
      {mostrarModalGasto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <div className="modal-header">
              <h3>💰 Agregar Gasto al Proyecto</h3>
              <button 
                className="btn-cerrar-modal"
                onClick={() => setMostrarModalGasto(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={agregarGasto} className="form-gasto">
              <div className="form-grupo">
                <label htmlFor="monto">Monto (CLP):</label>
                <input 
                  type="number" 
                  id="monto"
                  name="monto" 
                  placeholder="15000" 
                  value={formGasto.monto} 
                  onChange={handleGastoChange} 
                  required 
                  disabled={loadingGasto}
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="form-grupo">
                <label htmlFor="categoria">Categoría:</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formGasto.categoria}
                  onChange={handleGastoChange}
                  required
                  disabled={loadingGasto}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-grupo">
                <label htmlFor="observacion">Descripción del Gasto:</label>
                <textarea
                  id="observacion"
                  name="observacion" 
                  placeholder="Ej: Pernos hexagonales M8x20 para estructura principal..."
                  value={formGasto.observacion} 
                  onChange={handleGastoChange}
                  disabled={loadingGasto}
                  rows="3"
                />
              </div>
              
              <div className="form-grupo">
                <label htmlFor="archivo">Comprobante (Factura/Boleta):</label>
                <input 
                  type="file" 
                  id="archivo"
                  onChange={handleFileChange}
                  disabled={loadingGasto}
                  accept="image/*,.pdf"
                />
                <small>Formatos aceptados: Imágenes y PDF</small>
              </div>
              
              <div className="modal-acciones">
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={() => setMostrarModalGasto(false)}
                  disabled={loadingGasto}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-guardar"
                  disabled={loadingGasto}
                >
                  {loadingGasto ? '⏳ Guardando...' : '💾 Agregar Gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle; 