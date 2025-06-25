// src/components/PanelProyectos.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function PanelProyectos() {
const [proyectos, setProyectos] = useState([]);
const [gastos, setGastos] = useState({});
const [proyectoActivo, setProyectoActivo] = useState(null);

useEffect(() => {
const fetchProyectos = async () => {
    const snapshot = await getDocs(collection(db, 'proyectos'));
    const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProyectos(datos);
};
fetchProyectos();
}, []);

const cargarGastos = async (proyectoId) => {
setProyectoActivo(proyectoId);

const q = query(collection(db, 'gastos'), where('proyectoId', '==', proyectoId));
const snapshot = await getDocs(q);
const datos = snapshot.docs.map(doc => doc.data());

setGastos(prev => ({ ...prev, [proyectoId]: datos }));
};

return (
<div>
    <h2>Proyectos</h2>
    <ul>
    {proyectos.map(p => (
        <li key={p.id}>
        <strong>{p.nombre}</strong> – {p.descripcion}
        <button onClick={() => cargarGastos(p.id)}>Ver gastos</button>

        {proyectoActivo === p.id && gastos[p.id] && (
            <ul style={{ marginTop: '1rem' }}>
            {gastos[p.id].map((g, i) => (
                <li key={i}>
                💸 <strong>{g.monto} CLP</strong> – {g.categoria} <br />
                📝 {g.observacion} <br />
                📎 <a href={g.comprobante} target="_blank" rel="noreferrer">Ver comprobante</a>
                </li>
            ))}
            <p><strong>Total:</strong> {
                gastos[p.id].reduce((acc, g) => acc + Number(g.monto), 0)
            } CLP</p>
            </ul>
        )}
        </li>
    ))}
    </ul>
</div>
);
}

export default PanelProyectos;
