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
  const [animando, setAnimando] = useState(false);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);

  useEffect(() => {
    const avisosGuardados = localStorage.getItem('avisos');
    if (avisosGuardados) {
      setAvisos(JSON.parse(avisosGuardados));
    } else {
      setAvisos([
        { id: 1, titulo: "Convocatoria Tutores", contenido: "Inscríbete como tutor", imagen: "", enlace: "", color: "#003DA5" },
        { id: 2, titulo: "Talleres", contenido: "Talleres de apoyo académico", imagen: "", enlace: "", color: "#D6A600" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (avisos.length === 0) return;
    
    // Mostrar el hero primero, luego el carrusel
    const timer = setTimeout(() => {
      setMostrarCarrusel(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [avisos]);

  useEffect(() => {
    if (!mostrarCarrusel || avisos.length <= 1) return;
    const intervalo = setInterval(() => {
      siguienteAviso();
    }, 5000);
    return () => clearInterval(intervalo);
  }, [mostrarCarrusel, avisos.length]);

  const siguienteAviso = () => {
    if (animando || avisos.length === 0) return;
    setAnimando(true);
    setAvisoActual((prev) => (prev + 1) % avisos.length);
    setTimeout(() => setAnimando(false), 500);
  };

  const anteriorAviso = () => {
    if (animando || avisos.length === 0) return;
    setAnimando(true);
    setAvisoActual((prev) => (prev - 1 + avisos.length) % avisos.length);
    setTimeout(() => setAnimando(false), 500);
  };

  if (avisos.length === 0) return null;

  return (
    <>
      {/* Hero con texto original */}
      <div className={`hero-contenido ${!mostrarCarrusel ? 'visible' : 'oculto'}`}>
        <h1>Programa de Tutorías</h1>
        <p>
          Impulsando tu éxito académico con el apoyo de nuestra comunidad
          universitaria y herramientas de aprendizaje colaborativo.
        </p>
        <div className="botones">
          <a href="/servicios" className="btn-comenzar">Comencemos</a>
          <a href="/sobre-nosotros" className="btn-info">Ver más info</a>
        </div>
      </div>

      {/* Carrusel de avisos (aparece después) */}
      <div className={`carrusel-container ${mostrarCarrusel ? 'visible' : 'oculto'}`}>
        {avisos.length > 1 && (
          <button className="carrusel-btn carrusel-btn-prev" onClick={anteriorAviso}>
            ❮
          </button>
        )}

        <div className="carrusel-wrapper">
          <div 
            className="carrusel-slides"
            style={{ transform: `translateX(-${avisoActual * 100}%)` }}
          >
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
                      <a href={aviso.enlace} target="_blank" rel="noopener noreferrer" className="carrusel-enlace">
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
          <button className="carrusel-btn carrusel-btn-next" onClick={siguienteAviso}>
            ❯
          </button>
        )}

        {avisos.length > 1 && (
          <div className="carrusel-indicadores">
            {avisos.map((_, index) => (
              <button
                key={index}
                className={`indicador ${index === avisoActual ? 'activo' : ''}`}
                onClick={() => {
                  if (animando) return;
                  setAnimando(true);
                  setAvisoActual(index);
                  setTimeout(() => setAnimando(false), 500);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Avisos;