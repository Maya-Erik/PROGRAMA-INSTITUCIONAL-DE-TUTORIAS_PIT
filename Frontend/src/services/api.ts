const API_URL = 'https://programa-institucional-de-tutorias-pit.onrender.com/api'

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};


//Autenticacion
export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log('Login API response:', data);
    return data;
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


//Admin citas
export const adminObtenerCitas = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/citas`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const adminCrearCita = async (citaData: {
    materia: string;
    tutor_nombre: string;
    fecha: string;
    hora: string;
    capacidad: number;
    tipo: string;
    carrera: string;
}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/citas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(citaData)
    });
    return response.json();
};

export const adminActualizarCita = async (id: number, citaData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/citas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(citaData)
    });
    return response.json();
};

export const adminEliminarCita = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/citas/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const adminAsignarLugar = async (id: number, lugar: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/citas/${id}/lugar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ lugar })
    });
    return response.json();
};


//Bitacora
export const obtenerNotasPorCita = async (id_cita: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bitacora/cita/${id_cita}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const agregarNota = async (id_cita: number, nota: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bitacora/cita/${id_cita}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ nota })
    });
    return response.json();
};

export const editarNota = async (id_bitacora: number, nota: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bitacora/${id_bitacora}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ nota })
    });
    return response.json();
};

export const eliminarNota = async (id_bitacora: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bitacora/${id_bitacora}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const obtenerTodasNotas = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bitacora/todas`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};


//Estadisticas
export const obtenerEstadisticas = async () => {
    const res = await fetch(`${API_URL}/auth/estadisticas`);
    return res.json();
};



//Avisos
export const obtenerAvisos = async () => {
    const response = await fetch(`${API_URL}/avisos`);
    return response.json();
};

export const obtenerAvisosAdmin = async () => {
    const response = await fetch(`${API_URL}/avisos/admin`, {
        headers: getHeaders()
    });
    return response.json();
};

export const crearAviso = async (avisoData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/avisos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(avisoData)
    });
    return response.json();
};

export const actualizarAviso = async (id: number, avisoData: any) => {
    const response = await fetch(`${API_URL}/avisos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(avisoData)
    });
    return response.json();
};

export const eliminarAviso = async (id: number) => {
    const response = await fetch(`${API_URL}/avisos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return response.json();
};

export const actualizarOrdenAvisos = async (avisos: { id_aviso: number }[]) => {
    const response = await fetch(`${API_URL}/avisos/orden/actualizar`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ avisos })
    });
    return response.json();
};


//Admin usuarios
export const adminObtenerUsuarios = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const adminObtenerUsuario = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const adminActualizarUsuario = async (id: number, userData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(userData)
    });
    return response.json();
};

export const adminCambiarEstado = async (id: number, activo: boolean) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/${id}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ activo })
    });
    return response.json();
};

export const adminCambiarRol = async (id: number, id_rol: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/${id}/rol`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ id_rol })
    });
    return response.json();
};

export const adminEliminarUsuario = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};

export const adminObtenerRoles = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/roles/list`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    return response.json();
};