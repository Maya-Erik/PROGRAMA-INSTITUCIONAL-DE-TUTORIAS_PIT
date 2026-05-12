import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import './Login.css';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/@.*$/, '');
    setUsuario(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailCompleto = `${usuario}@pcpuma.acatlan.unam.mx`;

    console.log('📧 Intentando login con:', emailCompleto);
    console.log('🔑 Contraseña:', password);

    try {
      const data = await login(emailCompleto, password);
      console.log('📥 Respuesta del servidor:', data);
      
      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', String(data.user.id)); //Esta se eliminara(solo es prueba)
        
        console.log('Login exitoso:', data.user);
        
        onClose();
        if (onLoginSuccess) onLoginSuccess();
        
        // Redirigir según el rol
        if (data.user.role === 'admin') {
          navigate("/agenda");
        } else if (data.user.role === 'tutor' || data.user.role === 'tutorado') {
          navigate('/agenda');
        } else {
          navigate('/agenda');
        }
        
        window.location.reload(); // Recargar para actualizar navbar
      } else {
        setError(data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usuario">Usuario (correo institucional):</label>
            <div className="email-input-wrapper">
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={handleUsuarioChange}
                placeholder="usuario"
                required
              />
              <span className="email-domain">@pcpuma.acatlan.unam.mx</span>
            </div>
            <small>Ingresa solo tu usuario (sin el @)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;