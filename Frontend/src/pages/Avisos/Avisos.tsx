import { useState, useEffect } from 'react';
import './Avisos.css';

const Avisos = () => {
  const [avisos, setAvisos] = useState<any[]>([]);
  const [avisoActual, setAvisoActual] = useState(0);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);

  useEffect(() => {
    const avisosGuardados = localStorage.getItem('avisos');
    if (avisosGuardados) {
      setAvisos(JSON.parse(avisosGuardados));
    }
  }, []);

  useEffect(() => {
    if (avisos.length === 0) return;
    const timer = setTimeout(() => setMostrarCarrusel(true), 3000);
    return () => clearTimeout(timer);
  }, [avisos]);

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

  return (
    <>
      <div className={`hero-contenido ${!mostrarCarrusel ? 'visible' : 'oculto'}`}>
        <h1>Programa de Tutorías</h1>
        <p>Impulsando tu éxito académico con el apoyo de nuestra comunidad universitaria.</p>
        <div className="botones">
          <a href="/servicios" className="btn-comenzar">Comencemos</a>
          <a href="/sobre-nosotros" className="btn-info">Ver más info</a>
        </div>
      </div>

      <div className={`carrusel-container ${mostrarCarrusel ? 'visible' : 'oculto'}`}>
        <div className="carrusel-wrapper">
          <div className="carrusel-slides" style={{ transform: `translateX(-${avisoActual * 100}%)` }}>
            {avisos.map((aviso, idx) => (
              <div key={aviso.id} className="carrusel-slide" style={{ backgroundColor: aviso.color }}>
                <div className="carrusel-contenido">
                  <div className="carrusel-texto">
                    <h2>{aviso.titulo}</h2>
                    <p>{aviso.contenido}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Avisos;