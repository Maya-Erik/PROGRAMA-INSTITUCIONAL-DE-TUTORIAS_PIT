import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import './Login.css';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Agregar @pcpuma.acatlan.unam.mx automáticamente
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Eliminar cualquier @ que el usuario intente escribir
    value = value.replace(/@.*$/, '');
    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Completar el correo automáticamente
    const emailCompleto = `${email}@pcpuma.acatlan.unam.mx`;

    try {
      const data = await login(emailCompleto, password);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: emailCompleto, role: data.role }));
        
        console.log('Login exitoso');
        onClose();
        navigate('/agenda');
        window.location.reload();
      } else {
        setError(data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
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
            <label htmlFor="email">Correo institucional:</label>
            <div className="email-input-wrapper">
              <input
                type="text"
                id="email"
                value={email}
                onChange={handleEmailChange}
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
                {showPassword ? (
                  <span className="material-symbols-outlined">visibility_off</span>
                ) : (
                  <span className="material-symbols-outlined">visibility</span>
                )}
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