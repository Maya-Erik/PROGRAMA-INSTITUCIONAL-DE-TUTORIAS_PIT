import { useState, useEffect } from 'react';
import { 
    obtenerAvisosAdmin, crearAviso, actualizarAviso, 
    eliminarAviso, actualizarOrdenAvisos 
} from '../../services/api';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import Sidebar from '../../components/Sidebar/Sidebar';
import SidebarToggle from '../../components/Sidebar/SidebarToggle';
import './AdminAvisos.css';

interface Aviso {
  id_aviso: number;
  titulo: string;
  contenido: string;
  imagen: string;
  enlace: string;
  color: string;
  orden: number;
  activo: boolean;
}

const AdminAvisos = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagen: '',
    enlace: '',
    color: '#003DA5',
    orden: 0
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const coloresDisponibles = ['#003DA5', '#001F54', '#D6A600', '#4A4A4A'];

  const cargarAvisos = async () => {
    setLoading(true);
    try {
      const data = await obtenerAvisosAdmin();
      if (data.success) {
        setAvisos(data.avisos || []);
      }
    } catch (error) {
      console.error('Error al cargar avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAvisos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.contenido) {
      alert('Título y contenido son obligatorios');
      return;
    }

    try {
      let result;
      if (editandoId) {
        result = await actualizarAviso(editandoId, formData);
      } else {
        result = await crearAviso(formData);
      }
      
      if (result.success) {
        alert(`Aviso ${editandoId ? 'actualizado' : 'creado'} correctamente`);
        setFormData({ titulo: '', contenido: '', imagen: '', enlace: '', color: '#003DA5', orden: 0 });
        setEditandoId(null);
        cargarAvisos();
      } else {
        alert(result.error || 'Error al guardar aviso');
      }
    } catch (error) {
      alert('Error al guardar aviso');
    }
  };

  const handleEdit = (aviso: Aviso) => {
    setFormData({
      titulo: aviso.titulo,
      contenido: aviso.contenido,
      imagen: aviso.imagen || '',
      enlace: aviso.enlace || '',
      color: aviso.color,
      orden: aviso.orden
    });
    setEditandoId(aviso.id_aviso);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este aviso?')) {
      try {
        const result = await eliminarAviso(id);
        if (result.success) {
          alert('Aviso eliminado correctamente');
          cargarAvisos();
        } else {
          alert(result.error || 'Error al eliminar aviso');
        }
      } catch (error) {
        alert('Error al eliminar aviso');
      }
    }
  };

  const moverArriba = async (posicion: number) => {
    if (posicion === 0) return;
    const nuevosAvisos = [...avisos];
    [nuevosAvisos[posicion], nuevosAvisos[posicion - 1]] = [nuevosAvisos[posicion - 1], nuevosAvisos[posicion]];
    setAvisos(nuevosAvisos);
    
    const ordenActualizado = nuevosAvisos.map((aviso, idx) => ({ id_aviso: aviso.id_aviso, orden: idx }));
    await actualizarOrdenAvisos(ordenActualizado);
  };

  const moverAbajo = async (posicion: number) => {
    if (posicion === avisos.length - 1) return;
    const nuevosAvisos = [...avisos];
    [nuevosAvisos[posicion], nuevosAvisos[posicion + 1]] = [nuevosAvisos[posicion + 1], nuevosAvisos[posicion]];
    setAvisos(nuevosAvisos);
    
    const ordenActualizado = nuevosAvisos.map((aviso, idx) => ({ id_aviso: aviso.id_aviso, orden: idx }));
    await actualizarOrdenAvisos(ordenActualizado);
  };

  if (loading) {
    return (
      <div className="admin-citas-container">
        <Sidebar userRole="admin" />
        <main className="admin-container">
          <div>Cargando avisos...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-citas-container">
      <Sidebar userRole="admin" />
      <SidebarToggle />
      <main className="admin-container">
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
                setFormData({ titulo: '', contenido: '', imagen: '', enlace: '', color: '#003DA5', orden: 0 });
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
              <div key={aviso.id_aviso} className="aviso-item">
                <div className="aviso-info">
                  <div className="aviso-preview" style={{ backgroundColor: aviso.color }}>
                    <span className="preview-numero">{posicion + 1}</span>
                  </div>
                  <div className="aviso-detalles">
                    <h3 className="item-titulo">{aviso.titulo}</h3>
                    <p className="item-contenido">{aviso.contenido}</p>
                    {aviso.imagen && (
                      <span className="item-imagen-text">
                        <ImageIcon fontSize="small" /> Con imagen
                      </span>
                    )}
                    {aviso.enlace && (
                      <span className="item-enlace-text">
                        <LinkIcon fontSize="small" /> Con enlace
                      </span>
                    )}
                  </div>
                </div>
                <div className="aviso-acciones">
                  <button onClick={() => moverArriba(posicion)} className="btn-mover" disabled={posicion === 0}>
                    <ArrowUpwardIcon fontSize="small" />
                  </button>
                  <button onClick={() => moverAbajo(posicion)} className="btn-mover" disabled={posicion === avisos.length - 1}>
                    <ArrowDownwardIcon fontSize="small" />
                  </button>
                  <button onClick={() => handleEdit(aviso)} className="btn-editar">
                    <EditIcon fontSize="small" /> Editar
                  </button>
                  <button onClick={() => handleDelete(aviso.id_aviso)} className="btn-eliminar">
                    <DeleteIcon fontSize="small" /> Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAvisos;