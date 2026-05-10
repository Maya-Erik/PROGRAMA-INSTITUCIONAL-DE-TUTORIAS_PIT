const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

//Autenticacion
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
    id_rol: number;
}) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};

export const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user.role;
    }
    return null;
};


//Perfil
export const obtenerPerfil = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/perfil`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};

export const actualizarPerfil = async (userData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/perfil`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return response.json();
};

//Citas
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const obtenerCitas = async () => {
    const response = await fetch(`${API_URL}/citas`, {
        headers: getHeaders()
    });
    return response.json();
};

export const crearCita = async (citaData: {
    materia: string;
    tutor_nombre: string;
    fecha: string;
    hora: string;
    capacidad: number;
    tipo: string;
    carrera: string;
}) => {
    const response = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(citaData)
    });
    return response.json();
};

export const editarCita = async (id: number, citaData: any) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(citaData)
    });
    return response.json();
};

export const eliminarCita = async (id: number) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return response.json();
};

export const inscribirseCita = async (id: number) => {
    const response = await fetch(`${API_URL}/citas/${id}/inscribirse`, {
        method: 'POST',
        headers: getHeaders()
    });
    return response.json();
};

export const misCitas = async () => {
    const response = await fetch(`${API_URL}/citas/mis-citas`, {
        headers: getHeaders()
    });
    return response.json();
};

export const asignarLugar = async (id: number, lugar: string) => {
    const response = await fetch(`${API_URL}/citas/${id}/lugar`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ lugar })
    });
    return response.json();
};