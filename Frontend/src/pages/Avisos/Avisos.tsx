import { useState, useEffect } from 'react';
import './Avisos.css';

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string;
  enlace: string;
  color: string;
}

const Avisos = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisoActual, setAvisoActual] = useState(0);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);

  // Cargar avisos desde localStorage
  useEffect(() => {
    const avisosGuardados = localStorage.getItem('avisos');
    if (avisosGuardados) {
      setAvisos(JSON.parse(avisosGuardados));
    } else {
      // Datos por defecto si no hay nada
      setAvisos([]);
    }
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

  // Si no hay avisos, mostrar solo el hero
  if (avisos.length === 0) {
    return (
      <div className="hero-contenido visible">
        <h1>Programa de Tutorías</h1>
        <p>Impulsando tu éxito académico con el apoyo de nuestra comunidad universitaria.</p>
        <div className="botones">
          <a href="/servicios" className="btn-comenzar">Comencemos</a>
          <a href="/sobre-nosotros" className="btn-info">Ver más info</a>
        </div>
      </div>
    );
  }

  const avisoActualData = avisos[avisoActual];

  return (
    <>
      {/* Hero con texto original */}
      <div className={`hero-contenido ${!mostrarCarrusel ? 'visible' : 'oculto'}`}>
        <h1>Programa de Tutorías</h1>
        <p>Impulsando tu éxito académico con el apoyo de nuestra comunidad universitaria.</p>
        <div className="botones">
          <a href="/servicios" className="btn-comenzar">Comencemos</a>
          <a href="/sobre-nosotros" className="btn-info">Ver más info</a>
        </div>
      </div>

      {/* Carrusel de avisos */}
      <div className={`carrusel-container ${mostrarCarrusel ? 'visible' : 'oculto'}`}>
        {avisos.length > 1 && (
          <button className="carrusel-btn carrusel-btn-prev" onClick={() => cambiarAviso(avisoActual - 1)}>
            ❮
          </button>
        )}

        <div className="carrusel-wrapper">
          <div className="carrusel-slides" style={{ transform: `translateX(-${avisoActual * 100}%)` }}>
            {avisos.map((aviso) => (
              <div key={aviso.id} className="carrusel-slide" style={{ backgroundColor: aviso.color }}>
                <div className="carrusel-contenido">
                  {aviso.imagen && (
                    <img src={aviso.imagen} alt={aviso.titulo} className="carrusel-imagen" />
                  )}
                  <div className="carrusel-texto">
                    <h2>{aviso.titulo}</h2>
                    <p>{aviso.contenido}</p>
                    {aviso.enlace && (
                      <a 
                        href={aviso.enlace} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="carrusel-enlace"
                      >
                        Ver más →
                      </a>
                    )}
                  </div>
                </div>
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