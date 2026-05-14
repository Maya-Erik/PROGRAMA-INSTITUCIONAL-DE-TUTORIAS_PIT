import "./Divisiones.css";
import Navbar from "../../components/Navbar/Navbar"

const Divisiones = () => {
  const divisiones = [
    {
      titulo: "Matemáticas e Ingeniería",
      descripcion: "Formación en ciencias exactas y aplicadas",
      carreras: [
        { nombre: "Actuaría", link: "https://actuaria.acatlan.unam.mx/" },
        { nombre: "Ingeniería Civil", link: "https://ingenieria.acatlan.unam.mx/" },
        { nombre: "Matemáticas Aplicadas y Computación", link: "https://mac.acatlan.unam.mx/" }
      ]
    },
    {
      titulo: "Ciencias Jurídicas",
      descripcion: "Estudio del derecho y las leyes",
      carreras: [
        { nombre: "Derecho", link: "#" }
      ]
    },
    {
      titulo: "Diseño y Edificación",
      descripcion: "Creatividad y construcción de espacios",
      carreras: [
        { nombre: "Arquitectura", link: "#" },
        { nombre: "Diseño Gráfico", link: "#" }
      ]
    },
    {
      titulo: "Humanidades",
      descripcion: "Comprensión del ser humano y su cultura",
      carreras: [
        { nombre: "Comunicación", link: "#" },
        { nombre: "Enseñanza de Inglés", link: "#" },
        { nombre: "Filosofía", link: "#" },
        { nombre: "Historia", link: "#" },
        { nombre: "Lengua y Literatura Hispánicas", link: "#" },
        { nombre: "Pedagogía", link: "#" }
      ]
    },
    {
      titulo: "Socioeconómicas",
      descripcion: "Análisis de la sociedad y la economía",
      carreras: [
        { nombre: "Ciencias Políticas y de Administración Pública", link: "#" },
        { nombre: "Economía", link: "#" },
        { nombre: "Relaciones Internacionales", link: "#" },
        { nombre: "Sociología", link: "#" }
      ]
    },
    {
      titulo: "SUAYED",
      descripcion: "Sistema Universidad Abierta y Educación a Distancia",
      carreras: [
        { nombre: "Derecho", link: "https://suayed.acatlan.unam.mx/derechosua/" },
        { nombre: "Relaciones Internacionales", link: "https://suayed.acatlan.unam.mx/ri/" },
        { nombre: "LICEL", link: "https://licel.acatlan.unam.mx/" }
      ]
    }
  ];

  return (
    <>
      <Navbar/>
      
      <section id="divisiones" className="divisiones-container">
        <h2 className="titulo-divisiones">Divisiones Académicas</h2>
        <p className="subtitulo-divisiones">
          Encuentra apoyo especializado según tu área
        </p>

        <div className="grid-tarjetas">
          {divisiones.map((division, index) => (
            <div key={index} className="tarjeta">
              <h3>{division.titulo}</h3>
              <p className="descripcion-tarjeta">{division.descripcion}</p>
              
              <div className="lista-carreras">
                <h4>Carreras:</h4>
                <ul>
                  {division.carreras.map((carrera, idx) => (
                    <li key={idx}>
                      <a href={carrera.link} className="link-carrera">
                        {carrera.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Divisiones;