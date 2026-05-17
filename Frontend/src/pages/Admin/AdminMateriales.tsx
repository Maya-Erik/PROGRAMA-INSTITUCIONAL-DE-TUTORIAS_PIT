import React, { useState, useEffect } from 'react';
import {
    Paper, Table, TableHead, TableRow, TableCell, TableBody,
    TableContainer, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Alert, Snackbar, Select,
    MenuItem, FormControl, InputLabel, Chip, Switch, FormControlLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
    obtenerMateriales,
    crearMaterial,
    actualizarMaterial,
    eliminarMaterial,
    obtenerCategorias
} from '../../services/api';
import MainContent from '../../components/Layout/MainContent';
import './AdminMateriales.css';

interface Material {
    id_material: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    categoria: string;
    carrera: string;
    archivo_url: string;
    tamano: string;
    activo: boolean;
    orden: number;
}

interface Categoria {
    id_categoria: number;
    nombre: string;
    descripcion: string;
}

const carreras = [
    "Actuaría", "Arquitectura", "Ciencias Políticas y Administración Pública",
    "Comunicación", "Derecho", "Diseño Gráfico", "Economía",
    "Enseñanza de (Español) (Inglés) Como Lengua Extranjera", "Enseñanza de Inglés",
    "Filosofía", "Historia", "Ingeniería Civil", "Lengua y Literaturas Hispánicas",
    "Matemáticas Aplicadas y Computación", "Pedagogía", "Relaciones Internacionales",
    "Sociología", "Derecho (SUAyED)", "Relaciones Internacionales (SUAyED)", "LICEL"
];

const tiposMaterial = [
    { value: 'documento_institucional', label: 'Documento Institucional' },
    { value: 'material_academico', label: 'Material Académico' },
    { value: 'recurso_formacion', label: 'Recurso de Formación' }
];

const AdminMateriales: React.FC = () => {
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editando, setEditando] = useState<Material | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'documento_institucional',
        categoria: 'documentos_institucionales',
        carrera: '',
        archivo_url: '',
        tamano: '',
        activo: true,
        orden: 0
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        const [materialesRes, categoriasRes] = await Promise.all([
            obtenerMateriales(),
            obtenerCategorias()
        ]);
        
        if (materialesRes.success) setMateriales(materialesRes.materiales || []);
        if (categoriasRes.success) setCategorias(categoriasRes.categorias || []);
        
        setLoading(false);
    };

    const handleOpenModal = (material?: Material) => {
        if (material) {
            setEditando(material);
            setFormData({
                titulo: material.titulo,
                descripcion: material.descripcion || '',
                tipo: material.tipo,
                categoria: material.categoria,
                carrera: material.carrera || '',
                archivo_url: material.archivo_url,
                tamano: material.tamano || '',
                activo: material.activo,
                orden: material.orden
            });
        } else {
            setEditando(null);
            setFormData({
                titulo: '',
                descripcion: '',
                tipo: 'documento_institucional',
                categoria: 'documentos_institucionales',
                carrera: '',
                archivo_url: '',
                tamano: '',
                activo: true,
                orden: 0
            });
        }
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.titulo || !formData.tipo || !formData.archivo_url) {
            setSnackbar({ open: true, message: 'Título, tipo y URL son obligatorios', severity: 'error' });
            return;
        }

        let result;
        if (editando) {
            result = await actualizarMaterial(editando.id_material, formData);
        } else {
            result = await crearMaterial(formData);
        }

        if (result.success) {
            setSnackbar({ open: true, message: `Material ${editando ? 'actualizado' : 'creado'} correctamente`, severity: 'success' });
            setOpenModal(false);
            cargarDatos();
        } else {
            setSnackbar({ open: true, message: result.error || 'Error al guardar', severity: 'error' });
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este material?')) {
            const result = await eliminarMaterial(id);
            if (result.success) {
                setSnackbar({ open: true, message: 'Material eliminado correctamente', severity: 'success' });
                cargarDatos();
            } else {
                setSnackbar({ open: true, message: result.error || 'Error al eliminar', severity: 'error' });
            }
        }
    };

    const getTipoLabel = (tipo: string) => {
        const t = tiposMaterial.find(t => t.value === tipo);
        return t ? t.label : tipo;
    };

    return (
        <div className="admin-materiales-container">
            <Sidebar userRole="admin" />
            
            <main className="admin-materiales-main">
                <header className="admin-materiales-topbar">
                    <span className="admin-materiales-breadcrumb">Administración › Materiales</span>
                    <div className="admin-materiales-topbar-right">
                        <div className="admin-materiales-topbar-user">
                            <div className="admin-materiales-topbar-avatar">AD</div>
                        </div>
                    </div>
                </header>

                <div className="admin-materiales-content">
                    <div className="admin-materiales-header">
                        <h1>Gestión de Materiales</h1>
                        <button className="admin-materiales-add-btn" onClick={() => handleOpenModal()}>
                            <AddIcon /> Agregar Material
                        </button>
                    </div>

                    <Paper className="admin-materiales-table-container">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>TÍTULO</TableCell>
                                        <TableCell>TIPO</TableCell>
                                        <TableCell>CATEGORÍA</TableCell>
                                        <TableCell>CARRERA</TableCell>
                                        <TableCell>URL</TableCell>
                                        <TableCell>ESTADO</TableCell>
                                        <TableCell>ACCIONES</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={7} align="center">Cargando...</TableCell></TableRow>
                                    ) : materiales.length === 0 ? (
                                        <TableRow><TableCell colSpan={7} align="center">No hay materiales registrados</TableCell></TableRow>
                                    ) : (
                                        materiales.map((mat) => (
                                            <TableRow key={mat.id_material}>
                                                <TableCell>{mat.titulo}</TableCell>
                                                <TableCell><Chip label={getTipoLabel(mat.tipo)} size="small" /></TableCell>
                                                <TableCell>{mat.categoria}</TableCell>
                                                <TableCell>{mat.carrera || '-'}</TableCell>
                                                <TableCell className="url-cell">
                                                    <a href={mat.archivo_url} target="_blank" rel="noopener noreferrer">
                                                        Ver archivo
                                                    </a>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={mat.activo ? 'Activo' : 'Inactivo'} 
                                                        size="small"
                                                        sx={{ bgcolor: mat.activo ? '#28a745' : '#dc3545', color: 'white' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => handleOpenModal(mat)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleEliminar(mat.id_material)} sx={{ color: '#dc3545' }}>
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
                </div>
            </main>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editando ? 'Editar Material' : 'Nuevo Material'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Título"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        >
                            {tiposMaterial.map((t) => (
                                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        >
                            {categorias.map((c) => (
                                <MenuItem key={c.id_categoria} value={c.nombre}>{c.descripcion}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {formData.tipo === 'material_academico' && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Carrera</InputLabel>
                            <Select
                                value={formData.carrera}
                                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                            >
                                {carreras.map((c) => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <TextField
                        fullWidth
                        label="URL del archivo"
                        value={formData.archivo_url}
                        onChange={(e) => setFormData({ ...formData, archivo_url: e.target.value })}
                        margin="normal"
                        required
                        helperText="Google Drive, Dropbox, o URL del archivo"
                    />
                    <TextField
                        fullWidth
                        label="Tamaño (ej: 2.5 MB)"
                        value={formData.tamano}
                        onChange={(e) => setFormData({ ...formData, tamano: e.target.value })}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.activo}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                            />
                        }
                        label="Activo"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default AdminMateriales;