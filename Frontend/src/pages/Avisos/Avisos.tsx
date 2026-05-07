// Avisos.tsx - Corregido
import { useState, useEffect } from 'react';
import './Avisos.css';

interface Aviso {
  id: number;
  color: string;
}

const Avisos = () => {
  const [avisos] = useState<Aviso[]>([
    { id: 1, color: "#003DA6" },
    { id: 2, color: "#001F54" },
    { id: 3, color: "#D6A600" },
  ]);
  
  const [avisoActual, setAvisoActual] = useState(0);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      siguienteAviso();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [avisos.length]);

  const siguienteAviso = () => {
    if (animando) return;
    setAnimando(true);
    setAvisoActual((prev) => (prev + 1) % avisos.length);
    setTimeout(() => setAnimando(false), 500);
  };

  const anteriorAviso = () => {
    if (animando) return;
    setAnimando(true);
    setAvisoActual((prev) => (prev - 1 + avisos.length) % avisos.length);
    setTimeout(() => setAnimando(false), 500);
  };

  const irAlAviso = (indice: number) => {
    if (animando || indice === avisoActual) return;
    setAnimando(true);
    setAvisoActual(indice);
    setTimeout(() => setAnimando(false), 500);
  };

  return (
    <div id="avisos" className="avisos-container">
      <div className="carrusel-container">
        <button 
          className="carrusel-btn carrusel-btn-izquierdo" 
          onClick={anteriorAviso}
          aria-label="Aviso anterior"
        >
          ❮
        </button>

        <div className="carrusel-wrapper">
          <div 
            className={`carrusel-slide ${animando ? 'animando' : ''}`}
            style={{ transform: `translateX(-${avisoActual * 100}%)` }}
          >
            {avisos.map((aviso) => (
              <div 
                key={aviso.id} 
                className="carrusel-item"
                style={{ backgroundColor: aviso.color }}
              />
            ))}
          </div>
        </div>

        <button 
          className="carrusel-btn carrusel-btn-derecho" 
          onClick={siguienteAviso}
          aria-label="Aviso siguiente"
        >
          ❯
        </button>
      </div>

      <div className="indicadores">
        {avisos.map((_, indice) => (
          <button
            key={indice}
            className={`indicador ${indice === avisoActual ? 'activo' : ''}`}
            onClick={() => irAlAviso(indice)}
            aria-label={`Ir al aviso ${indice + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Avisos;