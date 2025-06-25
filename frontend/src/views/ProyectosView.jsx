import React, { useState } from 'react';
import ListaProyectos from '../components/ListaProyectos';
import CrearProyecto from '../components/CrearProyecto';
import ProyectoDetalle from './ProyectoDetalle';
import './ProyectosView.css';

function ProyectosView() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const handleProyectoCreado = () => {
    setMostrarFormulario(false);
    // Aquí podrías agregar lógica adicional si es necesario
  };

  const handleVerDetalle = (proyectoId) => {
    setProyectoSeleccionado(proyectoId);
  };

  const volverALista = () => {
    setProyectoSeleccionado(null);
  };

  // Si hay un proyecto seleccionado, mostrar su detalle
  if (proyectoSeleccionado) {
    return (
      <ProyectoDetalle 
        proyectoId={proyectoSeleccionado}
        volverAtras={volverALista}
      />
    );
  }

  return (
    <div className="proyectos-view">
      <div className="proyectos-header">
        <div className="header-content">
          <h1>🏗️ Gestión de Proyectos</h1>
          <p>Administra todos tus proyectos industriales desde un solo lugar</p>
        </div>
        <button 
          className="crear-proyecto-btn"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Proyecto'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-container">
          <div className="formulario-wrapper">
            <h3>Crear Nuevo Proyecto</h3>
            <CrearProyecto onProyectoCreado={handleProyectoCreado} />
          </div>
        </div>
      )}

      <div className="lista-container">
        <ListaProyectos onVerDetalle={handleVerDetalle} />
      </div>
    </div>
  );
}

export default ProyectosView; 