import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Badge, Typography, Box, Divider, Button,
    List, ListItem, ListItemText, ListItemIcon, Chip,
    CircularProgress, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
    obtenerNotificaciones, 
    marcarNotificacionLeida, 
    marcarTodasNotificacionesLeidas,
    eliminarNotificacion
} from '../../services/api';
import './Notificaciones.css';

interface Notificacion {
    id_notificacion: number;
    titulo: string;
    mensaje: string;
    tipo: string;
    leida: boolean;
    fecha: string;
}

const Notificaciones: React.FC = () => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const intervalRef = React.useRef<number | null>(null);

    const cargarNotificaciones = async () => {
        setLoading(true);
        try {
            const data = await obtenerNotificaciones();
            if (data.success) {
                setNotificaciones(data.notificaciones);
                setNoLeidas(data.noLeidas);
            }
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarNotificaciones();
        
        intervalRef.current = window.setInterval(() => {
            cargarNotificaciones();
        }, 30000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleOpen = () => {
        setOpen(true);
        cargarNotificaciones();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMarcarLeida = async (id: number) => {
        await marcarNotificacionLeida(id);
        cargarNotificaciones();
    };

    const handleMarcarTodasLeidas = async () => {
        await marcarTodasNotificacionesLeidas();
        cargarNotificaciones();
    };

    const handleEliminar = async (id: number) => {
        await eliminarNotificacion(id);
        cargarNotificaciones();
    };

    const getIcono = (tipo: string) => {
        switch (tipo) {
            case 'success':
                return <CheckCircleIcon className="notificacion-icon-success" />;
            case 'warning':
                return <WarningIcon className="notificacion-icon-warning" />;
            case 'error':
                return <ErrorIcon className="notificacion-icon-error" />;
            default:
                return <InfoIcon className="notificacion-icon-info" />;
        }
    };

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);
        
        if (minutos < 1) return 'Ahora';
        if (minutos < 60) return `${minutos} min`;
        if (horas < 24) return `${horas} h`;
        return `${dias} d`;
    };

    return (
        <>
            <Tooltip title="Notificaciones">
                <IconButton 
                    onClick={handleOpen} 
                    className="notificaciones-boton"
                    size="small"
                    sx={{ color: '#003DA5' }}
                >
                    <Badge 
                        badgeContent={noLeidas} 
                        color="error"
                        max={99}
                    >
                        {noLeidas > 0 ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
                    </Badge>
                </IconButton>
            </Tooltip>

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                className="notificaciones-dialog"
                PaperProps={{
                    className: 'notificaciones-dialog-paper'
                }}
            >
                <DialogTitle className="notificaciones-dialog-titulo">
                    <Typography variant="h6">Notificaciones</Typography>
                    <IconButton onClick={handleClose} className="notificaciones-dialog-close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <Divider />
                
                <DialogContent className="notificaciones-dialog-content">
                    {notificaciones.length > 0 && (
                        <Box className="notificaciones-dialog-actions">
                            <Button 
                                size="small" 
                                onClick={handleMarcarTodasLeidas}
                                startIcon={<DoneAllIcon />}
                                disabled={noLeidas === 0}
                            >
                                Marcar todas como leídas
                            </Button>
                        </Box>
                    )}
                    
                    {loading ? (
                        <Box className="notificaciones-loading">
                            <CircularProgress size={40} />
                            <Typography>Cargando...</Typography>
                        </Box>
                    ) : notificaciones.length === 0 ? (
                        <Box className="notificaciones-vacio">
                            <NotificationsNoneIcon className="notificaciones-vacio-icon" />
                            <Typography variant="body1">No hay notificaciones</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Cuando tengas notificaciones, aparecerán aquí
                            </Typography>
                        </Box>
                    ) : (
                        <List className="notificaciones-lista">
                            {notificaciones.map((notif) => (
                                <ListItem 
                                    key={notif.id_notificacion} 
                                    className={`notificacion-item ${!notif.leida ? 'no-leida' : ''}`}
                                    onClick={() => handleMarcarLeida(notif.id_notificacion)}
                                >
                                    <ListItemIcon>
                                        {getIcono(notif.tipo)}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={
                                            <Box className="notificacion-item-titulo">
                                                <Typography variant="subtitle2" component="span" fontWeight={!notif.leida ? 600 : 400}>
                                                    {notif.titulo}
                                                </Typography>
                                                <Chip 
                                                    label={formatFecha(notif.fecha)} 
                                                    size="small" 
                                                    className="notificacion-fecha-chip"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" className="notificacion-item-mensaje">
                                                {notif.mensaje}
                                            </Typography>
                                        }
                                    />
                                    <IconButton 
                                        size="small" 
                                        className="notificacion-item-eliminar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEliminar(notif.id_notificacion);
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                
                <DialogActions className="notificaciones-dialog-acciones">
                    <Button onClick={handleClose} fullWidth>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Notificaciones;