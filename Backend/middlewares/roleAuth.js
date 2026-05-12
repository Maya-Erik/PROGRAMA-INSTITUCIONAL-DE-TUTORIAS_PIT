const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    // Obtener el token desde el header Authorization (formato: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Se requiere un token de autenticación' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pit_fes_acatlan_secret_key_2026');

        // Adjuntar el payload decodificado (que incluye el rol) al objeto request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Middleware para verificar roles (RBAC)
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log('Roles permitidos:', allowedRoles);
        console.log('Usuario en request:', req.user);
        
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'No se encontraron permisos para el usuario' });
        }

        const userRole = req.user.role.toLowerCase();
        const allowed = allowedRoles.map(r => r.toLowerCase());
        
        if (!allowed.includes(userRole)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    requireRole
};