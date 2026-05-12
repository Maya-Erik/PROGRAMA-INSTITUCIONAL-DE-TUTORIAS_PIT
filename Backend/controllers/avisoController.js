
const db = require("../connection");

// Obtener todos los avisos (para el carrusel)
exports.obtenerAvisos = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id_aviso, titulo, contenido, imagen, enlace, color, orden FROM tr_avisos WHERE activo = true ORDER BY orden ASC"
        );
        res.json({ success: true, avisos: result.rows });
    } catch (error) {
        console.error("Error al obtener avisos:", error);
        res.status(500).json({ success: false, error: "Error al obtener avisos" });
    }
};

// Obtener todos los avisos para el admin
exports.obtenerAvisosAdmin = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM tr_avisos ORDER BY orden ASC"
        );
        res.json({ success: true, avisos: result.rows });
    } catch (error) {
        console.error("Error al obtener avisos:", error);
        res.status(500).json({ success: false, error: "Error al obtener avisos" });
    }
};

// Crear aviso
exports.crearAviso = async (req, res) => {
    try {
        const { titulo, contenido, imagen, enlace, color, orden } = req.body;
        
        if (!titulo || !contenido) {
            return res.status(400).json({ success: false, error: "Titulo y contenido son obligatorios" });
        }
        
        const result = await db.query(
            `INSERT INTO tr_avisos (titulo, contenido, imagen, enlace, color, orden)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [titulo, contenido, imagen || null, enlace || null, color || '#003DA5', orden || 0]
        );
        
        res.json({ success: true, aviso: result.rows[0] });
    } catch (error) {
        console.error("Error al crear aviso:", error);
        res.status(500).json({ success: false, error: "Error al crear aviso" });
    }
};

// Actualizar aviso
exports.actualizarAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido, imagen, enlace, color, orden, activo } = req.body;
        
        const result = await db.query(
            `UPDATE tr_avisos 
             SET titulo = $1, contenido = $2, imagen = $3, enlace = $4, 
                 color = $5, orden = $6, activo = $7, updated_at = NOW()
             WHERE id_aviso = $8
             RETURNING *`,
            [titulo, contenido, imagen || null, enlace || null, color || '#003DA5', orden || 0, activo !== false, id]
        );
        
        res.json({ success: true, aviso: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar aviso:", error);
        res.status(500).json({ success: false, error: "Error al actualizar aviso" });
    }
};

// Eliminar aviso
exports.eliminarAviso = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM tr_avisos WHERE id_aviso = $1", [id]);
        res.json({ success: true, message: "Aviso eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar aviso:", error);
        res.status(500).json({ success: false, error: "Error al eliminar aviso" });
    }
};

// Actualizar orden de los avisos
exports.actualizarOrden = async (req, res) => {
    try {
        const { avisos } = req.body;
        
        for (let i = 0; i < avisos.length; i++) {
            await db.query(
                "UPDATE tr_avisos SET orden = $1 WHERE id_aviso = $2",
                [i, avisos[i].id_aviso]
            );
        }
        
        res.json({ success: true, message: "Orden actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        res.status(500).json({ success: false, error: "Error al actualizar orden" });
    }
};