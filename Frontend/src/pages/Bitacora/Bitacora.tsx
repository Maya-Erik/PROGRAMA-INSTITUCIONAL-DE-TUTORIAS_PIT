
import React, { useState, useEffect } from 'react';
import {
    Paper, Table, TableHead, TableRow, TableCell, TableBody,
    TableContainer, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Alert, Snackbar, Accordion,
    AccordionSummary, AccordionDetails, Select, MenuItem,
    FormControl, InputLabel, Box, Typography, Chip, Divider
} from '@mui/material';
import {
    Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
    ExpandMore as ExpandMoreIcon, Person as PersonIcon,
    Schedule as ScheduleIcon, LocationOn as LocationIcon
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    obtenerMisCitasBitacora,
    obtenerInscritosPorCita,
    agregarNotaCompleta,
    obtenerTodasNotasBitacora
} from '../../services/api';
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
    const [citaSeleccionada, setCitaSeleccionada] = useState<number>(0);
    const [citaInfo, setCitaInfo] = useState<Cita | null>(null);
    const [notaGeneral, setNotaGeneral] = useState('');
    const [notasPersonales, setNotasPersonales] = useState<NotaPersonal[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserRole(user.role || '');
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
        const data = await obtenerMisCitasBitacora();
        if (data.success) {
            setCitas(data.citas || []);
        }
    };

    const cargarNotas = async () => {
        const data = await obtenerTodasNotasBitacora();
        if (data.success) {
            setNotas(data.notas || []);
        }
    };

    const handleCitaChange = async (id_cita: number) => {
        setCitaSeleccionada(id_cita);
        const cita = citas.find(c => c.id_cita === id_cita);
        setCitaInfo(cita || null);
        
        if (id_cita) {
            const data = await obtenerInscritosPorCita(id_cita);
            if (data.success) {
                setInscritos(data.inscritos || []);
                setNotasPersonales(data.inscritos.map((i: Inscrito) => ({ id_alumno: i.id_user, nota: '' })));
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

        const result = await agregarNotaCompleta({
            id_cita: citaSeleccionada,
            nota_general: notaGeneral,
            notas_personales: notasPersonales.filter(np => np.nota.trim() !== '')
        });

        if (result.success) {
            setSnackbar({ open: true, message: 'Notas guardadas correctamente', severity: 'success' });
            setOpenAddModal(false);
            cargarNotas();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al guardar notas', severity: 'error' });
        }
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatFechaHora = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bitacora-container">
            <Sidebar userRole={userRole} />
            
            <main className="bitacora-main">
                <header className="bitacora-topbar">
                    <span className="bitacora-breadcrumb">Configuracion › Bitacora</span>
                    <div className="bitacora-topbar-right">
                        <span className="bitacora-topbar-bell">🔔</span>
                        <div className="bitacora-topbar-user">
                            <div>
                                <p className="bitacora-topbar-name">Administrador</p>
                                <p className="bitacora-topbar-role">ADMIN</p>
                            </div>
                            <div className="bitacora-topbar-avatar">AD</div>
                        </div>
                    </div>
                </header>

                <div className="bitacora-content">
                    <div className="bitacora-header">
                        <div className="bitacora-title-section">
                            <h1>Bitacora de Tutorias</h1>
                            <p>Registro de notas generales y personales sobre las tutorias impartidas</p>
                        </div>
                        <button className="bitacora-add-btn" onClick={handleOpenAddModal}>
                            <AddIcon /> Agregar Nota
                        </button>
                    </div>

                    <Paper className="bitacora-table-container">
                        <TableContainer>
                            <Table className="bitacora-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>FECHA</TableCell>
                                        <TableCell>MATERIA</TableCell>
                                        <TableCell>TUTOR</TableCell>
                                        <TableCell>FECHA CITA</TableCell>
                                        <TableCell>NOTA GENERAL</TableCell>
                                        <TableCell>NOTAS PERSONALES</TableCell>
                                        <TableCell>REGISTRADO POR</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                Cargando notas...
                                            </TableCell>
                                        </TableRow>
                                    ) : notas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
            </main>

            {/* Modal Agregar Nota */}
            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="md" fullWidth>
                <DialogTitle className="bitacora-modal-titulo">
                    Agregar Nota de Bitacora
                    <IconButton onClick={() => setOpenAddModal(false)} className="bitacora-modal-close">
                        ✕
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
                                Informacion de la Cita
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
                        placeholder="Escribe aqui la nota general sobre la tutoria..."
                        required
                    />

                    {inscritos.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" className="bitacora-section-titulo">
                                Notas Personales (Opcional)
                            </Typography>
                            <Typography variant="body2" className="bitacora-section-subtitulo">
                                Agrega notas especificas por alumno
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