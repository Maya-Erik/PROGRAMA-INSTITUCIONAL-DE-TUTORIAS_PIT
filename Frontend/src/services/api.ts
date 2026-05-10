const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// ========== AUTENTICACIÓN ==========
export const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return res.json();
};

export const register = async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};

// ========== CITAS ==========
export const obtenerCitas = async () => {
    const res = await fetch(`${API_URL}/citas`, { headers: getHeaders() });
    return res.json();
};

export const crearCita = async (data: any) => {
    const res = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return res.json();
};

export const editarCita = async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/citas/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return res.json();
};

export const eliminarCita = async (id: number) => {
    const res = await fetch(`${API_URL}/citas/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return res.json();
};

export const inscribirseCita = async (id: number) => {
    const res = await fetch(`${API_URL}/citas/${id}/inscribirse`, {
        method: 'POST',
        headers: getHeaders()
    });
    return res.json();
};

export const misCitas = async () => {
    const res = await fetch(`${API_URL}/citas/mis-citas`, { headers: getHeaders() });
    return res.json();
};