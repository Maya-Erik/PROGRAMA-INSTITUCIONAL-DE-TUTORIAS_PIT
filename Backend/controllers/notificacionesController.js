const db = require("../connection");

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

// Obtener notificaciones del usuario
exports.obtenerNotificaciones = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await db.query(`
            SELECT id_notificacion, titulo, mensaje, tipo, leida, fecha
            FROM tr_notificaciones
            WHERE id_usuario = $1
            ORDER BY fecha DESC
            LIMIT 50
        `, [userId]);
        
        // Contar no leídas
        const noLeidasResult = await db.query(`
            SELECT COUNT(*) as total FROM tr_notificaciones
            WHERE id_usuario = $1 AND leida = false
        `, [userId]);
        
        res.json({ 
            success: true, 
            notificaciones: result.rows,
            noLeidas: parseInt(noLeidasResult.rows[0].total)
        });
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        res.status(500).json({ success: false, error: "Error al obtener notificaciones" });
    }
};

// Marcar notificación como leída
exports.marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const result = await db.query(`
            UPDATE tr_notificaciones
            SET leida = true
            WHERE id_notificacion = $1 AND id_usuario = $2
            RETURNING *
        `, [id, userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Notificación no encontrada" });
        }
        
        res.json({ success: true, message: "Notificación marcada como leída" });
    } catch (error) {
        console.error("Error al marcar notificación:", error);
        res.status(500).json({ success: false, error: "Error al marcar notificación" });
    }
};

// Marcar todas como leídas
exports.marcarTodasLeidas = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await db.query(`
            UPDATE tr_notificaciones
            SET leida = true
            WHERE id_usuario = $1 AND leida = false
        `, [userId]);
        
        res.json({ success: true, message: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
        console.error("Error al marcar todas las notificaciones:", error);
        res.status(500).json({ success: false, error: "Error al marcar notificaciones" });
    }
};

// Eliminar notificación
exports.eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const result = await db.query(`
            DELETE FROM tr_notificaciones
            WHERE id_notificacion = $1 AND id_usuario = $2
            RETURNING *
        `, [id, userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Notificación no encontrada" });
        }
        
        res.json({ success: true, message: "Notificación eliminada" });
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
        res.status(500).json({ success: false, error: "Error al eliminar notificación" });
    }
};

// ============================================
// FUNCIÓN INTERNA PARA CREAR NOTIFICACIONES
// ============================================
const crearNotificacion = async (userId, titulo, mensaje, tipo = 'info') => {
    try {
        await db.query(`
            INSERT INTO tr_notificaciones (id_usuario, titulo, mensaje, tipo, fecha)
            VALUES ($1, $2, $3, $4, NOW())
        `, [userId, titulo, mensaje, tipo]);
        console.log(`Notificación creada para usuario ${userId}: ${titulo}`);
    } catch (error) {
        console.error("Error al crear notificación:", error);
    }
};

// Exportar la función interna también
exports.crearNotificacion = crearNotificacion;