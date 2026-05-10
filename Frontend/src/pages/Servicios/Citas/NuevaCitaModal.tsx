import "./NuevaCitaModal.css"
import { useState } from "react"
import ReactDOM from "react-dom"
import { crearCita } from "../../../services/api"

interface Props {
  isOpen: boolean
  onClose: () => void
}

function NuevaCitaModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    materia: "",
    tutor_nombre: "",
    fecha: "",
    hora: "",
    lugar: "",
    capacidad: 20,
    tipo: "grupal",
    carrera: ""
  })

  const [loading, setLoading] = useState(false)

  const materias = ["Cálculo II", "Intro to Python", "Literatura Mexicana", "Álgebra Lineal", "Ecuaciones Diferenciales"]
  const tutores = ["Dr. García", "M.C. Roberto Hernández", "Dra. Elena Pontes", "Mtro. José López"]

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await crearCita(form)
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
          <span className="badge">NUEVO REGISTRO</span>
          <h2>Agendar Nueva Cita</h2>
          <p>Asegura un espacio con los mejores tutores de la FES Acatlán para fortalecer tu trayectoria académica.</p>
          <div className="features">
            <div className="feature-item"><span className="feature-icon">✔</span><span>Verificación de disponibilidad inmediata</span></div>
            <div className="feature-item"><span className="feature-icon">🔔</span><span>Notificaciones vía correo institucional</span></div>
          </div>
        </div>

        <form className="modal-right" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>MATERIA</label>
              <div className="select-wrapper">
                <select name="materia" value={form.materia} onChange={handleChange} required>
                  <option value="" disabled>Selecciona una asignatura</option>
                  {materias.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
            <div className="form-group">
              <label>TUTOR</label>
              <div className="select-wrapper">
                <select name="tutor_nombre" value={form.tutor_nombre} onChange={handleChange} required>
                  <option value="" disabled>Selecciona un tutor</option>
                  {tutores.map((t, i) => <option key={i} value={t}>{t}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>FECHA</label>
              <div className="input-wrapper">
                <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
                <span className="input-icon">📅</span>
              </div>
            </div>
            <div className="form-group">
              <label>HORARIO</label>
              <div className="input-wrapper">
                <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
                <span className="input-icon">🕐</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>TIPO DE TUTORÍA</label>
            <div className="select-wrapper">
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="grupal">Grupal (hasta 20 personas)</option>
                <option value="individual">Individual (1 persona)</option>
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          <div className="form-group">
            <label>CARRERA</label>
            <div className="input-wrapper">
              <input type="text" name="carrera" value={form.carrera} onChange={handleChange} placeholder="Ej. Ingeniería Civil" />
              <span className="input-icon">🎓</span>
            </div>
          </div>

          <div className="acciones">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando...' : '📅 Crear Cita'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default NuevaCitaModal