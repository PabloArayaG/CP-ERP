import React from 'react';
import './MobileMenuButton.css';

function MobileMenuButton({ toggleSidebar, isOpen }) {
  return (
    <button 
      className={`mobile-menu-button ${isOpen ? 'open' : ''}`}
      onClick={toggleSidebar}
      aria-label="Toggle menu"
    >
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
    </button>
  );
}

export default MobileMenuButton; 