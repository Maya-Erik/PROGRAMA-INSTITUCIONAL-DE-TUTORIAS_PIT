// Backend/middlewares/permissionAuth.js
const db = require("../connection");

const hasPermission = (permisoRequerido) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: 'No autenticado' });
        }

        try {
            const query = `
                SELECT usuario_tiene_permiso($1, $2) AS tiene_permiso
            `;
            const result = await db.query(query, [req.user.id, permisoRequerido]);
            
            if (result.rows[0]?.tiene_permiso) {
                next();
            } else {
                return res.status(403).json({ 
                    message: `Acceso denegado. Se requiere permiso: ${permisoRequerido}` 
                });
            }
        } catch (error) {
            console.error('Error al verificar permiso:', error);
            return res.status(500).json({ message: 'Error al verificar permisos' });
        }
    };
};

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'No se encontraron permisos para el usuario' });
        }

        const userRole = req.user.role.toLowerCase();
        const allowed = allowedRoles.map(r => r.toLowerCase());
        
        // Tutor y Tutorado tienen los mismos permisos
        if (userRole === 'tutorado' && allowed.includes('tutor')) {
            return next();
        }
        
        if (!allowed.includes(userRole)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

module.exports = {
    hasPermission,
    requireRole
};