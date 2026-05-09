const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Login
export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

// Registro
export const registro = async (userData: {
    n_cuenta: string;
    email: string;
    password: string;
    nombre_completo: string;
    carrera: string;
    id_rol: number;
}) => {
    const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

// Obtener perfil del usuario autenticado
export const getPerfil = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/perfil`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};

// Verificar si está autenticado
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Verificar si el token no ha expirado
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

// Obtener el rol del usuario
export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch {
        return null;
    }
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};