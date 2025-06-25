import React from 'react';
import './Sidebar.css';

function Sidebar({ vistaActual, cambiarVista, isOpen, closeMobile }) {
  const menuItems = [
    {
      id: 'dashboard',
      icon: '📊',
      titulo: 'Dashboard',
      descripcion: 'Resumen ejecutivo'
    },
    {
      id: 'proyectos',
      icon: '🏗️',
      titulo: 'Proyectos',
      descripcion: 'Gestión de proyectos'
    },
    {
      id: 'gastos',
      icon: '💰',
      titulo: 'Gastos',
      descripcion: 'Control de gastos'
    },
    {
      id: 'reportes',
      icon: '📈',
      titulo: 'Reportes',
      descripcion: 'Análisis y métricas'
    },
    {
      id: 'configuracion',
      icon: '⚙️',
      titulo: 'Configuración',
      descripcion: 'Ajustes de la app'
    }
  ];

  const handleNavClick = (vista) => {
    cambiarVista(vista);
    if (closeMobile) {
      closeMobile();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">🏭</div>
          <div className="logo-text">
            <h3>Control de Proyectos</h3>
            <p>Sistema Industrial</p>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">NAVEGACIÓN</h4>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-button ${vistaActual === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <div className="nav-icon">{item.icon}</div>
                  <div className="nav-content">
                    <span className="nav-title">{item.titulo}</span>
                    <span className="nav-description">{item.descripcion}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer del Sidebar */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <span className="user-name">Usuario Industrial</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
        
        <div className="sidebar-actions">
          <button className="action-button" title="Ayuda">
            ❓
          </button>
          <button className="action-button" title="Notificaciones">
            🔔
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 