const db = require("../connection");

// Obtener todas las notas de una cita
exports.obtenerNotasPorCita = async (req, res) => {
    try {
        const { id_cita } = req.params;
        
        const result = await db.query(`
            SELECT b.id_bitacora, b.id_cita, b.id_usuario, b.nota, b.fecha,
                   u.nombre_completo as usuario_nombre
            FROM tr_bitacora b
            LEFT JOIN tr_user u ON b.id_usuario = u.id_user
            WHERE b.id_cita = $1
            ORDER BY b.fecha DESC
        `, [id_cita]);
        
        res.json({ success: true, notas: result.rows });
    } catch (error) {
        console.error("Error al obtener notas:", error);
        res.status(500).json({ success: false, error: "Error al obtener notas" });
    }
};

// Agregar nota a una cita
exports.agregarNota = async (req, res) => {
    try {
        const { id_cita } = req.params;
        const { nota } = req.body;
        const userId = req.user.id;
        
        if (!nota || nota.trim() === '') {
            return res.status(400).json({ success: false, error: "La nota no puede estar vacia" });
        }
        
        // Verificar que la cita existe
        const citaCheck = await db.query(
            "SELECT id_cita FROM tr_citas WHERE id_cita = $1",
            [id_cita]
        );
        
        if (citaCheck.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Cita no encontrada" });
        }
        
        const result = await db.query(`
            INSERT INTO tr_bitacora (id_cita, id_usuario, nota, fecha)
            VALUES ($1, $2, $3, NOW())
            RETURNING *
        `, [id_cita, userId, nota]);
        
        res.json({ success: true, nota: result.rows[0], message: "Nota agregada correctamente" });
    } catch (error) {
        console.error("Error al agregar nota:", error);
        res.status(500).json({ success: false, error: "Error al agregar nota" });
    }
};

// Editar nota
exports.editarNota = async (req, res) => {
    try {
        const { id_bitacora } = req.params;
        const { nota } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        if (!nota || nota.trim() === '') {
            return res.status(400).json({ success: false, error: "La nota no puede estar vacia" });
        }
        
        // Verificar que la nota existe y pertenece al usuario (o es admin)
        let query = `
            SELECT id_bitacora, id_usuario FROM tr_bitacora 
            WHERE id_bitacora = $1
        `;
        const checkResult = await db.query(query, [id_bitacora]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Nota no encontrada" });
        }
        
        if (checkResult.rows[0].id_usuario !== userId && userRole !== 'admin') {
            return res.status(403).json({ success: false, error: "No tienes permiso para editar esta nota" });
        }
        
        const result = await db.query(`
            UPDATE tr_bitacora 
            SET nota = $1, fecha = NOW()
            WHERE id_bitacora = $2
            RETURNING *
        `, [nota, id_bitacora]);
        
        res.json({ success: true, nota: result.rows[0], message: "Nota actualizada correctamente" });
    } catch (error) {
        console.error("Error al editar nota:", error);
        res.status(500).json({ success: false, error: "Error al editar nota" });
    }
};

// Eliminar nota
exports.eliminarNota = async (req, res) => {
    try {
        const { id_bitacora } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        // Verificar que la nota existe y pertenece al usuario (o es admin)
        const checkResult = await db.query(
            "SELECT id_usuario FROM tr_bitacora WHERE id_bitacora = $1",
            [id_bitacora]
        );
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Nota no encontrada" });
        }
        
        if (checkResult.rows[0].id_usuario !== userId && userRole !== 'admin') {
            return res.status(403).json({ success: false, error: "No tienes permiso para eliminar esta nota" });
        }
        
        await db.query("DELETE FROM tr_bitacora WHERE id_bitacora = $1", [id_bitacora]);
        
        res.json({ success: true, message: "Nota eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar nota:", error);
        res.status(500).json({ success: false, error: "Error al eliminar nota" });
    }
};

// Obtener todas las notas (para admin)
exports.obtenerTodasNotas = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT b.id_bitacora, b.id_cita, b.id_usuario, b.nota, b.fecha,
                   u.nombre_completo as usuario_nombre,
                   c.materia, c.tutor_nombre, c.fecha as cita_fecha
            FROM tr_bitacora b
            LEFT JOIN tr_user u ON b.id_usuario = u.id_user
            LEFT JOIN tr_citas c ON b.id_cita = c.id_cita
            ORDER BY b.fecha DESC
        `);
        
        res.json({ success: true, notas: result.rows });
    } catch (error) {
        console.error("Error al obtener todas las notas:", error);
        res.status(500).json({ success: false, error: "Error al obtener notas" });
    }
};