import React, { useState } from 'react';
import AgregarGasto from '../components/AgregarGasto';
import PanelProyectos from '../components/PanelProyectos';
import './GastosView.css';

function GastosView() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleGastoAgregado = () => {
    setMostrarFormulario(false);
    // Aquí podrías agregar lógica adicional si es necesario
  };

  return (
    <div className="gastos-view">
      <div className="gastos-header">
        <div className="header-content">
          <h1>💰 Gestión de Gastos</h1>
          <p>Controla y administra todos los gastos de tus proyectos industriales</p>
        </div>
        <button 
          className="agregar-gasto-btn"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Gasto'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-container">
          <div className="formulario-wrapper">
            <h3>Agregar Nuevo Gasto</h3>
            <AgregarGasto onGastoAgregado={handleGastoAgregado} />
          </div>
        </div>
      )}

      <div className="panel-container">
        <PanelProyectos />
      </div>
    </div>
  );
}

export default GastosView; 