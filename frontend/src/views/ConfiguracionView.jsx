import React, { useState } from 'react';
import './ConfiguracionView.css';

function ConfiguracionView() {
  const [configuracion, setConfiguracion] = useState({
    moneda: 'CLP',
    idioma: 'es',
    notificaciones: true,
    backup: false,
    tema: 'light'
  });

  const [guardando, setGuardando] = useState(false);

  const handleChange = (campo, valor) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardarConfiguracion = async () => {
    setGuardando(true);
    
    // Simular guardado en localStorage
    try {
      localStorage.setItem('configuracion-app', JSON.stringify(configuracion));
      
      setTimeout(() => {
        setGuardando(false);
        alert('✅ Configuración guardada correctamente');
      }, 1000);
      
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setGuardando(false);
      alert('❌ Error al guardar la configuración');
    }
  };

  const restaurarDefecto = () => {
    if (window.confirm('¿Estás seguro de restaurar la configuración por defecto?')) {
      setConfiguracion({
        moneda: 'CLP',
        idioma: 'es',
        notificaciones: true,
        backup: false,
        tema: 'light'
      });
    }
  };

  return (
    <div className="configuracion-view">
      <div className="configuracion-header">
        <div className="header-content">
          <h1>⚙️ Configuración</h1>
          <p>Personaliza la aplicación según tus preferencias</p>
        </div>
      </div>

      <div className="configuracion-container">
        {/* Configuración General */}
        <div className="config-section">
          <div className="section-header">
            <h2>🌐 Configuración General</h2>
          </div>
          
          <div className="config-grid">
            <div className="config-item">
              <label>Moneda Principal</label>
              <select 
                value={configuracion.moneda}
                onChange={(e) => handleChange('moneda', e.target.value)}
                className="config-select"
              >
                <option value="CLP">Peso Chileno (CLP)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="ARS">Peso Argentino (ARS)</option>
              </select>
            </div>

            <div className="config-item">
              <label>Idioma</label>
              <select 
                value={configuracion.idioma}
                onChange={(e) => handleChange('idioma', e.target.value)}
                className="config-select"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <div className="config-item">
              <label>Tema</label>
              <select 
                value={configuracion.tema}
                onChange={(e) => handleChange('tema', e.target.value)}
                className="config-select"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="config-section">
          <div className="section-header">
            <h2>🔔 Notificaciones</h2>
          </div>
          
          <div className="config-grid">
            <div className="config-toggle">
              <div className="toggle-info">
                <h4>Notificaciones Push</h4>
                <p>Recibe alertas sobre nuevos gastos y proyectos</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={configuracion.notificaciones}
                  onChange={(e) => handleChange('notificaciones', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="config-toggle">
              <div className="toggle-info">
                <h4>Backup Automático</h4>
                <p>Respalda automáticamente tus datos en la nube</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={configuracion.backup}
                  onChange={(e) => handleChange('backup', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Datos y Privacidad */}
        <div className="config-section">
          <div className="section-header">
            <h2>🔒 Datos y Privacidad</h2>
          </div>
          
          <div className="config-actions">
            <div className="action-item">
              <div className="action-info">
                <h4>Exportar Datos</h4>
                <p>Descarga todos tus datos en formato JSON</p>
              </div>
              <button className="action-btn export">
                📥 Exportar
              </button>
            </div>

            <div className="action-item">
              <div className="action-info">
                <h4>Eliminar Datos</h4>
                <p>Elimina permanentemente todos los datos</p>
              </div>
              <button className="action-btn danger">
                🗑️ Eliminar Todo
              </button>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="config-buttons">
          <button 
            className="btn-secondary"
            onClick={restaurarDefecto}
          >
            🔄 Restaurar por Defecto
          </button>
          
          <button 
            className="btn-primary"
            onClick={guardarConfiguracion}
            disabled={guardando}
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionView; 