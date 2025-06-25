import React, { useState } from 'react';
import { db, storage } from '../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AgregarGasto({ proyectoId, onGastoAgregado }) {
  const [form, setForm] = useState({
    monto: '',
    categoria: '',
    observacion: '',
    archivo: null,
  });
  
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, archivo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let comprobanteUrl = '';
      if (form.archivo) {
        const archivoRef = ref(storage, `comprobantes/${Date.now()}_${form.archivo.name}`);
        await uploadBytes(archivoRef, form.archivo);
        comprobanteUrl = await getDownloadURL(archivoRef);
      }

      const nuevoGasto = {
        monto: Number(form.monto),
        categoria: form.categoria,
        observacion: form.observacion,
        comprobante: comprobanteUrl,
        fecha: Timestamp.now(),
        proyectoId: proyectoId,
      };

      await addDoc(collection(db, 'gastos'), nuevoGasto);
      alert('✅ Gasto agregado correctamente');
      setForm({ monto: '', categoria: '', observacion: '', archivo: null });
      onGastoAgregado();
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      alert('❌ Error al agregar gasto. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>💰 Agregar Gasto al Proyecto</h3>
        
        <div>
          <label htmlFor="monto">Monto (CLP):</label>
          <input 
            type="number" 
            id="monto"
            name="monto" 
            placeholder="15000" 
            value={form.monto} 
            onChange={handleChange} 
            required 
            disabled={loading}
            min="0"
            step="1"
          />
        </div>
        
        <div>
          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="observacion">Descripción del Gasto:</label>
          <textarea
            id="observacion"
            name="observacion" 
            placeholder="Ej: Pernos hexagonales M8x20 para estructura principal..."
            value={form.observacion} 
            onChange={handleChange}
            disabled={loading}
            rows="3"
          />
        </div>
        
        <div>
          <label htmlFor="archivo">Comprobante (Factura/Boleta):</label>
          <input 
            type="file" 
            id="archivo"
            onChange={handleFileChange}
            disabled={loading}
            accept="image/*,.pdf"
          />
          <small>Formatos aceptados: Imágenes y PDF</small>
        </div>
        
        <button type="submit" disabled={loading || !proyectoId}>
          {loading ? '⏳ Guardando...' : '💾 Agregar Gasto'}
        </button>
        
        {!proyectoId && (
          <p style={{color: '#e74c3c', fontStyle: 'italic'}}>
            ⚠️ Primero selecciona o crea un proyecto
          </p>
        )}
      </form>
    </div>
  );
}

export default AgregarGasto;
