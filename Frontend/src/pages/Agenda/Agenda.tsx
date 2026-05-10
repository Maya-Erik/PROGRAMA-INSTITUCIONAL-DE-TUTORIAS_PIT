import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Avatar, Card, CardContent, Button, Chip, Tabs, Tab } from '@mui/material';
import Sidebar from "../../components/Sidebar/Sidebar";
import { obtenerCitas, misCitas, inscribirseCita } from '../../services/api';

const Agenda: React.FC = () => {
  const [citas, setCitas] = useState<any[]>([]);
  const [misCitasList, setMisCitasList] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.nombre || user.email?.split('@')[0] || 'Usuario');
      setUserRole(user.role || '');
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const citasRes = await obtenerCitas();
    const misCitasRes = await misCitas();
    if (citasRes.success) setCitas(citasRes.citas || []);
    if (misCitasRes.success) setMisCitasList(misCitasRes.citas || []);
  };

  const handleInscribirse = async (id: number) => {
    const res = await inscribirseCita(id);
    if (res.success) {
      alert('Te has inscrito correctamente');
      cargarDatos();
    } else {
      alert(res.error || 'Error al inscribirse');
    }
  };

  const estaInscrito = (citaId: number) => misCitasList.some(c => c.id_cita === citaId);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar userRole={userRole} />
      <Box sx={{ flexGrow: 1, p: 3, ml: '200px', mt: 8 }}>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Agenda de Tutorías</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{userName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {userRole === 'admin' ? 'ADMINISTRADOR' : userRole === 'tutor' ? 'TUTOR' : userRole === 'tutorado' ? 'TUTORADO' : 'ALUMNO'}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#003DA5' }}>{userName.charAt(0).toUpperCase()}</Avatar>
            </Box>
          </Box>

          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="Tutorías Disponibles" />
            <Tab label="Mis Tutorías" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
              {citas.map((cita) => (
                <Card key={cita.id_cita}>
                  <CardContent>
                    <Typography variant="h6">{cita.materia}</Typography>
                    <Typography color="text.secondary">{cita.tutor_nombre}</Typography>
                    <Typography variant="body2">📅 {cita.fecha}</Typography>
                    <Typography variant="body2">⏰ {cita.hora}</Typography>
                    <Typography variant="body2">📍 {cita.lugar}</Typography>
                    <Chip 
                      label={`${cita.inscritos || 0}/${cita.capacidad || 1} lugares`}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    {(userRole === 'alumno' || userRole === 'tutorado') && !estaInscrito(cita.id_cita) && (
                      <Button 
                        variant="contained" 
                        fullWidth
                        disabled={(cita.inscritos || 0) >= (cita.capacidad || 1)}
                        onClick={() => handleInscribirse(cita.id_cita)}
                        sx={{ bgcolor: '#003DA5' }}
                      >
                        {(cita.inscritos || 0) >= (cita.capacidad || 1) ? 'Sin cupo' : 'Inscribirse'}
                      </Button>
                    )}
                    {estaInscrito(cita.id_cita) && (
                      <Chip label="Ya inscrito" color="success" sx={{ width: '100%' }} />
                    )}
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
              {misCitasList.map((cita) => (
                <Card key={cita.id_cita}>
                  <CardContent>
                    <Typography variant="h6">{cita.materia}</Typography>
                    <Typography color="text.secondary">{cita.tutor_nombre}</Typography>
                    <Typography variant="body2">📅 {cita.fecha}</Typography>
                    <Typography variant="body2">⏰ {cita.hora}</Typography>
                    <Typography variant="body2">📍 {cita.lugar}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Agenda;