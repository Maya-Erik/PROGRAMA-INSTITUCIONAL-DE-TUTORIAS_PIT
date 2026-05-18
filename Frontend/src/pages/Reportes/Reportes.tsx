import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Card, CardContent,
    CircularProgress, Chip, Table, TableHead, TableRow, TableCell,
    TableBody, TableContainer
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import Sidebar from '../../components/Sidebar/Sidebar';
import { obtenerEstadisticas } from '../../services/api';
import './Reportes.css';

const COLORS = ['#003DA5', '#D6A600', '#28a745', '#dc3545', '#17a2b8', '#6f42c1'];

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
            const data = await obtenerEstadisticas();
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

    if (loading) {
        return (
            <div className="reportes-layout">
                <Sidebar userRole={userRole} />
                <div className="reportes-main">
                    <div className="reportes-loading">
                        <CircularProgress sx={{ color: '#003DA5' }} />
                        <Typography>Cargando estadísticas...</Typography>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reportes-layout">
            <Sidebar userRole={userRole} />
            
            <div className="reportes-main">
                <div className="reportes-header">
                    <Typography variant="h4" className="reportes-titulo">
                        Reportes y Estadísticas
                    </Typography>
                    <div className="reportes-user">
                        <Typography variant="body2">{userName}</Typography>
                        <Chip 
                            label={userRole === 'admin' ? 'Administrador' : userRole === 'tutor' ? 'Tutor' : 'Tutorado'}
                            size="small"
                            sx={{ bgcolor: '#003DA5', color: 'white' }}
                        />
                    </div>
                </div>

                {/* ADMIN: Estadísticas generales */}
                {userRole === 'admin' && stats && (
                    <>
                        {/* Tarjetas de resumen */}
                        <div className="reportes-grid reportes-grid-4">
                            <Card className="reportes-card">
                                <CardContent>
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.usuariosPorRol?.reduce((acc: number, r: any) => acc + parseInt(r.total), 0) || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Total Usuarios</Typography>
                                </CardContent>
                            </Card>
                            <Card className="reportes-card">
                                <CardContent>
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.totalInscripciones || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Inscripciones</Typography>
                                </CardContent>
                            </Card>
                            <Card className="reportes-card">
                                <CardContent>
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.usuariosActivos?.activos || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Usuarios Activos</Typography>
                                </CardContent>
                            </Card>
                            <Card className="reportes-card">
                                <CardContent>
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.citasPorEstado?.reduce((acc: number, e: any) => acc + parseInt(e.total), 0) || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Total Citas</Typography>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Gráficas */}
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
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>

                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Citas por Estado
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.citasPorEstado}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="estado" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#003DA5" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </div>

                        <div className="reportes-grid reportes-grid-1">
                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Citas por Mes (últimos 6 meses)
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.citasPorMes}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="total" stroke="#D6A600" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </div>

                        <div className="reportes-grid reportes-grid-2">
                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Top 5 Materias
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.topMaterias} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="materia" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#17a2b8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>

                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Top 5 Tutores
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.topTutores} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="tutor_nombre" width={120} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#28a745" />
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
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.totalCitas || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Total Citas Creadas</Typography>
                                </CardContent>
                            </Card>
                            <Card className="reportes-card">
                                <CardContent>
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.totalAlumnos || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Alumnos Atendidos</Typography>
                                </CardContent>
                            </Card>
                            <Card className="reportes-card">
                                <CardContent>
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
                                    Citas por Estado
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={stats.citasPorEstado}
                                            dataKey="total"
                                            nameKey="estado"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {stats.citasPorEstado?.map((_entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>

                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Top Materias
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.topMaterias}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="materia" angle={-45} textAnchor="end" height={80} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#D6A600" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </div>

                        <div className="reportes-grid reportes-grid-1">
                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Citas por Mes
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.citasPorMes}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="total" stroke="#003DA5" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </div>

                        <div className="reportes-grid reportes-grid-1">
                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Inscripciones por Cita
                                </Typography>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#003DA5' }}>
                                                <TableCell sx={{ color: 'white' }}>Materia</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Inscritos</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Capacidad</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Ocupación</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.inscripcionesPorCita?.map((cita: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{cita.materia}</TableCell>
                                                    <TableCell>{new Date(cita.fecha).toLocaleDateString('es-MX')}</TableCell>
                                                    <TableCell>{cita.inscritos}</TableCell>
                                                    <TableCell>{cita.capacidad}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={`${Math.round((cita.inscritos / cita.capacidad) * 100)}%`}
                                                            size="small"
                                                            sx={{ bgcolor: cita.inscritos >= cita.capacidad ? '#dc3545' : '#28a745', color: 'white' }}
                                                        />
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
                                    <Typography variant="h4" className="reportes-card-number">
                                        {stats.totalInscripciones || 0}
                                    </Typography>
                                    <Typography variant="body2" className="reportes-card-label">Tutorías Tomadas</Typography>
                                </CardContent>
                            </Card>
                            <Card className="reportes-card">
                                <CardContent>
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
                                    Materias que más has tomado
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.topMaterias} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="materia" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#D6A600" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>

                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Tutores que más te han apoyado
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.topTutores} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="tutor_nombre" width={120} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#17a2b8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </div>

                        <div className="reportes-grid reportes-grid-1">
                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Próximas Citas
                                </Typography>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#003DA5' }}>
                                                <TableCell sx={{ color: 'white' }}>Materia</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Tutor</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Hora</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Lugar</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.proximasCitas?.map((cita: any, idx: number) => (
                                                <TableRow key={idx}>
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
                        </div>

                        <div className="reportes-grid reportes-grid-1">
                            <Paper className="reportes-grafica">
                                <Typography variant="h6" className="reportes-grafica-titulo">
                                    Historial de Citas
                                </Typography>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#003DA5' }}>
                                                <TableCell sx={{ color: 'white' }}>Materia</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Tutor</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Hora</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Lugar</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Estado</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.historialCitas?.map((cita: any, idx: number) => (
                                                <TableRow key={idx}>
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
    );
};

export default Reportes;