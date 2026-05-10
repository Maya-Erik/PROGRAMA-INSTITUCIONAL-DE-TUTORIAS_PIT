import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardContent, Box, Chip, Select, MenuItem, FormControl, Typography, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Alert, Snackbar, Tabs, Tab, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from "../../components/Sidebar/Sidebar";
import PerfilUsuario from '../../components/PerfilUsuario/PerfilUsuario';
import { 
  obtenerCitas, crearCita, editarCita, eliminarCita, 
  inscribirseCita, misCitas
} from '../../services/api';
import './Agenda.css';

const theme = createTheme({
  palette: {
    primary: { main: '#003DA5' },
    secondary: { main: '#D6A600' },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

interface Cita {
  id_cita: number;
  materia: string;
  tutor_nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
  capacidad: number;
  inscritos: number;
  tipo: string;
  carrera: string;
  estado: string;
  id_creador: number;
}



const Agenda: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [misCitasList, setMisCitasList] = useState<Cita[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editandoCita, setEditandoCita] = useState<Cita | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userCarrera, setUserCarrera] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [filtroCarrera, setFiltroCarrera] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    materia: '',
    tutor_nombre: '',
    fecha: '',
    hora: '',
    capacidad: 20,
    tipo: 'grupal',
    carrera: ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserRole(user.role || '');
          setUserName(user.nombre || user.email?.split('@')[0] || 'Usuario');
          setUserCarrera(user.carrera || '');
          setUserId(user.id || 0);
          setFormData(prev => ({ ...prev, carrera: user.carrera || '' }));
        }
        await Promise.all([cargarCitas(), cargarMisCitas()]);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const handleOpenPerfil = () => {
    setOpenPerfilModal(true);
  };

  const cargarCitas = async () => {
    const result = await obtenerCitas();
    if (result.success) {
      setCitas(result.citas || []);
    }
  };

  const cargarMisCitas = async () => {
    const result = await misCitas();
    if (result.success) {
      setMisCitasList(result.citas || []);
    }
  };

  const handleOpenModal = (cita?: Cita) => {
    if (cita) {
      setEditandoCita(cita);
      setFormData({
        materia: cita.materia,
        tutor_nombre: cita.tutor_nombre,
        fecha: cita.fecha,
        hora: cita.hora,
        capacidad: cita.capacidad,
        tipo: cita.tipo,
        carrera: cita.carrera
      });
    } else {
      setEditandoCita(null);
      setFormData({
        materia: '',
        tutor_nombre: '',
        fecha: '',
        hora: '',
        capacidad: 20,
        tipo: 'grupal',
        carrera: userCarrera
      });
    }
    setOpenModal(true);
  };

  const handleSubmitCita = async () => {
    if (!formData.materia || !formData.tutor_nombre || !formData.fecha || !formData.hora) {
      setSnackbar({ open: true, message: 'Todos los campos son obligatorios', severity: 'error' });
      return;
    }

    try {
      let result;
      if (editandoCita) {
        result = await editarCita(editandoCita.id_cita, formData);
      } else {
        result = await crearCita(formData);
      }
      
      if (result.success) {
        setSnackbar({ open: true, message: `Cita ${editandoCita ? 'actualizada' : 'creada'} correctamente`, severity: 'success' });
        setOpenModal(false);
        cargarCitas();
        cargarMisCitas();
      } else {
        setSnackbar({ open: true, message: result.error || 'Error al guardar cita', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar cita', severity: 'error' });
    }
  };

  const handleEliminarCita = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      const result = await eliminarCita(id);
      if (result.success) {
        setSnackbar({ open: true, message: 'Cita eliminada correctamente', severity: 'success' });
        cargarCitas();
        cargarMisCitas();
      } else {
        setSnackbar({ open: true, message: result.error || 'Error al eliminar cita', severity: 'error' });
      }
    }
  };

  const handleInscribirse = async (id: number) => {
    const result = await inscribirseCita(id);
    if (result.success) {
      setSnackbar({ open: true, message: 'Te has inscrito correctamente', severity: 'success' });
      cargarCitas();
      cargarMisCitas();
    } else {
      setSnackbar({ open: true, message: result.error || 'Error al inscribirse', severity: 'error' });
    }
  };

  const estaInscrito = (citaId: number) => {
    return misCitasList.some(c => c.id_cita === citaId);
  };

  const puedeEditar = (cita: Cita) => {
    return userRole === 'admin' || cita.id_creador === userId;
  };

  const citasFiltradas = () => {
    let filtradas = citas;
    if (filtroCarrera && userRole === 'alumno') {
      filtradas = filtradas.filter(c => c.carrera === filtroCarrera);
    }
    return filtradas;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="agenda-layout">
        <Sidebar userRole={userRole} />
        
        <main className="agenda-main">
          <header className="agenda-topbar">
            <span className="agenda-breadcrumb">Panel › Agenda</span>
            <div className="agenda-topbar-right">
              <div className="agenda-topbar-user">
                <div>
                  <p className="agenda-topbar-name">{userName}</p>
                  <p className="agenda-topbar-role">
                    {userRole === 'admin' ? 'ADMINISTRADOR' : 
                     userRole === 'tutor' ? 'TUTOR' :
                     userRole === 'tutorado' ? 'TUTORADO' : 'ALUMNO'}
                  </p>
                </div>
                <Avatar 
                  className="agenda-topbar-avatar" 
                  sx={{ bgcolor: '#003DA5', cursor: 'pointer' }}
                  onClick={handleOpenPerfil}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                              </div>
            </div>
          </header>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                <Tab label="Tutorías Disponibles" />
                <Tab label="Mis Tutorías" />
              </Tabs>
            </Box>

            {(userRole === 'tutor' || userRole === 'tutorado' || userRole === 'admin') && (
              <Button 
                variant="contained" 
                onClick={() => handleOpenModal()}
                sx={{ mb: 2, bgcolor: '#D6A600', '&:hover': { bgcolor: '#c09500' } }}
              >
                + Crear Nueva Tutoría
              </Button>
            )}

            {tabValue === 0 && (
              <>
                <Box className="filter-section" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon color="primary" /> Tutorías Disponibles
                  </Typography>
                  {userRole === 'alumno' && (
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={filtroCarrera}
                        onChange={(e) => setFiltroCarrera(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Todas las carreras</MenuItem>
                        <MenuItem value={userCarrera}>{userCarrera}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                  {citasFiltradas().map((cita) => (
                    <Card key={cita.id_cita} className="agenda-tutoria-card">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box className="agenda-icon-box"><EventIcon /></Box>
                          <Chip 
                            label={(cita.inscritos || 0) >= (cita.capacidad || 1) ? "LLENO" : `${cita.inscritos || 0}/${cita.capacidad || 1} lugares`}
                            size="small" 
                            sx={{ 
                              fontWeight: 'bold',
                              backgroundColor: (cita.inscritos || 0) >= (cita.capacidad || 1) ? '#ffebee' : '#e8f5e9',
                              color: (cita.inscritos || 0) >= (cita.capacidad || 1) ? '#c62828' : '#2e7d32'
                            }} 
                          />
                        </Box>
                        <Typography variant="h6">{cita.materia}</Typography>
                        <Typography variant="body2" color="textSecondary">{cita.tutor_nombre}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          📅 {new Date(cita.fecha).toLocaleDateString('es-MX')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">{cita.hora}</Typography>
                        <Typography variant="body2" color="textSecondary">{cita.lugar || 'Por asignar'}</Typography>
                        <Typography variant="body2" color="textSecondary">{cita.carrera}</Typography>
                      </CardContent>
                      <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {puedeEditar(cita) && (
                          <>
                            <Button size="small" onClick={() => handleOpenModal(cita)} startIcon={<EditIcon />}>
                              Editar
                            </Button>
                            <Button size="small" color="error" onClick={() => handleEliminarCita(cita.id_cita)} startIcon={<DeleteIcon />}>
                              Eliminar
                            </Button>
                          </>
                        )}
                        {(userRole === 'alumno' || userRole === 'tutorado') && !estaInscrito(cita.id_cita) && (
                          <Button 
                            variant="contained" 
                            size="small"
                            disabled={(cita.inscritos || 0) >= (cita.capacidad || 1)}
                            onClick={() => handleInscribirse(cita.id_cita)}
                            sx={{ bgcolor: '#003DA5' }}
                          >
                            {(cita.inscritos || 0) >= (cita.capacidad || 1) ? 'Sin cupo' : 'Inscribirse'}
                          </Button>
                        )}
                        {estaInscrito(cita.id_cita) && (
                          <Chip label="Inscrito" color="success" size="small" />
                        )}
                      </Box>
                    </Card>
                  ))}
                </Box>
              </>
            )}

            {tabValue === 1 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {misCitasList.map((cita) => (
                  <Card key={cita.id_cita} className="agenda-tutoria-card">
                    <CardContent>
                      <Typography variant="h6">{cita.materia}</Typography>
                      <Typography variant="body2" color="textSecondary">{cita.tutor_nombre}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        📅 {new Date(cita.fecha).toLocaleDateString('es-MX')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">{cita.hora}</Typography>
                      <Typography variant="body2" color="textSecondary">{cita.lugar || 'Por asignar'}</Typography>
                      <Chip 
                        label={cita.estado === 'disponible' ? 'Activa' : 'Completada'}
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Container>
        </main>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editandoCita ? 'Editar Tutoría' : 'Crear Nueva Tutoría'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Materia"
            value={formData.materia}
            onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Tutor/Profesor"
            value={formData.tutor_nombre}
            onChange={(e) => setFormData({ ...formData, tutor_nombre: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="date"
            label="Fecha"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            type="time"
            label="Hora"
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            type="number"
            label="Capacidad (máx. 20)"
            value={formData.capacidad}
            onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
            margin="normal"
            inputProps={{ min: 1, max: 20 }}
          />
          <FormControl fullWidth margin="normal">
            <Select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            >
              <MenuItem value="grupal">Grupal (hasta 20 personas)</MenuItem>
              <MenuItem value="individual">Individual (1 persona)</MenuItem>
            </Select>
          </FormControl>
          <Alert severity="info" sx={{ mt: 2 }}>
            El salón será asignado por administración. Las tutorías grupales tienen cupo limitado.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleSubmitCita} variant="contained" sx={{ bgcolor: '#003DA5' }}>
            {editandoCita ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <PerfilUsuario 
        open={openPerfilModal} 
        onClose={() => setOpenPerfilModal(false)}
        onUpdate={() => {
          // Recargar datos del usuario después de actualizar perfil
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            setUserName(user.nombre || user.email?.split('@')[0] || 'Usuario');
          }
        }}
      />

    </ThemeProvider>
  );
};

export default Agenda;