import { useState, useEffect } from "react";
import "./SobreNosotros.css";

// Importar iconos
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const SobreNosotros = () => {
  const [stats, setStats] = useState({
    teachers: 50,
    tutors: 120,
    students: 1500,
  });

  const [countTeachers, setCountTeachers] = useState(0);
  const [countTutors, setCountTutors] = useState(0);
  const [countStudents, setCountStudents] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // CONECTA AQUÍ TU BACKEND
        // const response = await fetch('https://tu-api.com/stats');
        // const data = await response.json();
        // setStats({
        //   teachers: data.docentes,
        //   tutors: data.tutores,
        //   students: data.estudiantes,
        // });
        
        setTimeout(() => {
          setStats({ teachers: 52, tutors: 128, students: 1580 });
        }, 1000);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const duration = 2000;
    const stepTime = 20;

    const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
      let start = 0;
      const increment = target / (duration / stepTime);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.ceil(start));
        }
      }, stepTime);
      return () => clearInterval(interval);
    };

    const clearTeachers = animateCount(stats.teachers, setCountTeachers);
    const clearTutors = animateCount(stats.tutors, setCountTutors);
    const clearStudents = animateCount(stats.students, setCountStudents);

    return () => {
      clearTeachers();
      clearTutors();
      clearStudents();
    };
  }, [stats]);

  return (
    <section id="sobre-nosotros" className="sobre-nosotros">
      <div className="container">
        <div className="grid">
          
          <div className="info-wrapper">
            <h2 className="section-title">Conócenos</h2>
            <h3 className="section-subtitle">Nuestra misión es tu excelencia</h3>
            <p className="description">
              Brindamos acompañamiento integral a los estudiantes, fomentando la
              excelencia académica a través de valores, visión compartida y una
              red de apoyo humano constante.
            </p>
            <div className="mission-vision">
              <div className="mv-item">
                <div className="icon-box primary">
                  <SchoolIcon className="icon" />
                </div>
                <div>
                  <h4 className="mv-title">Misión</h4>
                  <p className="mv-text">
                    Guiar el desarrollo académico y personal de cada estudiante
                    mediante tutorías de alta calidad.
                  </p>
                </div>
              </div>
              <div className="mv-item">
                <div className="icon-box secondary">
                  <VisibilityIcon className="icon" />
                </div>
                <div>
                  <h4 className="mv-title">Visión</h4>
                  <p className="mv-text">
                    Ser el programa referente en integración estudiantil y éxito
                    académico a nivel nacional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="counters-wrapper">
            <div className="counter-card primary">
              <p className="counter-number primary">{countTeachers}+</p>
              <p className="counter-label">Docentes</p>
            </div>
            
            <div className="counter-card secondary top-offset">
              <p className="counter-number secondary">{countTutors}+</p>
              <p className="counter-label">Tutores</p>
            </div>
            
            <div className="counter-card primary bottom-offset">
              <p className="counter-number primary">{countStudents}+</p>
              <p className="counter-label">Estudiantes</p>
            </div>
            
            <div className="excellence-card">
              <AutoAwesomeIcon className="excellence-icon" />
              <p className="excellence-text">Excelencia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;