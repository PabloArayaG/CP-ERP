import React, { useState } from 'react';
import './App.css';

// Importar las views (páginas)
import Dashboard from './views/Dashboard';
import ProyectosView from './views/ProyectosView';
import GastosView from './views/GastosView';
import ReportesView from './views/ReportesView';
import ConfiguracionView from './views/ConfiguracionView';

// Importar el Sidebar y componentes móviles
import Sidebar from './components/Sidebar';
import MobileMenuButton from './components/MobileMenuButton';

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cambiarVista = (vista) => {
    setVistaActual(vista);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const renderizarVista = () => {
    switch(vistaActual) {
      case 'dashboard':
        return <Dashboard cambiarVista={cambiarVista} />;
      case 'proyectos':
        return <ProyectosView />;
      case 'gastos':
        return <GastosView />;
      case 'reportes':
        return <ReportesView />;
      case 'configuracion':
        return <ConfiguracionView />;
      default:
        return <Dashboard cambiarVista={cambiarVista} />;
    }
  };

  return (
    <div className="App">
      {/* Botón hamburguesa para móviles */}
      <MobileMenuButton toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />

      {/* Sidebar de Navegación */}
      <Sidebar 
        vistaActual={vistaActual} 
        cambiarVista={cambiarVista}
        isOpen={sidebarOpen}
        closeMobile={closeMobileSidebar}
      />

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Contenido Principal con margen para sidebar */}
      <main className={`main-content ${vistaActual === 'dashboard' ? 'dashboard-active' : ''} ${vistaActual === 'proyectos' ? 'proyectos-active' : ''} ${vistaActual === 'gastos' ? 'gastos-active' : ''} ${vistaActual === 'reportes' ? 'reportes-active' : ''} ${vistaActual === 'configuracion' ? 'configuracion-active' : ''}`}>
        {renderizarVista()}
      </main>
    </div>
  );
}

export default App;
