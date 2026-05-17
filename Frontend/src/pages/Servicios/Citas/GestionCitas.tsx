import { useState, useEffect } from "react"
import NuevaCitaModal from "./NuevaCitaModal"
import Sidebar from "../../../components/Sidebar/Sidebar"
import { obtenerCitas, inscribirseCita, eliminarCita, isAuthenticated, getUserRole } from "../../../services/api"
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MainContent from '../../../components/Layout/MainContent';
import "./GestionCitas.css"

function GestionCitas() {
  const [openModal, setOpenModal] = useState(false)
  const [citas, setCitas] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [fechaFiltro, setFechaFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role || '')
    
    if (role === 'admin') {
      navigate('/admin/citas')
    } else {
      cargarCitas()
    }
  }, [])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const data = await obtenerCitas()
      if (data.success) {
        setCitas(data.citas || [])
      }
    } catch (error) {
      console.error("Error al cargar citas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    cargarCitas()
  }

  const handleSeleccionarCita = async (id_cita: number) => {
    if (!isAuthenticated()) {
      alert("Debes iniciar sesión para seleccionar una cita")
      navigate('/')
      return
    }
    
    try {
      const result = await inscribirseCita(id_cita)
      if (result.success) {
        alert("Cita registrada correctamente")
        cargarCitas()
      } else {
        alert(result.error || "Error al seleccionar la cita")
      }
    } catch (error) {
      alert("Error al seleccionar la cita")
    }
  }

  const handleEliminarCita = async (id_cita: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      try {
        const result = await eliminarCita(id_cita)
        if (result.success) {
          alert("Cita eliminada correctamente")
          cargarCitas()
        } else {
          alert(result.error || "Error al eliminar la cita")
        }
      } catch (error) {
        alert("Error al eliminar la cita")
      }
    }
  }

  const citasFiltradas = citas.filter(c => {
    const matchBusqueda = c.tutor_nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
                          c.materia?.toLowerCase().includes(busqueda.toLowerCase()) || false
    const matchFecha = fechaFiltro ? c.fecha === fechaFiltro : true
    return matchBusqueda && matchFecha
  })

  return (
    <div className="gc-layout">
      <Sidebar userRole={userRole} />
      
      <MainContent className="gc-main">
        <header className="gc-topbar">
          <span className="gc-breadcrumb">Panel › Citas</span>
          <div className="gc-topbar-right">
            <NotificationsIcon className="gc-topbar-bell" />
            <div className="gc-topbar-user">
              <div>
                <p className="gc-topbar-name">Usuario</p>
                <p className="gc-topbar-role">
                  {userRole === 'admin' ? 'ADMINISTRADOR' : 
                   userRole === 'tutor' ? 'TUTOR' :
                   userRole === 'tutorado' ? 'TUTORADO' : 'ALUMNO'}
                </p>
              </div>
              <div className="gc-topbar-avatar">
                {userRole === 'admin' ? 'A' : userRole === 'tutor' ? 'T' : userRole === 'tutorado' ? 'T' : 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="gc-header">
          <div>
            <h1>Gestión de Citas de Tutoría</h1>
            <p>Administra y programa las sesiones académicas de acompañamiento.</p>
          </div>
          {(userRole === 'admin' || userRole === 'tutor' || userRole === 'tutorado') && (
            <button className="gc-btn-nueva" onClick={handleOpenModal}>
              + Nueva Cita
            </button>
          )}
        </div>

        <div className="gc-filtros">
          <div className="gc-search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar materias, tutores..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="gc-date-filter"
            value={fechaFiltro}
            onChange={e => setFechaFiltro(e.target.value)}
          />
          <button className="gc-btn-filtros">
            <FilterListIcon /> Filtros
          </button>
        </div>

        <div className="gc-tabla-wrapper">
          <table className="gc-tabla">
            <thead>
              <tr>
                <th>MATERIA</th>
                <th>TUTOR</th>
                <th>FECHA</th>
                <th>HORA</th>
                <th>LUGAR</th>
                <th>CUPOS</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="gc-empty">Cargando citas...</td>
                </tr>
              ) : citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="gc-empty">No hay citas disponibles</td>
                </tr>
              ) : (
                citasFiltradas.map((cita, i) => (
                  <tr key={i}>
                    <td><strong>{cita.materia}</strong></td>
                    <td>{cita.tutor_nombre}</td>
                    <td className="gc-fecha">{cita.fecha}</td>
                    <td><span className="gc-hora-badge">{cita.hora}</span></td>
                    <td>{cita.lugar || "Por asignar"}</td>
                    <td>
                      <span className={`status-pill ${(cita.inscritos || 0) >= (cita.capacidad || 1) ? 'lleno' : 'disponible'}`}>
                        {(cita.inscritos || 0)}/{(cita.capacidad || 1)}
                      </span>
                    </td>
                    <td>
                      {(userRole === 'admin' || userRole === 'tutor' || userRole === 'tutorado') && (
                        <button className="gc-btn-icono" onClick={() => handleEliminarCita(cita.id_cita)} title="Eliminar cita">
                          <DeleteIcon />
                        </button>
                      )}
                      {(userRole === 'alumno' || userRole === 'tutorado') && (
                        <button 
                          className="gc-btn-icono" 
                          onClick={() => handleSeleccionarCita(cita.id_cita)}
                          disabled={(cita.inscritos || 0) >= (cita.capacidad || 1)}
                          title={(cita.inscritos || 0) >= (cita.capacidad || 1) ? "Sin cupo" : "Inscribirse"}
                        >
                          <EventAvailableIcon /> {(cita.inscritos || 0) >= (cita.capacidad || 1) ? "Sin cupo" : "Inscribirse"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="gc-total">Mostrando {citasFiltradas.length} de {citas.length} citas disponibles</p>
      </MainContent>

      <NuevaCitaModal 
        isOpen={openModal} 
        onClose={handleCloseModal}
        onCitaCreada={cargarCitas}
      />
    </div>
  )
}

export default GestionCitas