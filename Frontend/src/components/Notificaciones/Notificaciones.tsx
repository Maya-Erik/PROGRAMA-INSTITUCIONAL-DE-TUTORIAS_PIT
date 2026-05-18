import React, { useState, useEffect, useRef } from 'react';
import {
    IconButton, Badge, Menu, MenuItem, Typography, Box,
    Divider, Button, List, ListItemText, ListItemIcon,
    Chip, CircularProgress, Tooltip
} from '@mui/material';
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<number | null>(null);

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
        
        // Actualizar cada 30 segundos
        intervalRef.current = window.setInterval(() => {
            cargarNotificaciones();
        }, 30000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                    size="large"
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
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="notificaciones-menu"
                PaperProps={{
                    className: 'notificaciones-paper'
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box className="notificaciones-header">
                    <Typography variant="h6">Notificaciones</Typography>
                    {notificaciones.length > 0 && (
                        <Button 
                            size="small" 
                            onClick={handleMarcarTodasLeidas}
                            startIcon={<DoneAllIcon />}
                        >
                            Marcar todas
                        </Button>
                    )}
                </Box>
                <Divider />
                
                {loading ? (
                    <Box className="notificaciones-loading">
                        <CircularProgress size={30} />
                    </Box>
                ) : notificaciones.length === 0 ? (
                    <Box className="notificaciones-vacio">
                        <NotificationsNoneIcon className="notificaciones-vacio-icon" />
                        <Typography variant="body2" color="textSecondary">
                            No hay notificaciones
                        </Typography>
                    </Box>
                ) : (
                    <List className="notificaciones-lista">
                        {notificaciones.map((notif) => (
                            <MenuItem 
                                key={notif.id_notificacion} 
                                className={`notificacion-item ${!notif.leida ? 'no-leida' : ''}`}
                                onClick={() => handleMarcarLeida(notif.id_notificacion)}
                            >
                                <ListItemIcon>
                                    {getIcono(notif.tipo)}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <Box className="notificacion-titulo">
                                            <Typography variant="subtitle2" component="span">
                                                {notif.titulo}
                                            </Typography>
                                            <Chip 
                                                label={formatFecha(notif.fecha)} 
                                                size="small" 
                                                className="notificacion-fecha"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" className="notificacion-mensaje">
                                            {notif.mensaje}
                                        </Typography>
                                    }
                                />
                                <IconButton 
                                    size="small" 
                                    className="notificacion-eliminar"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEliminar(notif.id_notificacion);
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </MenuItem>
                        ))}
                    </List>
                )}
                
                <Divider />
                <Box className="notificaciones-footer">
                    <Button size="small" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default Notificaciones;