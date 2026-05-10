import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Avatar, Alert, CircularProgress
} from '@mui/material';

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
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => {
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
      setSaving(false);
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#003DA5', color: 'white' }}>
        Mi Perfil
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#D6A600', fontSize: 32 }}>
                {getInitials()}
              </Avatar>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TextField
              fullWidth
              label="Nombre completo"
              name="nombre_completo"
              value={userData.nombre_completo}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              value={userData.email}
              margin="normal"
              variant="outlined"
              disabled
              helperText="El correo no puede ser modificado"
            />

            <TextField
              fullWidth
              label="Número de cuenta"
              name="n_cuenta"
              value={userData.n_cuenta}
              margin="normal"
              variant="outlined"
              disabled
            />

            <TextField
              fullWidth
              label="Carrera"
              name="carrera"
              value={userData.carrera}
              onChange={handleChange}
              margin="normal"
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
              margin="normal"
              variant="outlined"
              disabled
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || saving}
          sx={{ bgcolor: '#003DA5', '&:hover': { bgcolor: '#002c7a' } }}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerfilUsuario;