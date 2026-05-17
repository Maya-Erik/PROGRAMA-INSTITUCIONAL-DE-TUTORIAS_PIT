import React, { useState, useEffect } from 'react';
import {
    Paper, Table, TableHead, TableRow, TableCell, TableBody,
    TableContainer, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Alert, Snackbar, Accordion,
    AccordionSummary, AccordionDetails, Select, MenuItem,
    FormControl, InputLabel, Box, Typography, Chip, Divider,
    Switch, FormControlLabel, Checkbox, ListItemText
} from '@mui/material';
import {
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon,
    Download as DownloadIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    obtenerTodasNotasBitacora,
    agregarNotaCompleta,
    obtenerMisCitasBitacora,
    obtenerInscritosPorCita,
    exportarBitacora
} from '../../services/api';
import MainContent from '../../components/Layout/MainContent';
import './Bitacora.css';

interface Cita {
    id_cita: number;
    materia: string;
    tutor_nombre: string;
    fecha: string;
    hora: string;
    lugar: string;
    inscritos: number;
}

interface Inscrito {
    id_user: number;
    n_cuenta: string;
    nombre_completo: string;
    carrera: string;
}

interface NotaPersonal {
    id_alumno: number;
    nota: string;
}

interface NotaGeneral {
    id_bitacora: number;
    id_cita: number;
    materia: string;
    tutor_nombre: string;
    cita_fecha: string;
    hora: string;
    nota: string;
    fecha: string;
    usuario_nombre: string;
    tipo_tutoria: string;
    canalizado: boolean;
    notas_personales: {
        id_personal: number;
        id_alumno: number;
        n_cuenta: string;
        nombre_completo: string;
        nota: string;
    }[];
}

const Bitacora: React.FC = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [notas, setNotas] = useState<NotaGeneral[]>([]);
    const [inscritos, setInscritos] = useState<Inscrito[]>([]);
    const [loading, setLoading] = useState(true);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState<number>(0);
    const [citaInfo, setCitaInfo] = useState<Cita | null>(null);
    const [notaGeneral, setNotaGeneral] = useState('');
    const [notasPersonales, setNotasPersonales] = useState<NotaPersonal[]>([]);
    const [tipoTutoria, setTipoTutoria] = useState('Informativa');
    const [canalizado, setCanalizado] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [userRole, setUserRole] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [citasSeleccionadasExport, setCitasSeleccionadasExport] = useState<number[]>([]);
    const [exportarTodas, setExportarTodas] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserRole(user.role || '');
            setUserName(user.nombre || user.nombre_completo || user.email?.split('@')[0] || 'Usuario');
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        await Promise.all([
            cargarCitas(),
            cargarNotas()
        ]);
        setLoading(false);
    };

    const cargarCitas = async () => {
        try {
            const data = await obtenerMisCitasBitacora();
            if (data.success && data.citas) {
                setCitas(data.citas);
            } else if (data.citas) {
                setCitas(data.citas);
            } else {
                setCitas([]);
            }
        } catch (error) {
            console.error('Error al cargar citas:', error);
            setCitas([]);
        }
    };

    const cargarNotas = async () => {
        try {
            const data = await obtenerTodasNotasBitacora();
            if (data.success && data.notas) {
                setNotas(data.notas);
            } else if (data.notas) {
                setNotas(data.notas);
            } else {
                setNotas([]);
            }
        } catch (error) {
            console.error('Error al cargar notas:', error);
            setNotas([]);
        }
    };

    const handleCitaChange = async (id_cita: number) => {
        setCitaSeleccionada(id_cita);
        const cita = citas.find(c => c.id_cita === id_cita);
        setCitaInfo(cita || null);
        
        if (id_cita) {
            try {
                const data = await obtenerInscritosPorCita(id_cita);
                if (data.success && data.inscritos) {
                    setInscritos(data.inscritos);
                    setNotasPersonales(data.inscritos.map((i: Inscrito) => ({ id_alumno: i.id_user, nota: '' })));
                } else {
                    setInscritos([]);
                    setNotasPersonales([]);
                }
            } catch (error) {
                console.error('Error al cargar inscritos:', error);
                setInscritos([]);
                setNotasPersonales([]);
            }
        } else {
            setInscritos([]);
            setNotasPersonales([]);
        }
    };

    const handleOpenAddModal = () => {
        setCitaSeleccionada(0);
        setCitaInfo(null);
        setNotaGeneral('');
        setTipoTutoria('Informativa');
        setCanalizado(false);
        setInscritos([]);
        setNotasPersonales([]);
        setOpenAddModal(true);
    };

    const handleNotaPersonalChange = (id_alumno: number, nota: string) => {
        setNotasPersonales(prev =>
            prev.map(np => np.id_alumno === id_alumno ? { ...np, nota } : np)
        );
    };

    const handleAddSubmit = async () => {
        if (!citaSeleccionada) {
            setSnackbar({ open: true, message: 'Debe seleccionar una cita', severity: 'error' });
            return;
        }
        if (!notaGeneral.trim()) {
            setSnackbar({ open: true, message: 'La nota general es obligatoria', severity: 'error' });
            return;
        }

        try {
            const result = await agregarNotaCompleta({
                id_cita: citaSeleccionada,
                nota_general: notaGeneral,
                notas_personales: notasPersonales.filter(np => np.nota.trim() !== ''),
                tipo_tutoria: tipoTutoria,
                canalizado: canalizado
            });

            if (result.success) {
                setSnackbar({ open: true, message: 'Notas guardadas correctamente', severity: 'success' });
                setOpenAddModal(false);
                cargarNotas();
            } else {
                setSnackbar({ open: true, message: result.error || 'Error al guardar notas', severity: 'error' });
            }
        } catch (error) {
            console.error('Error al guardar notas:', error);
            setSnackbar({ open: true, message: 'Error al guardar notas', severity: 'error' });
        }
    };

    const handleExportar = async () => {
        const filtros: any = {};
        
        if (!exportarTodas) {
            if (fechaInicio && fechaFin) {
                filtros.fecha_inicio = fechaInicio;
                filtros.fecha_fin = fechaFin;
            }
            if (citasSeleccionadasExport.length > 0) {
                filtros.citas_ids = citasSeleccionadasExport;
            }
        }
        
        try {
            await exportarBitacora(filtros);
            setOpenExportModal(false);
            setSnackbar({ open: true, message: 'Exportación completada', severity: 'success' });
        } catch (error) {
            console.error('Error al exportar:', error);
            setSnackbar({ open: true, message: 'Error al exportar', severity: 'error' });
        }
    };

    const formatFecha = (fecha: string) => {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatFechaHora = (fecha: string) => {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const puedeAgregarNotas = () => {
        return userRole === 'admin' || userRole === 'tutor' || userRole === 'tutorado';
    };

    return (
        <div className="bitacora-container">
            <Sidebar userRole={userRole} />
            
            <MainContent className="bitacora-main">
                <header className="bitacora-topbar">
                    <span className="bitacora-breadcrumb">Configuración › Bitácora</span>
                    <div className="bitacora-topbar-right">
                        <div className="bitacora-topbar-user">
                            <div>
                                <p className="bitacora-topbar-name">{userName}</p>
                                <p className="bitacora-topbar-role">
                                    {userRole === 'admin' ? 'ADMIN' : 
                                     userRole === 'tutor' ? 'TUTOR' :
                                     userRole === 'tutorado' ? 'TUTORADO' : 'ALUMNO'}
                                </p>
                            </div>
                            <div className="bitacora-topbar-avatar">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="bitacora-content">
                    <div className="bitacora-header">
                        <div className="bitacora-title-section">
                            <h1>Bitácora de Tutorías</h1>
                            <p>Registro de notas generales y personales sobre las tutorías impartidas</p>
                        </div>
                        <div className="bitacora-header-buttons">
                            {puedeAgregarNotas() && (
                                <button className="bitacora-add-btn" onClick={handleOpenAddModal}>
                                    <AddIcon /> Agregar Nota
                                </button>
                            )}
                            <button className="bitacora-export-btn" onClick={() => setOpenExportModal(true)}>
                                <DownloadIcon /> Exportar CSV
                            </button>
                        </div>
                    </div>

                    <Paper className="bitacora-table-container">
                        <TableContainer>
                            <Table className="bitacora-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>FECHA</TableCell>
                                        <TableCell>TEMA</TableCell>
                                        <TableCell>TUTOR</TableCell>
                                        <TableCell>FECHA CITA</TableCell>
                                        <TableCell>TIPO TUTORÍA</TableCell>
                                        <TableCell>CANALIZADO</TableCell>
                                        <TableCell>NOTA GENERAL</TableCell>
                                        <TableCell>NOTAS PERSONALES</TableCell>
                                        <TableCell>REGISTRADO POR</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                Cargando notas...
                                            </TableCell>
                                        </TableRow>
                                    ) : notas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                No hay notas registradas
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        notas.map((nota) => (
                                            <TableRow key={nota.id_bitacora}>
                                                <TableCell>{formatFechaHora(nota.fecha)}</TableCell>
                                                <TableCell>{nota.materia}</TableCell>
                                                <TableCell>{nota.tutor_nombre}</TableCell>
                                                <TableCell>{formatFecha(nota.cita_fecha)} {nota.hora}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={nota.tipo_tutoria || 'No especificado'} 
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: nota.tipo_tutoria === 'Informativa' ? '#2196f3' : 
                                                                    nota.tipo_tutoria === 'Orientación' ? '#ff9800' : '#4caf50',
                                                            color: 'white'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={nota.canalizado ? 'Sí' : 'No'} 
                                                        size="small"
                                                        sx={{ bgcolor: nota.canalizado ? '#f44336' : '#9e9e9e', color: 'white' }}
                                                    />
                                                </TableCell>
                                                <TableCell className="bitacora-nota-cell">
                                                    <Accordion className="bitacora-accordion">
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                            <span className="bitacora-nota-preview">
                                                                {nota.nota.length > 80 ? `${nota.nota.substring(0, 80)}...` : nota.nota}
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <span className="bitacora-nota-completa">
                                                                {nota.nota}
                                                            </span>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </TableCell>
                                                <TableCell>
                                                    {nota.notas_personales.length > 0 ? (
                                                        <Accordion className="bitacora-accordion">
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                                <span className="bitacora-nota-preview">
                                                                    {nota.notas_personales.length} notas personales
                                                                </span>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {nota.notas_personales.map((np, idx) => (
                                                                    <Box key={idx} className="bitacora-personal-item">
                                                                        <Typography variant="subtitle2">
                                                                            {np.n_cuenta} - {np.nombre_completo}
                                                                        </Typography>
                                                                        <Typography variant="body2" className="bitacora-personal-nota">
                                                                            {np.nota}
                                                                        </Typography>
                                                                        {idx < nota.notas_personales.length - 1 && <Divider sx={{ my: 1 }} />}
                                                                    </Box>
                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ) : (
                                                        <span className="bitacora-sin-notas">Sin notas personales</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{nota.usuario_nombre}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </MainContent>

            {/* Modal Agregar Nota */}
            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="md" fullWidth>
                <DialogTitle className="bitacora-modal-titulo">
                    Agregar Nota de Bitácora
                    <IconButton onClick={() => setOpenAddModal(false)} className="bitacora-modal-close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Seleccionar Cita</InputLabel>
                        <Select
                            value={citaSeleccionada}
                            onChange={(e) => handleCitaChange(Number(e.target.value))}
                        >
                            <MenuItem value={0}>Seleccione una cita</MenuItem>
                            {citas.map((cita) => (
                                <MenuItem key={cita.id_cita} value={cita.id_cita}>
                                    {cita.materia} - {cita.tutor_nombre} - {formatFecha(cita.fecha)} {cita.hora}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {citaInfo && (
                        <Box className="bitacora-cita-info">
                            <Typography variant="subtitle1" className="bitacora-cita-titulo">
                                Información de la Cita
                            </Typography>
                            <Box className="bitacora-cita-detalles">
                                <Chip icon={<ScheduleIcon />} label={`Fecha: ${formatFecha(citaInfo.fecha)} ${citaInfo.hora}`} size="small" />
                                <Chip icon={<LocationIcon />} label={`Lugar: ${citaInfo.lugar || 'Por asignar'}`} size="small" />
                                <Chip icon={<PersonIcon />} label={`Inscritos: ${citaInfo.inscritos}`} size="small" />
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" className="bitacora-section-titulo">
                        Nota General *
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={notaGeneral}
                        onChange={(e) => setNotaGeneral(e.target.value)}
                        margin="normal"
                        placeholder="Escribe aquí la nota general sobre la tutoría..."
                        required
                    />

                    <Divider sx={{ my: 2 }} />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de Tutoría</InputLabel>
                        <Select
                            value={tipoTutoria}
                            onChange={(e) => setTipoTutoria(e.target.value)}
                        >
                            <MenuItem value="Informativa">Informativa</MenuItem>
                            <MenuItem value="Orientación">De orientación</MenuItem>
                            <MenuItem value="Formación">De formación</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={canalizado}
                                onChange={(e) => setCanalizado(e.target.checked)}
                            />
                        }
                        label="El alumno fue canalizado"
                        sx={{ mt: 2 }}
                    />

                    {inscritos.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" className="bitacora-section-titulo">
                                Notas Personales (Opcional)
                            </Typography>
                            <Typography variant="body2" className="bitacora-section-subtitulo">
                                Agrega notas específicas por alumno
                            </Typography>
                            
                            {inscritos.map((alumno) => (
                                <Box key={alumno.id_user} className="bitacora-personal-input">
                                    <Typography variant="subtitle2" className="bitacora-alumno-nombre">
                                        {alumno.n_cuenta} - {alumno.nombre_completo}
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={notasPersonales.find(np => np.id_alumno === alumno.id_user)?.nota || ''}
                                        onChange={(e) => handleNotaPersonalChange(alumno.id_user, e.target.value)}
                                        placeholder="Nota personal para este alumno (opcional)"
                                        size="small"
                                    />
                                </Box>
                            ))}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddModal(false)}>Cancelar</Button>
                    <Button onClick={handleAddSubmit} variant="contained" className="bitacora-btn-guardar">
                        Guardar Notas
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Exportar CSV */}
            <Dialog open={openExportModal} onClose={() => setOpenExportModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="bitacora-modal-titulo">
                    Exportar Bitácora a CSV
                    <IconButton onClick={() => setOpenExportModal(false)} className="bitacora-modal-close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={exportarTodas}
                                onChange={(e) => setExportarTodas(e.target.checked)}
                            />
                        }
                        label="Exportar todas las notas"
                        sx={{ mb: 2 }}
                    />

                    {!exportarTodas && (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Fecha Inicio"
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Fecha Fin"
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel>Seleccionar Citas</InputLabel>
                                <Select
                                    multiple
                                    value={citasSeleccionadasExport}
                                    onChange={(e) => setCitasSeleccionadasExport(e.target.value as number[])}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const cita = citas.find(c => c.id_cita === value);
                                                return <Chip key={value} label={cita?.materia} size="small" />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {citas.map((cita) => (
                                        <MenuItem key={cita.id_cita} value={cita.id_cita}>
                                            <Checkbox checked={citasSeleccionadasExport.indexOf(cita.id_cita) !== -1} />
                                            <ListItemText primary={`${cita.materia} - ${formatFecha(cita.fecha)}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExportModal(false)}>Cancelar</Button>
                    <Button onClick={handleExportar} variant="contained" className="bitacora-btn-guardar">
                        Exportar
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
        </div>
    );
};

export default Bitacora;