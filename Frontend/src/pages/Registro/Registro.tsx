import React, { useState } from 'react';
import './Registro.css';

interface RegistroProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistroSuccess?: () => void;
}

const Registro: React.FC<RegistroProps> = ({ isOpen, onClose, onRegistroSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    carrera: '',
    numeroCuenta: '',
    password: '',
    confirmPassword: '',
    rol: '4'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const carreras = [
    "Actuaría",
    "Arquitectura",
    "Ciencia de Datos",
    "Ciencias Políticas y Administración Pública",
    "Comunicación",
    "Derecho",
    "Diseño Gráfico",
    "Economía",
    "Enseñanza de Inglés",
    "Filosofía",
    "Historia",
    "Ingeniería Civil",
    "Lengua y Literatura Hispánicas",
    "Matemáticas Aplicadas y Computación",
    "Pedagogía",
    "Relaciones Internacionales",
    "Sociología"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    
    if (e.target.name === 'usuario') {
      value = value.replace(/@.*$/, '');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.nombre || !formData.usuario || !formData.carrera || !formData.numeroCuenta || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const usuarioRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usuarioRegex.test(formData.usuario)) {
      setError('El usuario solo puede contener letras, números, puntos y guiones');
      setLoading(false);
      return;
    }

    const emailCompleto = `${formData.usuario}@pcpuma.acatlan.unam.mx`;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          n_cuenta: formData.numeroCuenta,
          email: emailCompleto,
          password: formData.password,
          nombre_completo: formData.nombre,
          carrera: formData.carrera,
          id_rol: parseInt(formData.rol)
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Registro exitoso. Tu correo es: ${emailCompleto}\nAhora puedes iniciar sesión.`);
        onClose();
        if (onRegistroSuccess) onRegistroSuccess();
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="registro-modal-overlay" onClick={onClose}>
      <div className="registro-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="registro-modal-close" onClick={onClose}>×</button>
        
        <h2>Registrarse</h2>
        <p className="registro-subtitle">Crea tu cuenta para acceder al sistema de tutorías</p>
        
        <form onSubmit={handleSubmit}>
          <div className="registro-form-group">
            <label htmlFor="nombre">Nombre completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez García"
              required
            />
          </div>

          <div className="registro-form-group">
            <label htmlFor="usuario">Usuario (correo institucional) *</label>
            <div className="registro-email-wrapper">
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="usuario"
                required
              />
              <span className="registro-email-domain">@pcpuma.acatlan.unam.mx</span>
            </div>
            <small>Ej: 529461453</small>
          </div>

          <div className="registro-form-group">
            <label htmlFor="carrera">Carrera *</label>
            <select
              id="carrera"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu carrera</option>
              {carreras.map((carrera, index) => (
                <option key={index} value={carrera}>{carrera}</option>
              ))}
            </select>
          </div>

          <div className="registro-form-group">
            <label htmlFor="rol">Tipo de usuario *</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="4">Alumno</option>
              <option value="3">Tutorado</option>
              <option value="2">Tutor</option>
            </select>
            <small>Selecciona el tipo de usuario que serás</small>
          </div>

          <div className="registro-form-group">
            <label htmlFor="numeroCuenta">Número de cuenta *</label>
            <input
              type="text"
              id="numeroCuenta"
              name="numeroCuenta"
              value={formData.numeroCuenta}
              onChange={handleChange}
              placeholder="Ej: 123456789"
              required
            />
          </div>

          <div className="registro-form-group">
            <label htmlFor="password">Contraseña *</label>
            <div className="registro-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button 
                type="button"
                className="registro-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="registro-form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña *</label>
            <div className="registro-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
              />
              <button 
                type="button"
                className="registro-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-symbols-outlined">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          
          {error && <div className="registro-error-message">{error}</div>}
          
          <button type="submit" className="registro-btn-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          
          <p className="registro-footer-text">
            ¿Ya tienes cuenta? <button type="button" className="registro-link-btn" onClick={onClose}>Inicia sesión</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registro;