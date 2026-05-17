import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, FormControl, InputLabel, Select,
    IconButton, Table, TableHead, TableRow, TableCell, TableBody,
    Alert, Snackbar, Chip, Paper, TableContainer
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    adminObtenerCitas,
    adminCrearCita,
    adminActualizarCita,
    adminEliminarCita,
    adminAsignarLugar
} from '../../services/api';
import SidebarToggle from '../../components/Sidebar/SidebarToggle';
import './AdminCitas.css';

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
}

const AdminCitas: React.FC = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openLugarModal, setOpenLugarModal] = useState(false);
    const [editandoCita, setEditandoCita] = useState<Cita | null>(null);
    const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' as 'success' | 'error' 
    });

    const [formData, setFormData] = useState({
        materia: '',
        tutor_nombre: '',
        fecha: '',
        hora: '',
        capacidad: 20,
        tipo: 'grupal',
        carrera: ''
    });

    const [lugarData, setLugarData] = useState({ lugar: '' });

    const carreras = [
        "Actuaría", "Arquitectura", "Ciencia de Datos",
        "Ciencias Políticas y Administración Pública", "Comunicación",
        "Derecho", "Diseño Gráfico", "Economía", "Enseñanza de Inglés",
        "Filosofía", "Historia", "Ingeniería Civil",
        "Lengua y Literatura Hispánicas", "Matemáticas Aplicadas y Computación",
        "Pedagogía", "Relaciones Internacionales", "Sociología"
    ];

    const cargarCitas = async () => {
        setLoading(true);
        const data = await adminObtenerCitas();
        if (data.success) {
            setCitas(data.citas);
        }
        setLoading(false);
    };

    useEffect(() => {
        cargarCitas();
    }, []);

    const handleOpenModal = (cita: Cita | null = null) => {
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
                carrera: ''
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditandoCita(null);
        setFormData({
            materia: '',
            tutor_nombre: '',
            fecha: '',
            hora: '',
            capacidad: 20,
            tipo: 'grupal',
            carrera: ''
        });
    };

    const handleOpenLugarModal = (cita: Cita) => {
        setCitaSeleccionada(cita);
        setLugarData({ lugar: cita.lugar === 'Por asignar' ? '' : cita.lugar });
        setOpenLugarModal(true);
    };

    const handleCloseLugarModal = () => {
        setOpenLugarModal(false);
        setCitaSeleccionada(null);
        setLugarData({ lugar: '' });
    };

    const handleSubmit = async () => {
        if (!formData.materia || !formData.tutor_nombre || !formData.fecha || !formData.hora) {
            setSnackbar({ 
                open: true, 
                message: 'Todos los campos son obligatorios', 
                severity: 'error' 
            });
            return;
        }

        setSaving(true);

        let result;
        if (editandoCita) {
            result = await adminActualizarCita(editandoCita.id_cita, formData);
        } else {
            result = await adminCrearCita(formData);
        }

        if (result.success) {
            setSnackbar({ 
                open: true, 
                message: `Cita ${editandoCita ? 'actualizada' : 'creada'} correctamente`, 
                severity: 'success' 
            });
            handleCloseModal();
            cargarCitas();
        } else {
            setSnackbar({ 
                open: true, 
                message: result.error || 'Error al guardar cita', 
                severity: 'error' 
            });
        }
        
        setSaving(false);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
            const result = await adminEliminarCita(id);
            if (result.success) {
                setSnackbar({ 
                    open: true, 
                    message: 'Cita eliminada correctamente', 
                    severity: 'success' 
                });
                cargarCitas();
            } else {
                setSnackbar({ 
                    open: true, 
                    message: result.error || 'Error al eliminar cita', 
                    severity: 'error' 
                });
            }
        }
    };

    const handleAsignarLugar = async () => {
        if (!citaSeleccionada) return;
        
        const result = await adminAsignarLugar(citaSeleccionada.id_cita, lugarData.lugar);
        if (result.success) {
            setSnackbar({ 
                open: true, 
                message: 'Salón asignado correctamente', 
                severity: 'success' 
            });
            handleCloseLugarModal();
            cargarCitas();
        } else {
            setSnackbar({ 
                open: true, 
                message: result.error || 'Error al asignar salón', 
                severity: 'error' 
            });
        }
    };

    if (loading) {
        return (
            <Box className="admin-citas-container">
                <Sidebar userRole="admin" />
                <Box className="admin-citas-main">
                    <Container className="admin-citas-content">
                        <Typography className="admin-citas-loading">Cargando citas...</Typography>
                    </Container>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="admin-citas-container">
            <Sidebar userRole="admin" />
            <SidebarToggle />

            <main className="admin-citas-main">
                <div className='admin-citas-container-original'>
                    <Container className="admin-citas-content">
                        <Box className="admin-citas-header">
                            <Typography variant="h4" className="admin-citas-titulo">
                                Gestión de Citas
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />} 
                                onClick={() => handleOpenModal()} 
                                className="admin-citas-btn-nueva"
                            >
                                Nueva Cita
                            </Button>
                        </Box>

                        <Paper className="admin-citas-tabla-container">
                            <TableContainer>
                                <Table className="admin-citas-tabla">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Materia</TableCell>
                                            <TableCell>Tutor</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Hora</TableCell>
                                            <TableCell>Carrera</TableCell>
                                            <TableCell>Salón</TableCell>
                                            <TableCell>Cupos</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {citas.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="admin-citas-loading">
                                                    No hay citas registradas
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            citas.map((cita) => (
                                                <TableRow key={cita.id_cita}>
                                                    <TableCell>{cita.id_cita}</TableCell>
                                                    <TableCell className="admin-citas-materia">
                                                        {cita.materia}
                                                    </TableCell>
                                                    <TableCell>{cita.tutor_nombre}</TableCell>
                                                    <TableCell>{cita.fecha}</TableCell>
                                                    <TableCell>{cita.hora}</TableCell>
                                                    <TableCell>{cita.carrera}</TableCell>
                                                    <TableCell>
                                                        {cita.lugar === 'Por asignar' ? (
                                                            <Chip 
                                                                label="Por asignar" 
                                                                className="admin-citas-chip-pendiente" 
                                                                size="small" 
                                                            />
                                                        ) : (
                                                            <span className="admin-citas-lugar-asignado">
                                                                {cita.lugar}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="admin-citas-cupos">
                                                            {cita.inscritos}/{cita.capacidad}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="admin-citas-acciones">
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleOpenModal(cita)}
                                                            className="admin-citas-icono-editar"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleEliminar(cita.id_cita)}
                                                            className="admin-citas-icono-eliminar"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <Button 
                                                            size="small" 
                                                            onClick={() => handleOpenLugarModal(cita)}
                                                            className="admin-citas-btn-lugar"
                                                        >
                                                            Asignar Salón
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Container>
                </div>
            </main>

            {/* Modal Crear/Editar Cita */}
            <Dialog 
                open={openModal} 
                onClose={handleCloseModal} 
                maxWidth="sm" 
                fullWidth
                className="admin-citas-modal"
            >
                <DialogTitle className="admin-citas-modal-titulo">
                    {editandoCita ? 'Editar Cita' : 'Nueva Cita'}
                    <IconButton 
                        onClick={handleCloseModal} 
                        className="admin-citas-modal-close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Materia"
                        name="materia"
                        value={formData.materia}
                        onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                        margin="normal"
                        required
                        className="admin-citas-input"
                    />
                    <TextField
                        fullWidth
                        label="Tutor/Profesor"
                        name="tutor_nombre"
                        value={formData.tutor_nombre}
                        onChange={(e) => setFormData({ ...formData, tutor_nombre: e.target.value })}
                        margin="normal"
                        required
                        className="admin-citas-input"
                    />
                    <div className="admin-citas-row">
                        <TextField
                            type="date"
                            label="Fecha"
                            name="fecha"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                            className="admin-citas-fecha"
                        />
                        <TextField
                            type="time"
                            label="Hora"
                            name="hora"
                            value={formData.hora}
                            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                            className="admin-citas-hora"
                        />
                    </div>
                    <div className="admin-citas-row">
                        <TextField
                            type="number"
                            label="Capacidad"
                            name="capacidad"
                            value={formData.capacidad}
                            onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
                            margin="normal"
                            inputProps={{ min: 1, max: 20 }}
                            className="admin-citas-capacidad"
                        />
                        <FormControl fullWidth margin="normal" className="admin-citas-tipo">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            >
                                <MenuItem value="grupal">Grupal</MenuItem>
                                <MenuItem value="individual">Individual</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <FormControl fullWidth margin="normal" className="admin-citas-carrera">
                        <InputLabel>Carrera</InputLabel>
                        <Select
                            name="carrera"
                            value={formData.carrera}
                            onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                        >
                            {carreras.map((c) => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions className="admin-citas-modal-acciones">
                    <Button onClick={handleCloseModal} className="admin-citas-btn-cancelar">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        className="admin-citas-btn-guardar"
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Asignar Salón */}
            <Dialog 
                open={openLugarModal} 
                onClose={handleCloseLugarModal} 
                maxWidth="sm" 
                fullWidth
                className="admin-citas-modal"
            >
                <DialogTitle className="admin-citas-modal-titulo">
                    Asignar Salón
                    <IconButton 
                        onClick={handleCloseLugarModal} 
                        className="admin-citas-modal-close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Salón"
                        value={lugarData.lugar}
                        onChange={(e) => setLugarData({ lugar: e.target.value })}
                        margin="normal"
                        placeholder="Ej: Salón 301, Laboratorio de cómputo, Aula virtual"
                        className="admin-citas-input"
                    />
                </DialogContent>
                <DialogActions className="admin-citas-modal-acciones">
                    <Button onClick={handleCloseLugarModal} className="admin-citas-btn-cancelar">
                        Cancelar
                    </Button>
                    <Button onClick={handleAsignarLugar} variant="contained" className="admin-citas-btn-guardar">
                        Asignar
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
        </Box>
    );
};

export default AdminCitas;