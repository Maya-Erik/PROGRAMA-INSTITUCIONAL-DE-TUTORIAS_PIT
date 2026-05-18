import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Card, CardContent,
    CircularProgress, Chip, Table, TableHead, TableRow, TableCell,
    TableBody, TableContainer, Button, Tooltip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import Sidebar from '../../components/Sidebar/Sidebar';
import { obtenerReportesEstadisticas } from '../../services/api';
import './Reportes.css';

const theme = createTheme({
  palette: {
    primary: { main: '#003DA5' },
    secondary: { main: '#D6A600' },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

const COLORS = ['#003DA5', '#D6A600', '#28a745', '#17a2b8', '#6f42c1', '#fd7e14'];

const Reportes: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>('');
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserRole(user.role || '');
            setUserName(user.nombre || user.nombre_completo || user.email?.split('@')[0] || 'Usuario');
        }
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        setLoading(true);
        try {
            const data = await obtenerReportesEstadisticas();
            if (data.success) {
                setStats(data.stats);
                setUserRole(data.userRole);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportarCSV = () => {
        if (!stats) return;
        
        let csvData: any[] = [];
        
        if (userRole === 'admin') {
            csvData = [
                ['Reporte General - PIT FES Acatlán'],
                ['Fecha de exportación:', new Date().toLocaleString()],
                [],
                ['Total Usuarios', stats.usuariosPorRol?.reduce((acc: number, r: any) => acc + parseInt(r.total), 0) || 0],
                ['Total Inscripciones', stats.totalInscripciones || 0],
                ['Usuarios Activos', stats.usuariosActivos?.activos || 0],
                ['Total Citas', stats.citasPorEstado?.reduce((acc: number, e: any) => acc + parseInt(e.total), 0) || 0],
                [],
                ['Top 5 Temas más solicitados'],
                ['Tema', 'Cantidad'],
                ...(stats.topMaterias?.map((m: any) => [m.materia, m.total]) || []),
                [],
                ['Top 5 Tutores con más citas'],
                ['Tutor', 'Cantidad'],
                ...(stats.topTutores?.map((t: any) => [t.tutor_nombre, t.total]) || []),
                [],
                ['Citas por Mes'],
                ['Mes', 'Cantidad'],
                ...(stats.citasPorMes?.map((m: any) => [m.mes, m.total]) || [])
            ];
        } else if (userRole === 'tutor') {
            csvData = [
                ['Reporte de Tutor - PIT FES Acatlán'],
                ['Fecha de exportación:', new Date().toLocaleString()],
                ['Tutor:', userName],
                [],
                ['Total Citas Creadas', stats.totalCitas || 0],
                ['Alumnos Atendidos', stats.totalAlumnos || 0],
                ['Citas Activas', stats.citasPorEstado?.find((e: any) => e.estado === 'disponible')?.total || 0],
                [],
                ['Top Temas que impartes'],
                ['Tema', 'Cantidad'],
                ...(stats.topMaterias?.map((m: any) => [m.materia, m.total]) || []),
                [],
                ['Citas por Mes'],
                ['Mes', 'Cantidad'],
                ...(stats.citasPorMes?.map((m: any) => [m.mes, m.total]) || [])
            ];
        } else if (userRole === 'tutorado') {
            csvData = [
                ['Reporte de Tutorado - PIT FES Acatlán'],
                ['Fecha de exportación:', new Date().toLocaleString()],
                ['Tutorado:', userName],
                [],
                ['Total Tutorías Tomadas', stats.totalInscripciones || 0],
                ['Tutorías Pendientes', stats.citasPorEstado?.find((e: any) => e.estado === 'disponible')?.total || 0],
                [],
                ['Temas que más has tomado'],
                ['Tema', 'Cantidad'],
                ...(stats.topMaterias?.map((m: any) => [m.materia, m.total]) || []),
                [],
                ['Tutores que más te han apoyado'],
                ['Tutor', 'Cantidad'],
                ...(stats.topTutores?.map((t: any) => [t.tutor_nombre, t.total]) || [])
            ];
        }
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `reporte_${userRole}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <div className="reportes-layout">
                    <Sidebar userRole={userRole} />
                    <div className="reportes-main">
                        <div className="reportes-loading">
                            <CircularProgress sx={{ color: '#003DA5' }} />
                            <Typography>Cargando estadísticas...</Typography>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="reportes-layout">
                <Sidebar userRole={userRole} />
                
                <div className="reportes-main">
                    <div className="reportes-header">
                        <div>
                            <Typography variant="h4" className="reportes-titulo">
                                Reportes y Estadísticas
                            </Typography>
                            <Typography variant="body2" className="reportes-subtitulo">
                                Visualiza el rendimiento y las métricas del sistema de tutorías
                            </Typography>
                        </div>
                        <Tooltip title="Exportar a CSV">
                            <Button 
                                variant="contained" 
                                className="reportes-export-btn"
                                startIcon={<DownloadIcon />}
                                onClick={exportarCSV}
                            >
                                Exportar Reporte
                            </Button>
                        </Tooltip>
                    </div>

                    {/* ADMIN: Estadísticas generales */}
                    {userRole === 'admin' && stats && (
                        <>
                            <div className="reportes-grid reportes-grid-4">
                                <Card className="reportes-card">
                                    <CardContent>
                                        <PeopleIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.usuariosPorRol?.reduce((acc: number, r: any) => acc + parseInt(r.total), 0) || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Total Usuarios</Typography>
                                    </CardContent>
                                </Card>
                                <Card className="reportes-card">
                                    <CardContent>
                                        <EventIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.totalInscripciones || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Inscripciones</Typography>
                                    </CardContent>
                                </Card>
                                <Card className="reportes-card">
                                    <CardContent>
                                        <TrendingUpIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.usuariosActivos?.activos || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Usuarios Activos</Typography>
                                    </CardContent>
                                </Card>
                                <Card className="reportes-card">
                                    <CardContent>
                                        <SchoolIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.citasPorEstado?.reduce((acc: number, e: any) => acc + parseInt(e.total), 0) || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Total Citas</Typography>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="reportes-grid reportes-grid-2">
                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Usuarios por Rol
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={stats.usuariosPorRol}
                                                dataKey="total"
                                                nameKey="nombre_rol"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {stats.usuariosPorRol?.map((_entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>

                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Citas por Mes
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={stats.citasPorMes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Line type="monotone" dataKey="total" stroke="#D6A600" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </div>

                            <div className="reportes-grid reportes-grid-2">
                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Top 5 Temas más Solicitados
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.topMaterias} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="materia" width={120} />
                                            <RechartsTooltip />
                                            <Bar dataKey="total" fill="#17a2b8" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>

                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Top 5 Tutores con más Citas
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.topTutores} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="tutor_nombre" width={140} />
                                            <RechartsTooltip />
                                            <Bar dataKey="total" fill="#28a745" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </div>
                        </>
                    )}

                    {/* TUTOR: Estadísticas de sus citas */}
                    {userRole === 'tutor' && stats && (
                        <>
                            <div className="reportes-grid reportes-grid-3">
                                <Card className="reportes-card">
                                    <CardContent>
                                        <EventIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.totalCitas || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Total Citas Creadas</Typography>
                                    </CardContent>
                                </Card>
                                <Card className="reportes-card">
                                    <CardContent>
                                        <PeopleIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.totalAlumnos || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Alumnos Atendidos</Typography>
                                    </CardContent>
                                </Card>
                                <Card className="reportes-card">
                                    <CardContent>
                                        <TrendingUpIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.citasPorEstado?.find((e: any) => e.estado === 'disponible')?.total || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Citas Activas</Typography>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="reportes-grid reportes-grid-2">
                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Top Temas que Impartes
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.topMaterias} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="materia" width={120} />
                                            <RechartsTooltip />
                                            <Bar dataKey="total" fill="#D6A600" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>

                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Citas por Mes
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={stats.citasPorMes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Line type="monotone" dataKey="total" stroke="#003DA5" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </div>

                            <div className="reportes-grid reportes-grid-1">
                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Detalle de Inscripciones por Cita
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#003DA5' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tema</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Inscritos</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Capacidad</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ocupación</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stats.inscripcionesPorCita?.map((cita: any, idx: number) => (
                                                    <TableRow key={idx} hover>
                                                        <TableCell>{cita.materia}</TableCell>
                                                        <TableCell>{new Date(cita.fecha).toLocaleDateString('es-MX')}</TableCell>
                                                        <TableCell>{cita.inscritos}</TableCell>
                                                        <TableCell>{cita.capacidad}</TableCell>
                                                        <TableCell>
                                                            <div className="reportes-ocupacion">
                                                                <div 
                                                                    className="reportes-ocupacion-bar"
                                                                    style={{ width: `${Math.round((cita.inscritos / cita.capacidad) * 100)}%` }}
                                                                />
                                                                <span className="reportes-ocupacion-text">
                                                                    {Math.round((cita.inscritos / cita.capacidad) * 100)}%
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {(!stats.inscripcionesPorCita || stats.inscripcionesPorCita.length === 0) && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">No hay datos disponibles</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </div>
                        </>
                    )}

                    {/* TUTORADO: Estadísticas de sus inscripciones */}
                    {userRole === 'tutorado' && stats && (
                        <>
                            <div className="reportes-grid reportes-grid-2">
                                <Card className="reportes-card">
                                    <CardContent>
                                        <SchoolIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.totalInscripciones || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Tutorías Tomadas</Typography>
                                    </CardContent>
                                </Card>
                                <Card className="reportes-card">
                                    <CardContent>
                                        <TrendingUpIcon className="reportes-card-icon" />
                                        <Typography variant="h4" className="reportes-card-number">
                                            {stats.citasPorEstado?.find((e: any) => e.estado === 'disponible')?.total || 0}
                                        </Typography>
                                        <Typography variant="body2" className="reportes-card-label">Tutorías Pendientes</Typography>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="reportes-grid reportes-grid-2">
                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Temas que más has Tomado
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.topMaterias} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="materia" width={120} />
                                            <RechartsTooltip />
                                            <Bar dataKey="total" fill="#D6A600" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>

                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Tutores que más te han Apoyado
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.topTutores} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="tutor_nombre" width={140} />
                                            <RechartsTooltip />
                                            <Bar dataKey="total" fill="#17a2b8" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </div>

                            <div className="reportes-grid reportes-grid-2">
                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Próximas Citas
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#003DA5' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tema</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tutor</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hora</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lugar</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stats.proximasCitas?.map((cita: any, idx: number) => (
                                                    <TableRow key={idx} hover>
                                                        <TableCell>{cita.materia}</TableCell>
                                                        <TableCell>{cita.tutor_nombre}</TableCell>
                                                        <TableCell>{new Date(cita.fecha).toLocaleDateString('es-MX')}</TableCell>
                                                        <TableCell>{cita.hora}</TableCell>
                                                        <TableCell>{cita.lugar || 'Por asignar'}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {(!stats.proximasCitas || stats.proximasCitas.length === 0) && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">No hay próximas citas</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>

                                <Paper className="reportes-grafica">
                                    <Typography variant="h6" className="reportes-grafica-titulo">
                                        Historial de Citas
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#003DA5' }}>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tema</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tutor</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hora</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lugar</TableCell>
                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stats.historialCitas?.map((cita: any, idx: number) => (
                                                    <TableRow key={idx} hover>
                                                        <TableCell>{cita.materia}</TableCell>
                                                        <TableCell>{cita.tutor_nombre}</TableCell>
                                                        <TableCell>{new Date(cita.fecha).toLocaleDateString('es-MX')}</TableCell>
                                                        <TableCell>{cita.hora}</TableCell>
                                                        <TableCell>{cita.lugar || 'Por asignar'}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={cita.estado === 'disponible' ? 'Activa' : 'Completada'}
                                                                size="small"
                                                                sx={{ bgcolor: cita.estado === 'disponible' ? '#28a745' : '#6c757d', color: 'white' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {(!stats.historialCitas || stats.historialCitas.length === 0) && (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center">No hay historial de citas</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Reportes;