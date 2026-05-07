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
    email: '',
    carrera: '',
    numeroCuenta: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lista de carreras
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.carrera || !formData.numeroCuenta || !formData.password) {
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

    // Validar formato de correo institucional
    const emailRegex = /^[a-zA-Z0-9._-]+@(?:[a-zA-Z0-9.-]+\.)?(comunidad\.)?unam\.mx$/;
    if (!emailRegex.test(formData.email)) {
      setError('Debes usar un correo institucional de la UNAM (@unam.mx o @comunidad.unam.mx)');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          n_cuenta: formData.numeroCuenta,
          email: formData.email,
          password: formData.password,
          nombre_completo: formData.nombre,
          carrera: formData.carrera,
          id_rol: 3
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
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
            <label htmlFor="email">Correo institucional *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@unam.mx"
              required
            />
            <small>Usa tu correo @unam.mx o @comunidad.unam.mx</small>
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
                {showPassword ? (
                  <span className="material-symbols-outlined">visibility_off</span>
                ) : (
                  <span className="material-symbols-outlined">visibility</span>
                )}
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
                {showConfirmPassword ? (
                  <span className="material-symbols-outlined">visibility_off</span>
                ) : (
                  <span className="material-symbols-outlined">visibility</span>
                )}
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