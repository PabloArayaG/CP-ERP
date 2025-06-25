import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // ya funciona porque App ahora sí está exportado

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
