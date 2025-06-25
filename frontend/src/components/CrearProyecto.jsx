// src/components/CrearProyecto.jsx
import React, { useState } from 'react';
import { crearProyecto } from '../services/firebase';

function CrearProyecto({ onProyectoCreado }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    nombreEmpresa: '',
    rutEmpresa: '',
    ordenCompra: null,
    estado: 'en curso'
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo (PDF, DOC, DOCX, etc.)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setForm({ ...form, ordenCompra: file });
      } else {
        alert('⚠️ Tipo de archivo no permitido. Solo se aceptan PDF, DOC, DOCX, JPG, PNG');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const id = await crearProyecto(form);
      alert(`✅ Proyecto creado exitosamente con ID: ${id}`);
      onProyectoCreado(id);
      setForm({ 
        nombre: '', 
        descripcion: '', 
        nombreEmpresa: '', 
        rutEmpresa: '', 
        ordenCompra: null,
        estado: 'en curso' 
      });
      // Limpiar el input de archivo
      const fileInput = document.getElementById('ordenCompra');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error al guardar proyecto:', err);
      alert('❌ Error al crear proyecto. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>📝 Crear Nuevo Proyecto</h2>
        
        <div>
          <label htmlFor="nombre">Nombre del Proyecto:</label>
          <input 
            id="nombre"
            name="nombre" 
            placeholder="Ej: Diseño de Puente Industrial XYZ" 
            value={form.nombre} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion" 
            placeholder="Describe brevemente el alcance del proyecto..."
            value={form.descripcion} 
            onChange={handleChange} 
            required
            disabled={loading}
            rows="3"
          />
        </div>
        
        <div>
          <label htmlFor="nombreEmpresa">Nombre Empresa:</label>
          <input 
            id="nombreEmpresa"
            name="nombreEmpresa" 
            placeholder="Ej: Constructora ABC S.A." 
            value={form.nombreEmpresa} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="rutEmpresa">RUT Empresa:</label>
          <input 
            id="rutEmpresa"
            name="rutEmpresa" 
            placeholder="Ej: 12.345.678-9" 
            value={form.rutEmpresa} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="ordenCompra">Orden de Compra:</label>
          <input 
            id="ordenCompra"
            name="ordenCompra" 
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange} 
            disabled={loading}
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            📎 Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. tamaño recomendado: 10MB)
          </small>
          {form.ordenCompra && (
            <div style={{ marginTop: '5px', color: '#28a745' }}>
              ✅ Archivo seleccionado: {form.ordenCompra.name}
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="estado">Estado del Proyecto:</label>
          <select 
            id="estado"
            name="estado" 
            value={form.estado} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="en curso">🟡 En curso</option>
            <option value="finalizado">✅ Finalizado</option>
            <option value="en pausa">⏸️ En pausa</option>
            <option value="pendiente">⏳ Pendiente</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Creando...' : '🚀 Crear Proyecto'}
        </button>
      </form>
    </div>
  );
}

export default CrearProyecto;
