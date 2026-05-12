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
  obtenerCitas, inscribirseCita, misCitas
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
  const [misCitasList, setMisCitasList] = useState<Cita[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openPerfilModal, setOpenPerfilModal] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userCarrera, setUserCarrera] = useState<string>('');
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

  const citasFiltradas = () => {
    let filtradas = citas;
    if (filtroCarrera && userRole === 'alumno') {
      filtradas = filtradas.filter(c => c.carrera === filtroCarrera);
    }
    return filtradas;
  };

  const handlePerfilUpdate = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.nombre || user.nombre_completo || user.email?.split('@')[0] || 'Usuario');
      setUserCarrera(user.carrera || '');
    }
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
                      <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(userRole === 'alumno' || userRole === 'tutorado') && !estaInscrito(cita.id_cita) && (
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
                        {estaInscrito(cita.id_cita) && (
                          <Chip label="Inscrito" color="success" size="small" sx={{ width: '100%' }} />
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
                      <Typography variant="body2" color="textSecondary">⏰ {cita.hora}</Typography>
                      <Typography variant="body2" color="textSecondary">📍 {cita.lugar || 'Por asignar'}</Typography>
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