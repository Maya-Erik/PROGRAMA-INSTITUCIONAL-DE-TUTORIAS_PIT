
import { useState, useEffect } from 'react';
import { obtenerAvisos } from '../../services/api';
import './Avisos.css';

interface Aviso {
  id_aviso: number;
  titulo: string;
  contenido: string;
  imagen: string;
  enlace: string;
  color: string;
  orden: number;
}

const Avisos = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisoActual, setAvisoActual] = useState(0);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAvisos = async () => {
      try {
        const data = await obtenerAvisos();
        if (data.success) {
          setAvisos(data.avisos || []);
        }
      } catch (error) {
        console.error('Error al cargar avisos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarAvisos();
  }, []);

  useEffect(() => {
    if (avisos.length === 0) return;
    const timer = setTimeout(() => setMostrarCarrusel(true), 3000);
    return () => clearTimeout(timer);
  }, [avisos]);

  const cambiarAviso = (nuevoIndice: number) => {
    if (nuevoIndice >= 0 && nuevoIndice < avisos.length) {
      setAvisoActual(nuevoIndice);
    }
  };

  if (loading) {
    return (
      <div className="hero-contenido visible">
        <h1>Programa de Tutorias</h1>
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (avisos.length === 0) {
    return (
      <div className="hero-contenido visible">
        <h1>Programa de Tutorias</h1>
        <p>Impulsando tu exito academico con el apoyo de nuestra comunidad universitaria.</p>
        <div className="botones">
          <a href="/servicios" className="btn-comenzar">Comencemos</a>
          <a href="/sobre-nosotros" className="btn-info">Ver mas info</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`hero-contenido ${!mostrarCarrusel ? 'visible' : 'oculto'}`}>
        <h1>Programa de Tutorias</h1>
        <p>Impulsando tu exito academico con el apoyo de nuestra comunidad universitaria.</p>
        <div className="botones">
          <a href="/servicios" className="btn-comenzar">Comencemos</a>
          <a href="/sobre-nosotros" className="btn-info">Ver mas info</a>
        </div>
      </div>

      <div className={`carrusel-container ${mostrarCarrusel ? 'visible' : 'oculto'}`}>
        {avisos.length > 1 && (
          <button className="carrusel-btn carrusel-btn-prev" onClick={() => cambiarAviso(avisoActual - 1)}>
            ❮
          </button>
        )}

        <div className="carrusel-wrapper">
          <div className="carrusel-slides" style={{ transform: `translateX(-${avisoActual * 100}%)` }}>
            {avisos.map((aviso) => (
              <div key={aviso.id_aviso} className="carrusel-slide" style={{ backgroundColor: aviso.color }}>
                {aviso.enlace ? (
                  <a href={aviso.enlace} target="_blank" rel="noopener noreferrer" className="carrusel-link-full">
                    {aviso.imagen && (
                      <img src={aviso.imagen} alt={aviso.titulo} className="carrusel-imagen" />
                    )}
                  </a>
                ) : (
                  <>
                    {aviso.imagen && (
                      <img src={aviso.imagen} alt={aviso.titulo} className="carrusel-imagen" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {avisos.length > 1 && (
          <button className="carrusel-btn carrusel-btn-next" onClick={() => cambiarAviso(avisoActual + 1)}>
            ❯
          </button>
        )}

        {avisos.length > 1 && (
          <div className="carrusel-indicadores">
            {avisos.map((_, index) => (
              <button
                key={index}
                className={`indicador ${index === avisoActual ? 'activo' : ''}`}
                onClick={() => cambiarAviso(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Avisos;