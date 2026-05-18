import "./Navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../../assets/icons/unam_logo.svg";
import Login from "../../pages/Login/Login";
import Registro from "../../pages/Registro/Registro";
import { isAuthenticated, logout } from "../../services/api";
import Notificaciones from "../Notificaciones/Notificaciones";
import PerfilUsuario from "../PerfilUsuario/PerfilUsuario";

interface NavbarProps {
  onLoginClick?: () => void;
}

function Navbar({ onLoginClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isScrolling = useRef(false);

  const getNavbarHeight = () => {
    const navbar = document.querySelector('.navbar');
    return navbar ? navbar.getBoundingClientRect().height : 80;
  };

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const checkSections = () => {
      const sections = ["inicio", "sobre-nosotros", "servicios", "divisiones", "contacto"];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (!element) console.warn(`Sección no encontrada: ${section}`);
      });
    };

    const timeoutId = setTimeout(checkSections, 100);

    const handleScroll = () => {
      if (isScrolling.current) return;
      const sections = ["inicio", "sobre-nosotros", "servicios", "divisiones", "contacto"];
      const navbarHeight = getNavbarHeight();
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight + 50) {
            currentSection = section;
            break;
          }
        }
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, activeSection]);

  const handleClick = (sectionId: string) => {
    setMenuOpen(false);
    isScrolling.current = true;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = getNavbarHeight();
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      window.history.pushState(null, "", `/#${sectionId}`);
      
      setTimeout(() => {
        setActiveSection(sectionId);
      }, 100);

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    } else {
      console.error(`Elemento con id "${sectionId}" no encontrado`);
      isScrolling.current = false;
    }
  };

  const handleLoginClick = () => {
    setMenuOpen(false);
    if (onLoginClick) {
      onLoginClick();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleRegistroClick = () => {
    setMenuOpen(false);
    setIsRegistroModalOpen(true);
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setIsLoggedIn(isAuthenticated());
  };

  const handleCloseRegistroModal = () => {
    setIsRegistroModalOpen(false);
  };

  const handleOpenPerfil = () => {
    setOpenPerfilModal(true);
  };

  const handlePerfilUpdate = () => {
    // No es necesario hacer nada aquí por ahora
  };

  const isActive = (sectionId: string) => {
    return location.pathname === "/" && activeSection === sectionId;
  };

  const getUserInitials = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const nombre = user.nombre || user.nombre_completo || '';
      if (nombre) {
        return nombre.charAt(0).toUpperCase();
      }
    }
    return 'U';
  };

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src={Logo} className="logo-icon" alt="Logo UNAM" />
          <span className="logo-pit">PIT</span>
          <span className="logo-fes">FES ACATLÁN</span>
        </NavLink>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon />
        </div>

        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li>
            <button className={`nav-button ${isActive("inicio") ? "active" : ""}`} onClick={() => handleClick("inicio")}>
              Inicio
            </button>
          </li>
          <li>
            <button className={`nav-button ${isActive("sobre-nosotros") ? "active" : ""}`} onClick={() => handleClick("sobre-nosotros")}>
              Sobre Nosotros
            </button>
          </li>
          <li>
            <button className={`nav-button ${isActive("servicios") ? "active" : ""}`} onClick={() => handleClick("servicios")}>
              Servicios
            </button>
          </li>
          <li>
            <button className={`nav-button ${isActive("divisiones") ? "active" : ""}`} onClick={() => handleClick("divisiones")}>
              Divisiones
            </button>
          </li>
          <li>
            <button className={`nav-button ${isActive("contacto") ? "active" : ""}`} onClick={() => handleClick("contacto")}>
              Contacto
            </button>
          </li>
          {isLoggedIn && (
            <li>
              <button className="nav-button" onClick={() => { setMenuOpen(false); navigate("/citas"); }}>
                Citas
              </button>
            </li>
          )}
          <li>
            {isLoggedIn ? (
              <button className="login-btn" onClick={handleLogoutClick}>
                Cerrar Sesión
              </button>
            ) : (
              <div className="auth-buttons">
                <button className="login-btn" onClick={handleLoginClick}>
                  Iniciar Sesión
                </button>
                <button className="nav-button" onClick={handleRegistroClick}>
                  Registrarse
                </button>
              </div>
            )}
          </li>
        </ul>

        {isLoggedIn && (
          <div className="user-avatar-container">
            <div className="user-avatar" onClick={handleOpenPerfil}>
              {getUserInitials()}
            </div>
            <Notificaciones />
          </div>
        )}
      </nav>

      <Login isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
      <Registro isOpen={isRegistroModalOpen} onClose={handleCloseRegistroModal} />
      <PerfilUsuario 
        open={openPerfilModal} 
        onClose={() => setOpenPerfilModal(false)}
        onUpdate={handlePerfilUpdate}
      />
    </>
  );
}

export default Navbar;