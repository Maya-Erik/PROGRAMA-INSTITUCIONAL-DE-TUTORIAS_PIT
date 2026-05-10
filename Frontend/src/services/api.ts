const API_URL = 'https://tu-backend.onrender.com/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};


//Autenticacion
export const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return res.json();
};

export const register = async (userData: {
    n_cuenta: string;
    email: string;
    password: string;
    nombre_completo: string;
    carrera: string;
    id_rol: number;
}) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
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

export const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return user.role;
        } catch {
            return null;
        }
    }
    return null;
};

//Perfil
export const obtenerPerfil = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/users/perfil`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return res.json();
};

export const actualizarPerfil = async (userData: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/perfil`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(userData)
    });
    return res.json();
};


//Citas
export const obtenerCitas = async () => {
    const res = await fetch(`${API_URL}/citas`, { headers: getHeaders() });
    return res.json();
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
    const res = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(citaData)
    });
    return res.json();
};

export const editarCita = async (id: number, citaData: any) => {
    const res = await fetch(`${API_URL}/citas/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(citaData)
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

export const asignarLugar = async (id: number, lugar: string) => {
    const res = await fetch(`${API_URL}/citas/${id}/lugar`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ lugar })
    });
    return res.json();
};


//Estadisticas
export const obtenerEstadisticas = async () => {
    const res = await fetch(`${API_URL}/auth/estadisticas`);
    return res.json();
};