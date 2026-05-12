import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Paper, Table, TableHead, TableRow, 
    TableCell, TableBody, TableContainer, IconButton, Chip, Dialog, 
    DialogTitle, DialogContent, DialogActions, TextField, MenuItem, 
    FormControl, InputLabel, Select, Alert, Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    adminObtenerUsuarios,
    adminActualizarUsuario,
    adminCambiarEstado,
    adminCambiarRol,
    adminEliminarUsuario,
    adminObtenerRoles
} from '../../services/api';
import './AdminUsuarios.css';

interface Usuario {
    id_user: number;
    n_cuenta: string;
    correo: string;
    nombre_completo: string;
    carrera: string;
    activo: boolean;
    id_rol: number;
    rol: string;
}

interface Rol {
    id_rol: number;
    nombre_rol: string;
    descripcion: string;
}

const AdminUsuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openRolModal, setOpenRolModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    
    const [editForm, setEditForm] = useState({
        nombre_completo: '',
        carrera: ''
    });
    
    const [nuevoRol, setNuevoRol] = useState<number>(0);

    const cargarUsuarios = async () => {
        setLoading(true);
        const data = await adminObtenerUsuarios();
        if (data.success) {
            setUsuarios(data.usuarios);
        }
        setLoading(false);
    };

    const cargarRoles = async () => {
        const data = await adminObtenerRoles();
        if (data.success) {
            setRoles(data.roles);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        cargarRoles();
    }, []);

    const handleOpenEditModal = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setEditForm({
            nombre_completo: usuario.nombre_completo || '',
            carrera: usuario.carrera || ''
        });
        setOpenEditModal(true);
    };

    const handleOpenRolModal = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setNuevoRol(usuario.id_rol);
        setOpenRolModal(true);
    };

    const handleEditSubmit = async () => {
        if (!usuarioSeleccionado) return;
        
        const result = await adminActualizarUsuario(usuarioSeleccionado.id_user, {
            nombre_completo: editForm.nombre_completo,
            carrera: editForm.carrera,
            id_rol: usuarioSeleccionado.id_rol
        });
        
        if (result.success) {
            setSnackbar({ open: true, message: 'Usuario actualizado correctamente', severity: 'success' });
            setOpenEditModal(false);
            cargarUsuarios();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al actualizar usuario', severity: 'error' });
        }
    };

    const handleCambiarEstado = async (usuario: Usuario) => {
        const nuevoEstado = !usuario.activo;
        const result = await adminCambiarEstado(usuario.id_user, nuevoEstado);
        
        if (result.success) {
            setSnackbar({ open: true, message: result.message, severity: 'success' });
            cargarUsuarios();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al cambiar estado', severity: 'error' });
        }
    };

    const handleCambiarRol = async () => {
        if (!usuarioSeleccionado) return;
        
        const result = await adminCambiarRol(usuarioSeleccionado.id_user, nuevoRol);
        
        if (result.success) {
            setSnackbar({ open: true, message: 'Rol actualizado correctamente', severity: 'success' });
            setOpenRolModal(false);
            cargarUsuarios();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al cambiar rol', severity: 'error' });
        }
    };

    const handleEliminar = async (usuario: Usuario) => {
        if (window.confirm(`¿Estas seguro de eliminar al usuario ${usuario.nombre_completo}?`)) {
            const result = await adminEliminarUsuario(usuario.id_user);
            if (result.success) {
                setSnackbar({ open: true, message: 'Usuario eliminado correctamente', severity: 'success' });
                cargarUsuarios();
            } else {
                setSnackbar({ open: true, message: result.error || 'Error al eliminar usuario', severity: 'error' });
            }
        }
    };

    const getRolColor = (rol: string) => {
        switch(rol) {
            case 'admin': return '#dc3545';
            case 'tutor': return '#D6A600';
            case 'tutorado': return '#17a2b8';
            default: return '#28a745';
        }
    };

    return (
        <Box className="admin-usuarios-container">
            <Sidebar userRole="admin" />
            
            <Box className="admin-usuarios-main">
                <Container className="admin-usuarios-content">
                    <Box className="admin-usuarios-header">
                        <Typography variant="h4" className="admin-usuarios-titulo">
                            Gestion de Usuarios
                        </Typography>
                    </Box>

                    <Paper className="admin-usuarios-tabla-container">
                        <TableContainer>
                            <Table className="admin-usuarios-tabla">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Correo</TableCell>
                                        <TableCell>Numero Cuenta</TableCell>
                                        <TableCell>Carrera</TableCell>
                                        <TableCell>Rol</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="admin-usuarios-loading">
                                                Cargando usuarios...
                                            </TableCell>
                                        </TableRow>
                                    ) : usuarios.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="admin-usuarios-loading">
                                                No hay usuarios registrados
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        usuarios.map((usuario) => (
                                            <TableRow key={usuario.id_user}>
                                                <TableCell>{usuario.id_user}</TableCell>
                                                <TableCell>{usuario.nombre_completo || 'Sin nombre'}</TableCell>
                                                <TableCell>{usuario.correo}</TableCell>
                                                <TableCell>{usuario.n_cuenta}</TableCell>
                                                <TableCell>{usuario.carrera || 'Sin carrera'}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={usuario.rol} 
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: getRolColor(usuario.rol),
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={usuario.activo ? 'Activo' : 'Inactivo'} 
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: usuario.activo ? '#28a745' : '#dc3545',
                                                            color: 'white'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="admin-usuarios-acciones">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleOpenEditModal(usuario)}
                                                        title="Editar usuario"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleCambiarEstado(usuario)}
                                                        title={usuario.activo ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {usuario.activo ? <BlockIcon /> : <CheckCircleIcon />}
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleOpenRolModal(usuario)}
                                                        title="Cambiar rol"
                                                    >
                                                        👤
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleEliminar(usuario)}
                                                        title="Eliminar usuario"
                                                        className="admin-usuarios-icono-eliminar"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </Box>

            {/* Modal Editar Usuario */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="admin-usuarios-modal-titulo">
                    Editar Usuario
                    <IconButton onClick={() => setOpenEditModal(false)} className="admin-usuarios-modal-close">
                        ✕
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Nombre completo"
                        value={editForm.nombre_completo}
                        onChange={(e) => setEditForm({ ...editForm, nombre_completo: e.target.value })}
                        margin="normal"
                        className="admin-usuarios-input"
                    />
                    <TextField
                        fullWidth
                        label="Carrera"
                        value={editForm.carrera}
                        onChange={(e) => setEditForm({ ...editForm, carrera: e.target.value })}
                        margin="normal"
                        className="admin-usuarios-input"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
                    <Button onClick={handleEditSubmit} variant="contained" className="admin-usuarios-btn-guardar">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Cambiar Rol */}
            <Dialog open={openRolModal} onClose={() => setOpenRolModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="admin-usuarios-modal-titulo">
                    Cambiar Rol
                    <IconButton onClick={() => setOpenRolModal(false)} className="admin-usuarios-modal-close">
                        ✕
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={nuevoRol}
                            onChange={(e) => setNuevoRol(Number(e.target.value))}
                        >
                            {roles.map((rol) => (
                                <MenuItem key={rol.id_rol} value={rol.id_rol}>
                                    {rol.nombre_rol} - {rol.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRolModal(false)}>Cancelar</Button>
                    <Button onClick={handleCambiarRol} variant="contained" className="admin-usuarios-btn-guardar">
                        Cambiar Rol
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

export default AdminUsuarios;