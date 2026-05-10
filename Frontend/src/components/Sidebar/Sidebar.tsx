import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Sidebar.css"

interface SidebarProps {
  userRole?: string;
}

function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
      </div>

      <div className="sidebar-user">
        <p className="sidebar-role">
          {userRole === 'admin' ? 'Administrador' :
           userRole === 'tutor' ? 'Tutor' :
           userRole === 'tutorado' ? 'Tutorado' : 'Alumno'}
        </p>
        <p className="sidebar-school">PIT FES Acatlán</p>
      </div>

      <nav className="sidebar-nav">
        {/* Solo admin ve estos enlaces */}
        {userRole === 'admin' && (
          <>
            <Link to="/admin-avisos" className={`nav-item ${isActive("/admin-avisos") ? "active" : ""}`}>
              <span>📢</span> Administrar Avisos
            </Link>
            <Link to="/bitacora" className={`nav-item ${isActive("/bitacora") ? "active" : ""}`}>
              <span>📝</span> Bitácora
            </Link>
            <Link to="/usuarios" className={`nav-item ${isActive("/usuarios") ? "active" : ""}`}>
              <span>👥</span> Usuarios
            </Link>
            <Link to="/roles" className={`nav-item ${isActive("/roles") ? "active" : ""}`}>
              <span>🎭</span> Roles
            </Link>
            <Link to="/accesos" className={`nav-item ${isActive("/accesos") ? "active" : ""}`}>
              <span>🔐</span> Accesos
            </Link>
          </>
        )}

        {/* Solo tutor ve bitácora */}
        {userRole === 'tutor' && (
          <Link to="/bitacora" className={`nav-item ${isActive("/bitacora") ? "active" : ""}`}>
            <span>📋</span> Bitácora
          </Link>
        )}

        {/* Enlaces comunes para todos */}
        <Link to="/agenda" className={`nav-item ${isActive("/agenda") ? "active" : ""}`}>
          <span>📅</span> Agenda de Tutorías
        </Link>
        
        <Link to="/citas" className={`nav-item ${isActive("/citas") ? "active" : ""}`}>
          <span>📋</span> Gestionar Citas
        </Link>
        
        <Link to="/repositorio" className={`nav-item ${isActive("/repositorio") ? "active" : ""}`}>
          <span>📚</span> Repositorio
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item nav-logout" onClick={handleLogout}>
          <span>↪</span> Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar