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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.contenido) {
      alert('Título y contenido son obligatorios');
      return;
    }

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
    setFormData({
      titulo: aviso.titulo,
      contenido: aviso.contenido,
      imagen: aviso.imagen || '',
      enlace: aviso.enlace || '',
      color: aviso.color
    });
    setEditandoId(aviso.id);
  };

  const handleDelete = (id: number) => {
    const nuevosAvisos = avisos.filter((aviso) => aviso.id !== id);
    setAvisos(nuevosAvisos);
    localStorage.setItem('avisos', JSON.stringify(nuevosAvisos));
  };

  const moverArriba = (posicion: number) => {
    if (posicion === 0) return;
    const nuevosAvisos = [...avisos];
    [nuevosAvisos[posicion], nuevosAvisos[posicion - 1]] = [nuevosAvisos[posicion - 1], nuevosAvisos[posicion]];
    setAvisos(nuevosAvisos);
    localStorage.setItem('avisos', JSON.stringify(nuevosAvisos));
  };

  const moverAbajo = (posicion: number) => {
    if (posicion === avisos.length - 1) return;
    const nuevosAvisos = [...avisos];
    [nuevosAvisos[posicion], nuevosAvisos[posicion + 1]] = [nuevosAvisos[posicion + 1], nuevosAvisos[posicion]];
    setAvisos(nuevosAvisos);
    localStorage.setItem('avisos', JSON.stringify(nuevosAvisos));
  };

  return (
    <div className="admin-container">
      <h1 className="admin-titulo">Administrador de Avisos</h1>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="titulo"
          placeholder="Título del aviso *"
          value={formData.titulo}
          onChange={handleChange}
          className="form-input"
          required
        />
        <textarea
          name="contenido"
          placeholder="Contenido del aviso *"
          value={formData.contenido}
          onChange={handleChange}
          className="form-textarea"
          required
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de la imagen (opcional)"
          value={formData.imagen}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="enlace"
          placeholder="URL del enlace (opcional)"
          value={formData.enlace}
          onChange={handleChange}
          className="form-input"
        />
        
        <div className="campo-color">
          <label className="color-label">Color de fondo:</label>
          <div className="colores-opciones">
            {coloresDisponibles.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-opcion ${formData.color === color ? 'seleccionado' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-guardar">
            {editandoId ? 'Actualizar' : 'Guardar'} Aviso
          </button>
          {editandoId && (
            <button type="button" onClick={() => {
              setEditandoId(null);
              setFormData({ titulo: '', contenido: '', imagen: '', enlace: '', color: '#003DA5' });
            }} className="btn-cancelar">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="avisos-lista">
        <h2 className="lista-titulo">Avisos del Carrusel</h2>
        <p className="lista-subtitulo">Ordena los avisos y agrega su contenido</p>
        
        {avisos.length === 0 ? (
          <p className="sin-avisos">No hay avisos creados</p>
        ) : (
          avisos.map((aviso, posicion) => (
            <div key={aviso.id} className="aviso-item">
              <div className="aviso-info">
                <div className="aviso-preview" style={{ backgroundColor: aviso.color }}>
                  <span className="preview-numero">{posicion + 1}</span>
                </div>
                <div className="aviso-detalles">
                  <h3 className="item-titulo">{aviso.titulo}</h3>
                  <p className="item-contenido">{aviso.contenido}</p>
                  {aviso.imagen && <span className="item-imagen-text">🖼️ Con imagen</span>}
                  {aviso.enlace && <span className="item-enlace-text">🔗 Con enlace</span>}
                </div>
              </div>
              <div className="aviso-acciones">
                <button onClick={() => moverArriba(posicion)} className="btn-mover" disabled={posicion === 0}>
                  ↑
                </button>
                <button onClick={() => moverAbajo(posicion)} className="btn-mover" disabled={posicion === avisos.length - 1}>
                  ↓
                </button>
                <button onClick={() => handleEdit(aviso)} className="btn-editar">
                  Editar
                </button>
                <button onClick={() => handleDelete(aviso.id)} className="btn-eliminar">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAvisos;