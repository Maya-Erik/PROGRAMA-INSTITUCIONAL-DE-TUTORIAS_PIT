import { useState, useEffect } from 'react';
import './AdminAvisos.css';

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string;
  enlace: string;
  color: string;
}

const AdminAvisos = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagen: '',
    enlace: '',
    color: '#003DA5'
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const coloresDisponibles = ['#003DA5', '#001F54', '#D6A600', '#4A4A4A'];

  useEffect(() => {
    const avisosGuardados = localStorage.getItem('avisos');
    if (avisosGuardados) {
      setAvisos(JSON.parse(avisosGuardados));
    } else {
      const avisosIniciales = [
        { id: 1, titulo: "Bienvenidos al PIT", contenido: "El Programa Institucional de Tutorías está aquí para apoyarte", imagen: "", enlace: "", color: "#003DA5" },
        { id: 2, titulo: "Nuevos Horarios", contenido: "Consulta los horarios disponibles para tutorías", imagen: "", enlace: "", color: "#D6A600" },
      ];
      setAvisos(avisosIniciales);
      localStorage.setItem('avisos', JSON.stringify(avisosIniciales));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editandoId) {
      const nuevosAvisos = avisos.map((aviso) => 
        aviso.id === editandoId ? { ...formData, id: editandoId } : aviso
      );
      setAvisos(nuevosAvisos);
      localStorage.setItem('avisos', JSON.stringify(nuevosAvisos));
      setEditandoId(null);
    } else {
      const nuevoAviso = { ...formData, id: Date.now() };
      const nuevosAvisos = [...avisos, nuevoAviso];
      setAvisos(nuevosAvisos);
      localStorage.setItem('avisos', JSON.stringify(nuevosAvisos));
    }
    setFormData({ titulo: '', contenido: '', imagen: '', enlace: '', color: '#003DA5' });
  };

  const handleEdit = (aviso: Aviso) => {
    setFormData(aviso);
    setEditandoId(aviso.id);
  };

  const handleDelete = (id: number) => {
    const nuevosAvisos = avisos.filter((aviso) => aviso.id !== id);
    setAvisos(nuevosAvisos);
    localStorage.setItem('avisos', JSON.stringify(nuevosAvisos));
  };

  return (
    <div className="admin-container">
      <h1>Administrador de Avisos</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} required />
        <textarea name="contenido" placeholder="Contenido" value={formData.contenido} onChange={handleChange} required />
        <input type="text" name="imagen" placeholder="URL de imagen" value={formData.imagen} onChange={handleChange} />
        <input type="text" name="enlace" placeholder="URL de enlace" value={formData.enlace} onChange={handleChange} />
        <div>
          {coloresDisponibles.map((color) => (
            <button key={color} type="button" style={{ backgroundColor: color, width: 30, height: 30 }} onClick={() => setFormData({ ...formData, color })} />
          ))}
        </div>
        <button type="submit">Guardar</button>
        {editandoId && <button type="button" onClick={() => { setEditandoId(null); setFormData({ titulo: '', contenido: '', imagen: '', enlace: '', color: '#003DA5' }); }}>Cancelar</button>}
      </form>
      <div>
        <h2>Avisos</h2>
        {avisos.map((aviso) => (  // ← Eliminado "idx" aquí
          <div key={aviso.id}>
            <h3>{aviso.titulo}</h3>
            <p>{aviso.contenido}</p>
            <button onClick={() => handleEdit(aviso)}>Editar</button>
            <button onClick={() => handleDelete(aviso.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAvisos;