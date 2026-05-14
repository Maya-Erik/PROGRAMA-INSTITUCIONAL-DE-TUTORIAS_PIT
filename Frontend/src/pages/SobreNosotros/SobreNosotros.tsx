import { useState, useEffect } from "react";
import "./SobreNosotros.css";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const SobreNosotros = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    tutors: 0,
    students: 0,
  });

  const [countTeachers, setCountTeachers] = useState(0);
  const [countTutors, setCountTutors] = useState(0);
  const [countStudents, setCountStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  const formatNumber = (num: number, max: number) => {
    if (num > max) {
      return `${max}+`;
    }
    return `${num}+`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_URL}/auth/estadisticas`);
        const data = await response.json();
        
        if (data.success) {
          setStats({
            teachers: data.data.maestros,
            tutors: data.data.tutores,
            students: data.data.alumnos,
          });
        } else {
          setStats({
            teachers: 52,
            tutors: 128,
            students: 1580,
          });
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setStats({
          teachers: 52,
          tutors: 128,
          students: 1580,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    const duration = 2000;
    const stepTime = 20;

    const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>, max: number) => {
      let start = 0;
      const finalTarget = target > max ? max : target;
      const increment = finalTarget / (duration / stepTime);
      const interval = setInterval(() => {
        start += increment;
        if (start >= finalTarget) {
          setter(finalTarget);
          clearInterval(interval);
        } else {
          setter(Math.ceil(start));
        }
      }, stepTime);
      return () => clearInterval(interval);
    };

    const clearTeachers = animateCount(stats.teachers, setCountTeachers, 250);
    const clearTutors = animateCount(stats.tutors, setCountTutors, 500);
    const clearStudents = animateCount(stats.students, setCountStudents, 999);

    return () => {
      clearTeachers();
      clearTutors();
      clearStudents();
    };
  }, [stats]);

  if (loading) {
    return (
      <section id="sobre-nosotros" className="sobre-nosotros">
        <div className="container">
          <div className="grid">
            <div className="info-wrapper">
              <h2 className="section-title">Conócenos</h2>
              <h3 className="section-subtitle">Nuestra misión es tu excelencia</h3>
              <p className="description">Cargando estadísticas...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
              <p className="counter-number primary">
                {formatNumber(countStudents, 999)}
              </p>
              <p className="counter-label">Alumnos</p>
            </div>
            
            <div className="counter-card secondary top-offset">
              <p className="counter-number secondary">
                {formatNumber(countTeachers, 250)}
              </p>
              <p className="counter-label">Maestros</p>
            </div>
            
            <div className="counter-card primary bottom-offset">
              <p className="counter-number primary">
                {formatNumber(countTutors, 500)}
              </p>
              <p className="counter-label">Tutores</p>
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