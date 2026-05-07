// AdminAvisos.tsx - Corregido
import { useState } from 'react';
import './AdminAvisos.css';

// Definir tipos
interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string;
  color: string;
}

interface FormData {
  titulo: string;
  contenido: string;
  imagen: string;
  color: string;
}

const AdminAvisos = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([
    { id: 1, titulo: "", contenido: "", imagen: "", color: "#003DA6" },
    { id: 2, titulo: "", contenido: "", imagen: "", color: "#001F54" },
    { id: 3, titulo: "", contenido: "", imagen: "", color: "#D6A600" },
  ]);
  
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    contenido: '',
    imagen: '',
    color: '#003DA6'
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const coloresDisponibles = ['#003DA6', '#001F54', '#D6A600', '#4A4A4A'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editandoId) {
      setAvisos(avisos.map((aviso) => 
        aviso.id === editandoId ? { ...formData, id: editandoId } : aviso
      ));
      setEditandoId(null);
    } else {
      setAvisos([...avisos, { ...formData, id: Date.now() }]);
    }
    setFormData({ titulo: '', contenido: '', imagen: '', color: '#003DA6' });
  };

  const handleEdit = (aviso: Aviso) => {
    setFormData(aviso);
    setEditandoId(aviso.id);
  };

  const handleDelete = (id: number) => {
    setAvisos(avisos.filter((aviso) => aviso.id !== id));
  };

  const moverArriba = (posicion: number) => {
    if (posicion === 0) return;
    const nuevosAvisos = [...avisos];
    [nuevosAvisos[posicion], nuevosAvisos[posicion - 1]] = [nuevosAvisos[posicion - 1], nuevosAvisos[posicion]];
    setAvisos(nuevosAvisos);
  };

  const moverAbajo = (posicion: number) => {
    if (posicion === avisos.length - 1) return;
    const nuevosAvisos = [...avisos];
    [nuevosAvisos[posicion], nuevosAvisos[posicion + 1]] = [nuevosAvisos[posicion + 1], nuevosAvisos[posicion]];
    setAvisos(nuevosAvisos);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-titulo">Administrador de Avisos</h1>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="titulo"
          placeholder="Título del aviso"
          value={formData.titulo}
          onChange={handleChange}
          className="form-input"
        />
        <textarea
          name="contenido"
          placeholder="Contenido del aviso"
          value={formData.contenido}
          onChange={handleChange}
          className="form-textarea"
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de la imagen (opcional)"
          value={formData.imagen}
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
              setFormData({ titulo: '', contenido: '', imagen: '', color: '#003DA6' });
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
                  <h3 className="item-titulo">{aviso.titulo || "Sin título"}</h3>
                  <p className="item-contenido">{aviso.contenido || "Sin contenido"}</p>
                  {aviso.imagen && <span className="item-imagen-text">📷 Con imagen</span>}
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