import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardContent, Box, Chip, Select, MenuItem, FormControl, Typography, 
  Button, Alert, Snackbar, Tabs, Tab, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from "../../components/Sidebar/Sidebar";
import PerfilUsuario from '../../components/PerfilUsuario/PerfilUsuario';
import { 
  obtenerCitas, inscribirseCita, misCitas, cancelarInscripcionCita
} from '../../services/api';
import SidebarToggle from '../../components/Sidebar/SidebarToggle';
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
  const [misCitasList, setMisCitasList] = useState<Cita[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userCarrera, setUserCarrera] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [filtroCarrera, setFiltroCarrera] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserRole(user.role || '');
          setUserName(user.nombre || user.nombre_completo || user.email?.split('@')[0] || 'Usuario');
          setUserCarrera(user.carrera || '');
          setUserId(user.id || 0);
        }
        await Promise.all([cargarCitas(), cargarMisCitas()]);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const cargarCitas = async () => {
    try {
      const result = await obtenerCitas();
      if (result.success) {
        setCitas(result.citas || []);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  const cargarMisCitas = async () => {
    try {
      const result = await misCitas();
      if (result.success) {
        setMisCitasList(result.citas || []);
      }
    } catch (error) {
      console.error('Error al cargar mis citas:', error);
    }
  };

  const handleOpenPerfil = () => {
    setOpenPerfilModal(true);
  };

  const handlePerfilUpdate = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.nombre || user.nombre_completo || user.email?.split('@')[0] || 'Usuario');
      setUserCarrera(user.carrera || '');
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

  const handleCancelarInscripcion = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar tu inscripción a esta tutoría?')) {
      const result = await cancelarInscripcionCita(id);
      if (result.success) {
        setSnackbar({ open: true, message: 'Has cancelado tu inscripción', severity: 'success' });
        cargarCitas();
        cargarMisCitas();
      } else {
        setSnackbar({ open: true, message: result.error || 'Error al cancelar inscripción', severity: 'error' });
      }
    }
  };

  const estaInscrito = (citaId: number) => {
    return misCitasList.some(c => c.id_cita === citaId);
  };

  const esCreador = (cita: Cita) => {
    return cita.id_creador === userId;
  };

  // Verificar si el usuario puede inscribirse (solo alumno y tutorado)
  const puedeInscribirse = () => {
    return userRole === 'alumno' || userRole === 'tutorado';
  };

  const citasDisponibles = () => {
    if (userRole === 'alumno') {
      if (filtroCarrera) {
        return citas.filter(c => c.carrera === filtroCarrera);
      }
      return citas.filter(c => c.carrera === userCarrera);
    }
    return citas;
  };

  const misCitasFiltradas = () => {
    if (userRole === 'alumno') {
      return misCitasList;
    }
    return misCitasList.filter(cita => {
      return estaInscrito(cita.id_cita) || esCreador(cita);
    });
  };

  const getEstadoUsuario = (cita: Cita) => {
    if (esCreador(cita)) {
      return { label: 'Creador', color: '#D6A600', bgColor: '#FFF3E0' };
    }
    if (estaInscrito(cita.id_cita)) {
      return { label: 'Inscrito', color: '#28a745', bgColor: '#E8F5E9' };
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="agenda-layout" sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar userRole={userRole} />
        <SidebarToggle />
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
                <Tab label="Tutorias Disponibles" />
                <Tab label="Mis Tutorias" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <>
                <Box className="filter-section" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon color="primary" /> Tutorias Disponibles
                  </Typography>
                  {userRole === 'alumno' && (
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={filtroCarrera}
                        onChange={(e) => setFiltroCarrera(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Mi carrera ({userCarrera})</MenuItem>
                        <MenuItem value="Actuaria">Actuaria</MenuItem>
                        <MenuItem value="Arquitectura">Arquitectura</MenuItem>
                        <MenuItem value="Ciencias Politicas y Administracion Publica">Ciencias Politicas</MenuItem>
                        <MenuItem value="Comunicacion">Comunicacion</MenuItem>
                        <MenuItem value="Derecho">Derecho</MenuItem>
                        <MenuItem value="Diseño Grafico">Diseño Grafico</MenuItem>
                        <MenuItem value="Economia">Economia</MenuItem>
                        <MenuItem value="Enseñanza de Ingles">Enseñanza de Ingles</MenuItem>
                        <MenuItem value="Filosofia">Filosofia</MenuItem>
                        <MenuItem value="Historia">Historia</MenuItem>
                        <MenuItem value="Ingenieria Civil">Ingenieria Civil</MenuItem>
                        <MenuItem value="Lengua y Literaturas Hispanicas">Lengua y Literaturas</MenuItem>
                        <MenuItem value="Matematicas Aplicadas y Computacion">Matematicas Aplicadas</MenuItem>
                        <MenuItem value="Pedagogia">Pedagogia</MenuItem>
                        <MenuItem value="Relaciones Internacionales">Relaciones Internacionales</MenuItem>
                        <MenuItem value="Sociologia">Sociologia</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                  {citasDisponibles().map((cita) => (
                    <Card key={cita.id_cita} className="agenda-tutoria-card">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box className="agenda-icon-box">
                            <span role="img" aria-label="evento">📅</span>
                          </Box>
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
                        <Typography variant="body2" color="textSecondary">⏰ {cita.hora}</Typography>
                        <Typography variant="body2" color="textSecondary">📍 {cita.lugar || 'Por asignar'}</Typography>
                        <Typography variant="body2" color="textSecondary">🎓 {cita.carrera}</Typography>
                      </CardContent>
                      <Box sx={{ p: 2 }}>
                        {puedeInscribirse() && !estaInscrito(cita.id_cita) && !esCreador(cita) && (
                          <Button 
                            variant="contained" 
                            size="small"
                            fullWidth
                            disabled={(cita.inscritos || 0) >= (cita.capacidad || 1)}
                            onClick={() => handleInscribirse(cita.id_cita)}
                            sx={{ bgcolor: '#003DA5' }}
                          >
                            {(cita.inscritos || 0) >= (cita.capacidad || 1) ? 'Sin cupo' : 'Inscribirse'}
                          </Button>
                        )}
                        {puedeInscribirse() && estaInscrito(cita.id_cita) && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            fullWidth
                            color="error"
                            onClick={() => handleCancelarInscripcion(cita.id_cita)}
                          >
                            Cancelar inscripción
                          </Button>
                        )}
                        {esCreador(cita) && (
                          <Chip label="Creada por ti" size="small" sx={{ width: '100%', bgcolor: '#D6A600', color: '#001F54' }} />
                        )}
                      </Box>
                    </Card>
                  ))}
                </Box>
              </>
            )}

            {tabValue === 1 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {misCitasFiltradas().map((cita) => {
                  const estado = getEstadoUsuario(cita);
                  return (
                    <Card key={cita.id_cita} className="agenda-tutoria-card">
                      <CardContent>
                        <Typography variant="h6">{cita.materia}</Typography>
                        <Typography variant="body2" color="textSecondary">{cita.tutor_nombre}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          📅 {new Date(cita.fecha).toLocaleDateString('es-MX')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">⏰ {cita.hora}</Typography>
                        <Typography variant="body2" color="textSecondary">📍 {cita.lugar || 'Por asignar'}</Typography>
                        {estado && (
                          <Chip 
                            label={estado.label} 
                            size="small" 
                            sx={{ mt: 1, bgcolor: estado.bgColor, color: estado.color, fontWeight: 'bold' }}
                          />
                        )}
                        <Chip 
                          label={cita.estado === 'disponible' ? 'Activa' : 'Completada'}
                          size="small" 
                          sx={{ mt: 1, ml: estado ? 1 : 0 }}
                        />
                        {puedeInscribirse() && estado?.label === 'Inscrito' && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            fullWidth
                            color="error"
                            sx={{ mt: 1 }}
                            onClick={() => handleCancelarInscripcion(cita.id_cita)}
                          >
                            Cancelar inscripción
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {misCitasFiltradas().length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
                    <Typography variant="body1" color="textSecondary">
                      No hay tutorias registradas
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Container>
        </main>
      </Box>

      <PerfilUsuario 
        open={openPerfilModal} 
        onClose={() => setOpenPerfilModal(false)}
        onUpdate={handlePerfilUpdate}
      />

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
    </ThemeProvider>
  );
};

export default Agenda;