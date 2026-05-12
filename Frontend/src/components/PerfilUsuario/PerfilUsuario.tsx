import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Box, Avatar, Alert, CircularProgress
} from '@mui/material';
import './PerfilUsuario.css';

interface PerfilUsuarioProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const PerfilUsuario: React.FC<PerfilUsuarioProps> = ({ open, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    nombre_completo: '',
    email: '',
    n_cuenta: '',
    carrera: '',
    role: ''
  });

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError('');
      setTimeout(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData({
            nombre_completo: user.nombre || user.nombre_completo || '',
            email: user.email || '',
            n_cuenta: user.n_cuenta || '',
            carrera: user.carrera || '',
            role: user.role || ''
          });
        }
        setLoading(false);
      }, 300);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = () => {
    setSaving(true);
    setError('');
    
    if (!userData.nombre_completo) {
      setError('El nombre completo es obligatorio');
      setSaving(false);
      return;
    }
    
    setTimeout(() => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.nombre = userData.nombre_completo;
          user.carrera = userData.carrera;
          localStorage.setItem('user', JSON.stringify(user));
        }
        setSuccess('Perfil actualizado correctamente');
        onUpdate();
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setError('Error al guardar los cambios');
      } finally {
        setSaving(false);
      }
    }, 500);
  };

  const getInitials = () => {
    if (userData.nombre_completo) {
      return userData.nombre_completo.charAt(0).toUpperCase();
    }
    if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      className="perfil-dialog"
      PaperProps={{ className: 'perfil-dialog-paper' }}
    >
      <div className="perfil-header">
        <h2>Mi Perfil</h2>
      </div>

      <DialogContent className="perfil-content">
        {loading ? (
          <Box className="perfil-loading">
            <CircularProgress sx={{ color: '#003DA5' }} />
          </Box>
        ) : (
          <>
            <Box className="perfil-avatar-container">
              <Avatar className="perfil-avatar">
                {getInitials()}
              </Avatar>
            </Box>

            {error && <Alert severity="error" className="perfil-alert">{error}</Alert>}
            {success && <Alert severity="success" className="perfil-alert">{success}</Alert>}

            <TextField
              fullWidth
              label="Nombre completo"
              name="nombre_completo"
              value={userData.nombre_completo}
              onChange={handleChange}
              className="perfil-field"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              value={userData.email}
              className="perfil-field"
              variant="outlined"
              disabled
              helperText="El correo no puede ser modificado"
            />

            <TextField
              fullWidth
              label="Número de cuenta"
              name="n_cuenta"
              value={userData.n_cuenta}
              className="perfil-field"
              variant="outlined"
              disabled
            />

            <TextField
              fullWidth
              label="Carrera"
              name="carrera"
              value={userData.carrera}
              onChange={handleChange}
              className="perfil-field"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Rol"
              name="role"
              value={
                userData.role === 'admin' ? 'Administrador' :
                userData.role === 'tutor' ? 'Tutor' :
                userData.role === 'tutorado' ? 'Tutorado' : 'Alumno'
              }
              className="perfil-field"
              variant="outlined"
              disabled
            />
          </>
        )}
      </DialogContent>

      <DialogActions className="perfil-actions">
        <Button onClick={onClose} className="perfil-btn-cancelar">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="perfil-btn-guardar"
          disabled={loading || saving}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerfilUsuario;