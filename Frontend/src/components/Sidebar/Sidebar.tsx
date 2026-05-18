import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Sidebar.css"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CampaignIcon from '@mui/icons-material/Campaign'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EventNoteIcon from '@mui/icons-material/EventNote'
import LogoutIcon from '@mui/icons-material/Logout'
import CloseIcon from '@mui/icons-material/Close'
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSidebar } from '../../context/SidebarContext'

interface SidebarProps {
  userRole?: string;
}

function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarOpen, closeSidebar, isMobile } = useSidebar()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  // Clases para la sidebar
  const sidebarClasses = `sidebar ${isMobile ? 'mobile' : ''} ${sidebarOpen ? 'open' : 'closed'}`

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      
      <aside className={sidebarClasses}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🎓</div>
          </div>
          {isMobile && (
            <button className="sidebar-close-btn" onClick={closeSidebar}>
              <CloseIcon />
            </button>
          )}
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
              <Link to="/admin/citas" className={`nav-item ${isActive("/admin/citas") ? "active" : ""}`} onClick={handleLinkClick}>
                <CalendarMonthIcon fontSize="small" /> Gestionar Citas
              </Link>
              <Link to="/admin-avisos" className={`nav-item ${isActive("/admin-avisos") ? "active" : ""}`} onClick={handleLinkClick}>
                <CampaignIcon fontSize="small" /> Administrar Avisos
              </Link>
              <Link to="/bitacora" className={`nav-item ${isActive("/bitacora") ? "active" : ""}`} onClick={handleLinkClick}>
                <AssignmentIcon fontSize="small" /> Bitácora
              </Link>
              <Link to="/usuarios" className={`nav-item ${isActive("/usuarios") ? "active" : ""}`} onClick={handleLinkClick}>
                <PeopleIcon fontSize="small" /> Usuarios
              </Link>
              <Link to="/admin/materiales" className={`nav-item ${isActive("/admin/materiales") ? "active" : ""}`} onClick={handleLinkClick}>
                <MenuBookIcon fontSize="small" /> Gestionar Materiales
              </Link>
            </>
          )}

          {/* Solo tutor ve bitácora */}
          {userRole === 'tutor' && (
            <Link to="/bitacora" className={`nav-item ${isActive("/bitacora") ? "active" : ""}`} onClick={handleLinkClick}>
              <AssignmentIcon fontSize="small" /> Bitácora
            </Link>
            
          )}

          {/* Enlaces comunes para todos */}
          <Link to="/agenda" className={`nav-item ${isActive("/agenda") ? "active" : ""}`} onClick={handleLinkClick}>
            <EventNoteIcon fontSize="small" /> Agenda de Tutorías
          </Link>
          
          <Link to="/citas" className={`nav-item ${isActive("/citas") ? "active" : ""}`} onClick={handleLinkClick}>
            <AssignmentIcon fontSize="small" /> Gestionar Citas
          </Link>
          
          <Link to="/repositorio" className={`nav-item ${isActive("/repositorio") ? "active" : ""}`} onClick={handleLinkClick}>
            <MenuBookIcon fontSize="small" /> Repositorio
          </Link>

          <Link to="/reportes" className={`nav-item ${isActive("/reportes") ? "active" : ""}`} onClick={handleLinkClick}>
            <BarChartIcon fontSize="small" /> Reportes y Estadísticas
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item nav-logout" onClick={handleLogout}>
            <LogoutIcon fontSize="small" /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar