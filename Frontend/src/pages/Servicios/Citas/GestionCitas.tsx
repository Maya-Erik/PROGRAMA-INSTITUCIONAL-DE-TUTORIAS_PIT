import { getCitasDisponibles, seleccionarCita, isAuthenticated } from "../../../services/api";
import "./GestionCitas.css"
import { useState, useEffect } from "react"
import NuevaCitaModal from "./NuevaCitaModal"
import Sidebar from "../../../components/Sidebar/Sidebar"
import { getCitasDisponibles, seleccionarCita, isAuthenticated } from "../../../services/api"

function GestionCitas() {
  const [openModal, setOpenModal] = useState(false)
  const [citas, setCitas] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [fechaFiltro, setFechaFiltro] = useState("")
  const [loading, setLoading] = useState(true)

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const data = await getCitasDisponibles()
      setCitas(data)
    } catch (error) {
      console.error("Error al cargar citas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeleccionarCita = async (id_cita: number) => {
    if (!isAuthenticated()) {
      alert("Debes iniciar sesión para seleccionar una cita")
      return
    }
    
    try {
      const result = await seleccionarCita(id_cita)
      alert(result.mensaje || "Cita registrada correctamente")
      cargarCitas() // Recargar lista
    } catch (error) {
      alert("Error al seleccionar la cita")
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  const citasFiltradas = citas.filter(c => {
    const matchBusqueda = c.tutor?.toLowerCase().includes(busqueda.toLowerCase()) || false
    const matchFecha = fechaFiltro ? c.fecha === fechaFiltro : true
    return matchBusqueda && matchFecha
  })

  return (
    <div className="gc-layout">
      <Sidebar />

      <main className="gc-main">
        <header className="gc-topbar">
          <span className="gc-breadcrumb">Panel › Citas</span>
          <div className="gc-topbar-right">
            <span className="gc-topbar-bell">🔔</span>
            <div className="gc-topbar-user">
              <div>
                <p className="gc-topbar-name">Admin Usuario</p>
                <p className="gc-topbar-role">COORDINADOR</p>
              </div>
              <div className="gc-topbar-avatar">AU</div>
            </div>
          </div>
        </header>

        <div className="gc-header">
          <div>
            <h1>Gestión de Citas de Tutoría</h1>
            <p>Administra y programa las sesiones académicas de acompañamiento.</p>
          </div>
          <button className="gc-btn-nueva" onClick={() => setOpenModal(true)}>
            + Nueva Cita
          </button>
        </div>

        <div className="gc-filtros">
          <div className="gc-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar tutores..."
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
          <button className="gc-btn-filtros">☰ Filtros</button>
        </div>

        <div className="gc-tabla-wrapper">
          <table className="gc-tabla">
            <thead>
              <tr>
                <th>TUTOR</th>
                <th>FECHA</th>
                <th>HORA</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="gc-empty">Cargando citas...</td></tr>
              ) : citasFiltradas.length === 0 ? (
                <tr><td colSpan={5} className="gc-empty">No hay citas disponibles</td></tr>
              ) : (
                citasFiltradas.map((cita, i) => (
                  <tr key={i}>
                    <td><strong>{cita.tutor}</strong></td>
                    <td className="gc-fecha">{cita.fecha}</td>
                    <td><span className="gc-hora-badge">{cita.hora}</span></td>
                    <td><span className="status-pill activo">Disponible</span></td>
                    <td>
                      <button className="gc-btn-icono" onClick={() => handleSeleccionarCita(cita.id_cita)}>
                        📅 Seleccionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="gc-total">Mostrando {citasFiltradas.length} de {citas.length} citas disponibles</p>
      </main>

      <NuevaCitaModal isOpen={openModal} onClose={cargarCitas} />
    </div>
  )
}

export default GestionCitas