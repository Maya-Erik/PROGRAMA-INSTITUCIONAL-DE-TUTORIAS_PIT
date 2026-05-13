import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Repositorio.css';

const Repositorio = () => {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('documentos');

  const carreras = [
    "Actuaria",
    "Arquitectura",
    "Ciencias Politicas y Administracion Publica",
    "Comunicacion",
    "Derecho",
    "Diseño Grafico",
    "Economia",
    "Enseñanza de (Español) (Inglés) Como Lengua Extranjera",
    "Enseñanza de Ingles",
    "Filosofia",
    "Historia",
    "Ingenieria Civil",
    "Lengua y Literaturas Hispanicas",
    "Matematicas Aplicadas y Computacion",
    "Pedagogia",
    "Relaciones Internacionales",
    "Sociologia",
    "Derecho (SUAyED)",
    "Relaciones Internacionales (SUAyED)",
    "LICEL"
  ];

  const documentosInstitucionales = [
    { id: 1, titulo: "Reglamento General de Tutorias", tipo: "PDF", size: "2.5 MB", link: "#" },
    { id: 2, titulo: "Manual del Tutor", tipo: "PDF", size: "1.8 MB", link: "#" },
    { id: 3, titulo: "Manual del Tutorado", tipo: "PDF", size: "1.5 MB", link: "#" },
    { id: 4, titulo: "Lineamientos del Programa Institucional de Tutorias", tipo: "PDF", size: "3.2 MB", link: "#" },
    { id: 5, titulo: "Formato de Reporte de Tutoria", tipo: "DOCX", size: "0.5 MB", link: "#" },
    { id: 6, titulo: "Cronograma de Actividades PIT", tipo: "PDF", size: "1.2 MB", link: "#" }
  ];

  const recursosFormacion = [
    { id: 1, titulo: "Curso de Formacion para Tutores", tipo: "Video", duracion: "2 horas", link: "#" },
    { id: 2, titulo: "Taller de Comunicacion Efectiva", tipo: "PDF", size: "1.5 MB", link: "#" },
    { id: 3, titulo: "Estrategias de Enseñanza-Aprendizaje", tipo: "Video", duracion: "1.5 horas", link: "#" },
    { id: 4, titulo: "Gestion del Estres para Estudiantes", tipo: "PDF", size: "1.2 MB", link: "#" },
    { id: 5, titulo: "Curso de Liderazgo Academico", tipo: "Video", duracion: "3 horas", link: "#" },
    { id: 6, titulo: "Guia para el Trabajo Colaborativo", tipo: "PDF", size: "2 MB", link: "#" }
  ];

  const handleCarreraClick = (carrera: string) => {
    navigate(`/repositorio/${encodeURIComponent(carrera)}`);
  };

  return (
    <div className="repositorio-page">
      <Navbar />
      
      <section className="repositorio-section">
        <div className="repositorio-container">
          <h1 className="repositorio-titulo">Repositorio Academico</h1>
          <p className="repositorio-subtitulo">
            Accede a documentos institucionales, materiales academicos y recursos de formacion
          </p>

          {/* Tabs de secciones */}
          <div className="repositorio-tabs">
            <button 
              className={`repositorio-tab ${seccionActiva === 'documentos' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('documentos')}
            >
              Documentos Institucionales
            </button>
            <button 
              className={`repositorio-tab ${seccionActiva === 'materiales' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('materiales')}
            >
              Materiales Academicos
            </button>
            <button 
              className={`repositorio-tab ${seccionActiva === 'formacion' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('formacion')}
            >
              Recursos de Formacion
            </button>
          </div>

          {/* Seccion: Documentos Institucionales */}
          {seccionActiva === 'documentos' && (
            <div className="repositorio-seccion">
              <h2 className="seccion-titulo">Documentos Institucionales</h2>
              <p className="seccion-descripcion">
                Documentos oficiales, reglamentos y formatos del Programa Institucional de Tutorias
              </p>
              <div className="repositorio-grid">
                {documentosInstitucionales.map((doc) => (
                  <div key={doc.id} className="repositorio-card">
                    <div className="card-icon">📄</div>
                    <div className="card-content">
                      <h3 className="card-titulo">{doc.titulo}</h3>
                      <div className="card-meta">
                        <span className="card-tipo">{doc.tipo}</span>
                        <span className="card-tamanio">{doc.size}</span>
                      </div>
                      <a href={doc.link} className="card-btn">Descargar</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seccion: Materiales Academicos */}
          {seccionActiva === 'materiales' && (
            <div className="repositorio-seccion">
              <h2 className="seccion-titulo">Materiales Academicos por Carrera</h2>
              <p className="seccion-descripcion">
                Selecciona tu carrera para acceder a materiales academicos especificos
              </p>
              <div className="carreras-grid">
                {carreras.map((carrera, index) => (
                  <div 
                    key={index} 
                    className="carrera-card"
                    onClick={() => handleCarreraClick(carrera)}
                  >
                    <div className="carrera-icon">📚</div>
                    <h3 className="carrera-nombre">{carrera}</h3>
                    <p className="carrera-descripcion">Ver materiales academicos</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seccion: Recursos de Formacion */}
          {seccionActiva === 'formacion' && (
            <div className="repositorio-seccion">
              <h2 className="seccion-titulo">Recursos de Formacion</h2>
              <p className="seccion-descripcion">
                Cursos, talleres y guias para la formacion continua de tutores y estudiantes
              </p>
              <div className="repositorio-grid">
                {recursosFormacion.map((recurso) => (
                  <div key={recurso.id} className="repositorio-card">
                    <div className="card-icon">
                      {recurso.tipo === 'Video' ? '🎥' : '📘'}
                    </div>
                    <div className="card-content">
                      <h3 className="card-titulo">{recurso.titulo}</h3>
                      <div className="card-meta">
                        <span className="card-tipo">{recurso.tipo}</span>
                        <span className="card-tamanio">{recurso.duracion || recurso.size}</span>
                      </div>
                      <a href={recurso.link} className="card-btn">Ver recurso</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Repositorio;