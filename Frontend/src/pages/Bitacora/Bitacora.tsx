import React, { useState, useEffect } from 'react';
import {
    Typography, Paper, Table, TableHead, TableRow,
    TableCell, TableBody, TableContainer, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Button,
    Alert, Snackbar, Accordion, AccordionSummary, AccordionDetails

} from '@mui/material';
import { 
    Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
    ExpandMore as ExpandMoreIcon, Notes as NotesIcon
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    obtenerTodasNotas,
    agregarNota,
    editarNota,
    eliminarNota
} from '../../services/api';
import './Bitacora.css';

interface Nota {
    id_bitacora: number;
    id_cita: number;
    id_usuario: number;
    usuario_nombre: string;
    nota: string;
    fecha: string;
    materia: string;
    tutor_nombre: string;
    cita_fecha: string;
}

const Bitacora: React.FC = () => {
    const [notas, setNotas] = useState<Nota[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [notaSeleccionada, setNotaSeleccionada] = useState<Nota | null>(null);
    const [nuevaNota, setNuevaNota] = useState({ id_cita: 0, nota: '' });
    const [citasDisponibles, setCitasDisponibles] = useState<any[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserRole(user.role || '');
        }
        cargarNotas();
    }, []);

    const cargarNotas = async () => {
        setLoading(true);
        const data = await obtenerTodasNotas();
        if (data.success) {
            setNotas(data.notas || []);
        }
        setLoading(false);
    };

    const handleOpenAddModal = () => {
        setNuevaNota({ id_cita: 0, nota: '' });
        setOpenAddModal(true);
    };

    const handleAddSubmit = async () => {
        if (!nuevaNota.id_cita || !nuevaNota.nota.trim()) {
            setSnackbar({ open: true, message: 'Todos los campos son obligatorios', severity: 'error' });
            return;
        }

        const result = await agregarNota(nuevaNota.id_cita, nuevaNota.nota);
        if (result.success) {
            setSnackbar({ open: true, message: 'Nota agregada correctamente', severity: 'success' });
            setOpenAddModal(false);
            cargarNotas();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al agregar nota', severity: 'error' });
        }
    };

    const handleOpenEditModal = (nota: Nota) => {
        setNotaSeleccionada(nota);
        setOpenEditModal(true);
    };

    const handleEditSubmit = async () => {
        if (!notaSeleccionada || !notaSeleccionada.nota.trim()) return;

        const result = await editarNota(notaSeleccionada.id_bitacora, notaSeleccionada.nota);
        if (result.success) {
            setSnackbar({ open: true, message: 'Nota actualizada correctamente', severity: 'success' });
            setOpenEditModal(false);
            cargarNotas();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al actualizar nota', severity: 'error' });
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estas seguro de eliminar esta nota?')) {
            const result = await eliminarNota(id);
            if (result.success) {
                setSnackbar({ open: true, message: 'Nota eliminada correctamente', severity: 'success' });
                cargarNotas();
            } else {
                setSnackbar({ open: true, message: result.error || 'Error al eliminar nota', severity: 'error' });
            }
        }
    };

    const formatFecha = (fecha: string) => {
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
                            <p>Registro de notas y seguimiento de las tutorias impartidas</p>
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
                                        <TableCell>CITA FECHA</TableCell>
                                        <TableCell>NOTA</TableCell>
                                        <TableCell>REGISTRADO POR</TableCell>
                                        <TableCell>ACCIONES</TableCell>
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
                                                <TableCell className="bitacora-fecha">
                                                    {formatFecha(nota.fecha)}
                                                </TableCell>
                                                <TableCell>{nota.materia || 'N/A'}</TableCell>
                                                <TableCell>{nota.tutor_nombre || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {nota.cita_fecha ? new Date(nota.cita_fecha).toLocaleDateString('es-MX') : 'N/A'}
                                                </TableCell>
                                                <TableCell className="bitacora-nota-cell">
                                                    <Accordion className="bitacora-accordion">
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                            <Typography className="bitacora-nota-preview">
                                                                {nota.nota.length > 100 ? `${nota.nota.substring(0, 100)}...` : nota.nota}
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography className="bitacora-nota-completa">
                                                                {nota.nota}
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </TableCell>
                                                <TableCell>{nota.usuario_nombre || 'N/A'}</TableCell>
                                                <TableCell className="bitacora-acciones">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleOpenEditModal(nota)}
                                                        title="Editar nota"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleEliminar(nota.id_bitacora)}
                                                        title="Eliminar nota"
                                                        sx={{ color: '#dc3545' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
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
                    Agregar Nota
                    <IconButton onClick={() => setOpenAddModal(false)} className="bitacora-modal-close">
                        ✕
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="ID de la Cita"
                        type="number"
                        value={nuevaNota.id_cita}
                        onChange={(e) => setNuevaNota({ ...nuevaNota, id_cita: parseInt(e.target.value) || 0 })}
                        margin="normal"
                        helperText="Ingresa el ID de la cita a la que pertenece esta nota"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Nota"
                        value={nuevaNota.nota}
                        onChange={(e) => setNuevaNota({ ...nuevaNota, nota: e.target.value })}
                        margin="normal"
                        multiline
                        rows={6}
                        placeholder="Escribe aqui la nota sobre la tutoria..."
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddModal(false)}>Cancelar</Button>
                    <Button onClick={handleAddSubmit} variant="contained" className="bitacora-btn-guardar">
                        Guardar Nota
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Editar Nota */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="md" fullWidth>
                <DialogTitle className="bitacora-modal-titulo">
                    Editar Nota
                    <IconButton onClick={() => setOpenEditModal(false)} className="bitacora-modal-close">
                        ✕
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Nota"
                        value={notaSeleccionada?.nota || ''}
                        onChange={(e) => setNotaSeleccionada({ ...notaSeleccionada!, nota: e.target.value })}
                        margin="normal"
                        multiline
                        rows={6}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
                    <Button onClick={handleEditSubmit} variant="contained" className="bitacora-btn-guardar">
                        Actualizar Nota
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