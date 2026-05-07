const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configuración de headers con token
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

export const register = async (userData: {
    n_cuenta: string;
    email: string;
    password: string;
    nombre_completo: string;
    carrera: string;
}) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

// Obtener citas disponibles
export const getCitasDisponibles = async () => {
    const response = await fetch(`${API_URL}/citas/disponibles`, {
        headers: getHeaders()
    });
    return response.json();
};

// Seleccionar cita (tutorado)
export const seleccionarCita = async (id_cita: number) => {
    const response = await fetch(`${API_URL}/citas/seleccionar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id: id_cita })
    });
    return response.json();
};

// Obtener perfil del usuario
export const getPerfil = async () => {
    const response = await fetch(`${API_URL}/users/perfil`, {
        headers: getHeaders()
    });
    return response.json();
};

// Verificar si está autenticado
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};