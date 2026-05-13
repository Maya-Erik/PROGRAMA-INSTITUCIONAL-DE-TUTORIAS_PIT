import "./NuevaCitaModal.css"
import { useState } from "react"
import ReactDOM from "react-dom"
import { crearCita, getUserRole } from "../../../services/api"

interface Props {
  isOpen: boolean
  onClose: () => void
}

function NuevaCitaModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    tema: "",
    tutor_nombre: "",
    fecha: "",
    hora: "",
    lugar: "",
    capacidad: 20,
    tipo: "grupal",
    carrera: ""
  })

  const [loading, setLoading] = useState(false)
  const userRole = getUserRole()
  const userStr = localStorage.getItem('user')
  let userName = ""

  if (userStr) {
    const user = JSON.parse(userStr)
    userName = user.nombre || user.nombre_completo || user.email?.split('@')[0] || ""
  }

  const carreras = [
    "Actuaria", "Arquitectura", "Ciencias Politicas y Administracion Publica",
    "Comunicacion", "Derecho", "Diseño Grafico", "Economia",
    "Enseñanza de (Español) (Inglés) Como Lengua Extranjera", "Enseñanza de Ingles",
    "Filosofia", "Historia", "Ingenieria Civil", "Lengua y Literaturas Hispanicas",
    "Matematicas Aplicadas y Computacion", "Pedagogia", "Relaciones Internacionales",
    "Sociologia", "Derecho (SUAyED)", "Relaciones Internacionales (SUAyED)", "LICEL"
  ]

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    if (!form.tema || !form.fecha || !form.hora || !form.carrera) {
      alert("Por favor completa todos los campos obligatorios")
      setLoading(false)
      return
    }

    const citaData = {
      materia: form.tema,
      tutor_nombre: form.tutor_nombre,
      fecha: form.fecha,
      hora: form.hora,
      capacidad: form.capacidad,
      tipo: form.tipo,
      carrera: form.carrera
    }
    
    try {
      const result = await crearCita(citaData)
      if (result.success) {
        alert("Cita creada correctamente")
        onClose()
      } else {
        alert(result.error || "Error al crear cita")
      }
    } catch (error) {
      alert("Error al crear cita")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-cita" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">
          <span className="badge">NUEVA TUTORIA</span>
          <h2>Agendar Nueva Tutoria</h2>
          <p>Completa los datos para programar una sesion de acompanamiento academico.</p>
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">✔</span>
              <span>Verificacion de disponibilidad inmediata</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <span>Notificaciones via correo institucional</span>
            </div>
          </div>
        </div>

        <form className="modal-right" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>TEMA *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="tema"
                  value={form.tema}
                  onChange={handleChange}
                  placeholder="Ej: Calculo Diferencial, Programacion, etc."
                  required
                />
                <span className="input-icon">📖</span>
              </div>
            </div>

            <div className="form-group">
              <label>TUTOR *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="tutor_nombre"
                  value={userRole === 'tutor' || userRole === 'tutorado' ? userName : form.tutor_nombre}
                  onChange={handleChange}
                  placeholder="Nombre del tutor"
                  readOnly={userRole === 'tutor' || userRole === 'tutorado'}
                  required
                />
                <span className="input-icon">👨‍🏫</span>
              </div>
              {(userRole === 'tutor' || userRole === 'tutorado') && (
                <small className="helper-text">El tutor se asigna automaticamente</small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>FECHA *</label>
              <div className="input-wrapper">
                <input 
                  type="date" 
                  name="fecha" 
                  value={form.fecha} 
                  onChange={handleChange} 
                  required 
                />
                <span className="input-icon">📅</span>
              </div>
            </div>

            <div className="form-group">
              <label>HORARIO *</label>
              <div className="input-wrapper">
                <input 
                  type="time" 
                  name="hora" 
                  value={form.hora} 
                  onChange={handleChange} 
                  required 
                />
                <span className="input-icon">🕐</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>TIPO *</label>
              <div className="select-wrapper">
                <select name="tipo" value={form.tipo} onChange={handleChange} required>
                  <option value="grupal">Grupal</option>
                  <option value="individual">Individual</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>

            <div className="form-group">
              <label>CAPACIDAD *</label>
              <div className="input-wrapper">
                <input 
                  type="number" 
                  name="capacidad" 
                  value={form.capacidad} 
                  onChange={handleChange} 
                  min="1" 
                  max="20"
                  required
                />
                <span className="input-icon">👥</span>
              </div>
              <small className="helper-text">Maximo 20 personas para tutorias grupales</small>
            </div>
          </div>

          <div className="form-group">
            <label>CARRERA *</label>
            <div className="select-wrapper">
              <select name="carrera" value={form.carrera} onChange={handleChange} required>
                <option value="">Selecciona una carrera</option>
                {carreras.map((carrera, i) => (
                  <option key={i} value={carrera}>{carrera}</option>
                ))}
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          <div className="form-group">
            <label>SALON / LUGAR</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="lugar"
                value={form.lugar}
                onChange={handleChange}
                placeholder="Ej. Cubículo 302, Sala de Juntas, Virtual"
              />
              <span className="input-icon">📍</span>
            </div>
            <small className="helper-text">El salon sera asignado por administracion</small>
          </div>

          <div className="acciones">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando...' : '📅 Crear Tutoria'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default NuevaCitaModal