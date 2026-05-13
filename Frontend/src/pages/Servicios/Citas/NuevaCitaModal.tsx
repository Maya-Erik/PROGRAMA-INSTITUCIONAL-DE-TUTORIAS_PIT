import "./NuevaCitaModal.css"
import { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import { crearCita, getUserRole } from "../../../services/api"

interface Props {
  isOpen: boolean
  onClose: () => void
  onCitaCreada?: () => void
}

function NuevaCitaModal({ isOpen, onClose, onCitaCreada }: Props) {
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

  // Establecer el tutor automaticamente al abrir el modal
  useEffect(() => {
    if (isOpen && (userRole === 'tutor' || userRole === 'tutorado') && userName) {
      setForm(prev => ({ ...prev, tutor_nombre: userName }))
    }
  }, [isOpen, userRole, userName])

  // Ajustar capacidad cuando cambia el tipo
  useEffect(() => {
    if (form.tipo === 'individual') {
      setForm(prev => ({ ...prev, capacidad: 1 }))
    }
  }, [form.tipo])

  const carreras = [
    "Actuaria", "Arquitectura", "Ciencias Politicas y Administracion Publica",
    "Comunicacion", "Derecho", "Diseño Grafico", "Economia",
    "Enseñanza de (Español) (Inglés) Como Lengua Extranjera", "Enseñanza de Ingles",
    "Filosofia", "Historia", "Ingenieria Civil", "Lengua y Literaturas Hispanicas",
    "Matematicas Aplicadas y Computacion", "Pedagogia", "Relaciones Internacionales",
    "Sociologia", "Derecho (SUAyED)", "Relaciones Internacionales (SUAyED)", "LICEL"
  ]

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    if (!form.tema || !form.fecha || !form.hora || !form.carrera) {
      alert("Por favor completa todos los campos obligatorios")
      setLoading(false)
      return
    }

    // Asegurar que el tutor_nombre no este vacio
    const tutorNombre = form.tutor_nombre || userName

    const citaData = {
      materia: form.tema,
      tutor_nombre: tutorNombre,
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
        if (onCitaCreada) onCitaCreada()
        handleClose()
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
    <div className="modal-overlay-nueva" onClick={handleClose}>
      <div className="modal-cita-nueva" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-nueva">
          <h2>Agendar Nueva Tutoria</h2>
          <button type="button" className="modal-close-btn-nueva" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form className="modal-form-nueva" onSubmit={handleSubmit}>
          <div className="form-row-nueva">
            <div className="form-group-nueva">
              <label>TEMA *</label>
              <input
                type="text"
                name="tema"
                value={form.tema}
                onChange={handleChange}
                placeholder="Ej: Calculo Diferencial"
                required
              />
            </div>

            <div className="form-group-nueva">
              <label>TUTOR *</label>
              <input
                type="text"
                name="tutor_nombre"
                value={userRole === 'tutor' || userRole === 'tutorado' ? userName : form.tutor_nombre}
                onChange={handleChange}
                placeholder="Nombre del tutor"
                readOnly={userRole === 'tutor' || userRole === 'tutorado'}
                required
              />
            </div>
          </div>

          <div className="form-row-nueva">
            <div className="form-group-nueva">
              <label>FECHA *</label>
              <input 
                type="date" 
                name="fecha" 
                value={form.fecha} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group-nueva">
              <label>HORA *</label>
              <input 
                type="time" 
                name="hora" 
                value={form.hora} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row-nueva">
            <div className="form-group-nueva">
              <label>TIPO *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="grupal">Grupal</option>
                <option value="individual">Individual</option>
              </select>
            </div>

            <div className="form-group-nueva">
              <label>CAPACIDAD</label>
              <input 
                type="number" 
                name="capacidad" 
                value={form.capacidad} 
                onChange={handleChange} 
                min="1" 
                max="20"
                disabled={form.tipo === 'individual'}
              />
              {form.tipo === 'individual' && (
                <small>Individual: capacidad 1 persona</small>
              )}
            </div>
          </div>

          <div className="form-group-nueva">
            <label>CARRERA *</label>
            <select name="carrera" value={form.carrera} onChange={handleChange} required>
              <option value="">Selecciona una carrera</option>
              {carreras.map((carrera, i) => (
                <option key={i} value={carrera}>{carrera}</option>
              ))}
            </select>
          </div>

          <div className="form-group-nueva">
            <label>SALON / LUGAR</label>
            <input
              type="text"
              name="lugar"
              value={form.lugar}
              onChange={handleChange}
              placeholder="Ej. Salon 301, Virtual"
            />
            <small>El salon sera asignado por administracion</small>
          </div>

          <div className="acciones-nueva">
            <button type="button" className="btn-cancel-nueva" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit-nueva" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Tutoria'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default NuevaCitaModal