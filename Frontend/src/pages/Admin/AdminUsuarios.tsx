import React, { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, FormControl, InputLabel, Select,
    IconButton, Alert, Snackbar, Avatar, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { 
    Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, 
    CheckCircle as CheckCircleIcon, Add as AddIcon, Person as PersonIcon 
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    adminObtenerUsuarios,
    adminActualizarUsuario,
    adminCambiarEstado,
    adminCambiarRol,
    adminEliminarUsuario,
    adminObtenerRoles
} from '../../services/api';
import SidebarToggle from '../../components/Sidebar/SidebarToggle';
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

const carreras = [
    "Actuaría",
    "Arquitectura",
    "Ciencias Políticas y Administración Pública",
    "Comunicación",
    "Derecho",
    "Diseño Gráfico",
    "Economía",
    "Enseñanza de (Español) (Inglés) Como Lengua Extranjera",
    "Enseñanza de Inglés",
    "Filosofía",
    "Historia",
    "Ingeniería Civil",
    "Lengua y Literaturas Hispánicas",
    "Matemáticas Aplicadas y Computación",
    "Pedagogía",
    "Relaciones Internacionales",
    "Sociología",
    "Derecho (SUAyED)",
    "Relaciones Internacionales (SUAyED)",
    "LICEL"
];

const coloresPerfil = ['#003DA5', '#D6A600', '#001F54', '#4A4A4A', '#00897B', '#c62828', '#6a1b9a', '#00695c'];

const AdminUsuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openRolModal, setOpenRolModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    
    const [editForm, setEditForm] = useState({
        nombre_completo: '',
        carrera: ''
    });
    
    const [addForm, setAddForm] = useState({
        n_cuenta: '',
        correo: '',
        password: '',
        nombre_completo: '',
        carrera: '',
        id_rol: 4
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

    const getColorPerfil = (id: number) => {
        return coloresPerfil[id % coloresPerfil.length];
    };

    const getInitials = (nombre: string) => {
        if (!nombre) return 'U';
        return nombre.charAt(0).toUpperCase();
    };

    const handleOpenAddModal = () => {
        setAddForm({
            n_cuenta: '',
            correo: '',
            password: '',
            nombre_completo: '',
            carrera: '',
            id_rol: 4
        });
        setOpenAddModal(true);
    };

    const handleAddSubmit = async () => {
        if (!addForm.n_cuenta || !addForm.correo || !addForm.password || !addForm.nombre_completo) {
            setSnackbar({ open: true, message: 'Todos los campos son obligatorios', severity: 'error' });
            return;
        }

        const emailCompleto = `${addForm.correo}@pcpuma.acatlan.unam.mx`;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    n_cuenta: addForm.n_cuenta,
                    email: emailCompleto,
                    password: addForm.password,
                    nombre_completo: addForm.nombre_completo,
                    carrera: addForm.carrera,
                    id_rol: addForm.id_rol
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSnackbar({ open: true, message: 'Usuario creado correctamente', severity: 'success' });
                setOpenAddModal(false);
                cargarUsuarios();
            } else {
                setSnackbar({ open: true, message: data.message || 'Error al crear usuario', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al crear usuario', severity: 'error' });
        }
    };

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
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre_completo}?`)) {
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
        <div className="admin-usuarios-container">
            <Sidebar userRole="admin" />
            <SidebarToggle />
            <main className="admin-usuarios-main">
                <header className="admin-usuarios-topbar">
                    <span className="admin-usuarios-breadcrumb">Configuración › Usuarios</span>
                    <div className="admin-usuarios-topbar-right">
                        <span className="admin-usuarios-topbar-bell">🔔</span>
                        <div className="admin-usuarios-topbar-user">
                            <div>
                                <p className="admin-usuarios-topbar-name">Administrador</p>
                                <p className="admin-usuarios-topbar-role">ADMIN</p>
                            </div>
                            <div className="admin-usuarios-topbar-avatar">AD</div>
                        </div>
                    </div>
                </header>

                <div className="admin-usuarios-content">
                    <div className="admin-usuarios-top-actions">
                        <div className="admin-usuarios-left-group">
                            <button className="admin-usuarios-white-btn">📋 Exportar</button>
                        </div>
                        <button className="admin-usuarios-gold-btn" onClick={handleOpenAddModal}>
                            <AddIcon /> Nuevo Usuario
                        </button>
                    </div>

                    <div className="admin-usuarios-table-card">
                        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                            <Table className="admin-usuarios-user-table" sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>USUARIO</TableCell>
                                        <TableCell>CORREO</TableCell>
                                        <TableCell>NÚMERO CUENTA</TableCell>
                                        <TableCell>CARRERA</TableCell>
                                        <TableCell>ROL</TableCell>
                                        <TableCell>ESTADO</TableCell>
                                        <TableCell>ACCIONES</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                Cargando usuarios...
                                            </TableCell>
                                        </TableRow>
                                    ) : usuarios.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                No hay usuarios registrados
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        usuarios.map((usuario) => (
                                            <TableRow key={usuario.id_user}>
                                                <TableCell>
                                                    <div className="admin-usuarios-user-cell">
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 40, 
                                                                height: 40, 
                                                                bgcolor: getColorPerfil(usuario.id_user),
                                                                fontSize: '1rem',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {getInitials(usuario.nombre_completo || usuario.correo)}
                                                        </Avatar>
                                                        <div className="admin-usuarios-u-name">{usuario.nombre_completo || 'Sin nombre'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 200, wordBreak: 'break-word' }}>{usuario.correo}</TableCell>
                                                <TableCell>{usuario.n_cuenta}</TableCell>
                                                <TableCell sx={{ maxWidth: 180, wordBreak: 'break-word' }}>{usuario.carrera || 'Sin carrera'}</TableCell>
                                                <TableCell>
                                                    <div className="admin-usuarios-role-cell">
                                                        <span className="admin-usuarios-dot-role" style={{ backgroundColor: getRolColor(usuario.rol) }}></span>
                                                        {usuario.rol}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`admin-usuarios-status-pill ${usuario.activo ? 'activo' : 'inactivo'}`}>
                                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="admin-usuarios-action-btns">
                                                        <IconButton size="small" onClick={() => handleOpenEditModal(usuario)} title="Editar">
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleCambiarEstado(usuario)} title={usuario.activo ? 'Desactivar' : 'Activar'}>
                                                            {usuario.activo ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleOpenRolModal(usuario)} title="Cambiar rol">
                                                            <PersonIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleEliminar(usuario)} title="Eliminar" sx={{ color: '#dc3545' }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </main>

            {/* Modales... (se mantienen igual) */}
            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#003DA5', color: 'white' }}>
                    Nuevo Usuario
                    <IconButton onClick={() => setOpenAddModal(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
                        ✕
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Número de cuenta"
                        value={addForm.n_cuenta}
                        onChange={(e) => setAddForm({ ...addForm, n_cuenta: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Usuario (sin @)"
                        value={addForm.correo}
                        onChange={(e) => setAddForm({ ...addForm, correo: e.target.value })}
                        margin="normal"
                        helperText="El correo se completará automáticamente con @pcpuma.acatlan.unam.mx"
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Contraseña"
                        value={addForm.password}
                        onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Nombre completo"
                        value={addForm.nombre_completo}
                        onChange={(e) => setAddForm({ ...addForm, nombre_completo: e.target.value })}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Carrera</InputLabel>
                        <Select
                            value={addForm.carrera}
                            onChange={(e) => setAddForm({ ...addForm, carrera: e.target.value })}
                        >
                            {carreras.map((carrera) => (
                                <MenuItem key={carrera} value={carrera}>{carrera}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={addForm.id_rol}
                            onChange={(e) => setAddForm({ ...addForm, id_rol: Number(e.target.value) })}
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
                    <Button onClick={() => setOpenAddModal(false)}>Cancelar</Button>
                    <Button onClick={handleAddSubmit} variant="contained" sx={{ bgcolor: '#003DA5' }}>
                        Crear Usuario
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#003DA5', color: 'white' }}>
                    Editar Usuario
                    <IconButton onClick={() => setOpenEditModal(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
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
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Carrera</InputLabel>
                        <Select
                            value={editForm.carrera}
                            onChange={(e) => setEditForm({ ...editForm, carrera: e.target.value })}
                        >
                            {carreras.map((carrera) => (
                                <MenuItem key={carrera} value={carrera}>{carrera}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
                    <Button onClick={handleEditSubmit} variant="contained" sx={{ bgcolor: '#003DA5' }}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openRolModal} onClose={() => setOpenRolModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#003DA5', color: 'white' }}>
                    Cambiar Rol
                    <IconButton onClick={() => setOpenRolModal(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
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
                    <Button onClick={handleCambiarRol} variant="contained" sx={{ bgcolor: '#003DA5' }}>
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
        </div>
    );
};

export default AdminUsuarios;