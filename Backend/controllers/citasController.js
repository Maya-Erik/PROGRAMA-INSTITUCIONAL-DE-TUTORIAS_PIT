const db = require("../connection");

// Obtener citas según rol y carrera del usuario
exports.obtenerCitas = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const userCarrera = req.user.carrera;
        
        let query = `
            SELECT c.id_cita, c.materia, c.tutor_nombre, c.fecha, c.hora, 
                   c.lugar, c.capacidad, c.inscritos, c.tipo, c.estado,
                   u.nombre_completo as creador_nombre
            FROM tr_citas c
            LEFT JOIN tr_user u ON c.id_creador = u.id_user
            WHERE 1=1
        `;
        
        // Alumno solo ve citas disponibles de su carrera
        if (userRole === 'alumno') {
            query += ` AND c.carrera = '${userCarrera}' AND c.estado = 'disponible'`;
        }
        // Tutor y Tutorado ven todas las citas
        else if (userRole === 'tutor' || userRole === 'tutorado') {
            query += ` AND (c.estado = 'disponible' OR c.id_creador = ${userId})`;
        }
        // Admin ve todo
        else if (userRole === 'admin') {
            
        }
        
        query += ` ORDER BY c.fecha DESC, c.hora DESC`;
        
        const result = await db.query(query);
        res.json({ success: true, citas: result.rows });
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ success: false, error: "Error al obtener citas" });
    }
};

// Crear cita (solo tutor, tutorado y admin)
exports.crearCita = async (req, res) => {
    try {
        const { materia, tutor_nombre, fecha, hora, capacidad, tipo, carrera } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        // Validar permisos
        if (!['admin', 'tutor', 'tutorado'].includes(userRole)) {
            return res.status(403).json({ success: false, error: "No tienes permisos para crear citas" });
        }
        
        const query = `
            INSERT INTO tr_citas (materia, tutor_nombre, fecha, hora, capacidad, inscritos, tipo, carrera, id_creador, estado, lugar)
            VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8, 'disponible', 'Salón sujeto a disponibilidad')
            RETURNING *
        `;
        
        const result = await db.query(query, [materia, tutor_nombre, fecha, hora, capacidad, tipo, carrera, userId]);
        res.json({ success: true, cita: result.rows[0] });
    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ success: false, error: "Error al crear cita" });
    }
};

// Editar cita (solo creador o admin)
exports.editarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { materia, tutor_nombre, fecha, hora, capacidad, tipo } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        // Verificar si es creador o admin
        const checkQuery = `SELECT id_creador FROM tr_citas WHERE id_cita = $1`;
        const checkResult = await db.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Cita no encontrada" });
        }
        
        if (checkResult.rows[0].id_creador !== userId && userRole !== 'admin') {
            return res.status(403).json({ success: false, error: "No tienes permisos para editar esta cita" });
        }
        
        const query = `
            UPDATE tr_citas 
            SET materia = $1, tutor_nombre = $2, fecha = $3, hora = $4, capacidad = $5, tipo = $6
            WHERE id_cita = $7
            RETURNING *
        `;
        
        const result = await db.query(query, [materia, tutor_nombre, fecha, hora, capacidad, tipo, id]);
        res.json({ success: true, cita: result.rows[0] });
    } catch (error) {
        console.error("Error al editar cita:", error);
        res.status(500).json({ success: false, error: "Error al editar cita" });
    }
};

// Eliminar cita (solo creador o admin)
exports.eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        const checkQuery = `SELECT id_creador FROM tr_citas WHERE id_cita = $1`;
        const checkResult = await db.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Cita no encontrada" });
        }
        
        if (checkResult.rows[0].id_creador !== userId && userRole !== 'admin') {
            return res.status(403).json({ success: false, error: "No tienes permisos para eliminar esta cita" });
        }
        
        await db.query(`DELETE FROM tr_citas WHERE id_cita = $1`, [id]);
        res.json({ success: true, message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar cita:", error);
        res.status(500).json({ success: false, error: "Error al eliminar cita" });
    }
};

// Inscribirse a cita (solo alumnos o tutorados)
exports.inscribirseCita = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        // Solo alumnos o tutorados pueden inscribirse
        if (!['alumno', 'tutorado'].includes(userRole)) {
            return res.status(403).json({ success: false, error: "No tienes permisos para inscribirte" });
        }
        
        // Verificar si ya está inscrito
        const checkInscripcion = await db.query(
            `SELECT * FROM tr_citas_inscritos WHERE id_cita = $1 AND id_usuario = $2`,
            [id, userId]
        );
        
        if (checkInscripcion.rows.length > 0) {
            return res.status(400).json({ success: false, error: "Ya estás inscrito en esta cita" });
        }
        
        // Obtener cita y verificar capacidad
        const citaQuery = await db.query(
            `SELECT capacidad, inscritos, tipo FROM tr_citas WHERE id_cita = $1`,
            [id]
        );
        
        if (citaQuery.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Cita no encontrada" });
        }
        
        const cita = citaQuery.rows[0];
        
        if (cita.inscritos >= cita.capacidad) {
            return res.status(400).json({ success: false, error: "No hay cupos disponibles" });
        }
        
        // Inscribir usuario
        await db.query(
            `INSERT INTO tr_citas_inscritos (id_cita, id_usuario) VALUES ($1, $2)`,
            [id, userId]
        );
        
        // Actualizar contador de inscritos
        await db.query(
            `UPDATE tr_citas SET inscritos = inscritos + 1 WHERE id_cita = $1`,
            [id]
        );
        
        res.json({ success: true, message: "Te has inscrito correctamente" });
    } catch (error) {
        console.error("Error al inscribirse a cita:", error);
        res.status(500).json({ success: false, error: "Error al inscribirse" });
    }
};

// Obtener citas donde el usuario está inscrito
exports.misCitas = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const query = `
            SELECT c.* FROM tr_citas c
            JOIN tr_citas_inscritos i ON c.id_cita = i.id_cita
            WHERE i.id_usuario = $1
            ORDER BY c.fecha DESC, c.hora DESC
        `;
        
        const result = await db.query(query, [userId]);
        res.json({ success: true, citas: result.rows });
    } catch (error) {
        console.error("Error al obtener mis citas:", error);
        res.status(500).json({ success: false, error: "Error al obtener mis citas" });
    }
};

// Actualizar lugar de cita (solo admin)
exports.asignarLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { lugar } = req.body;
        const userRole = req.user.role;
        
        if (userRole !== 'admin') {
            return res.status(403).json({ success: false, error: "Solo el admin puede asignar el lugar" });
        }
        
        const query = `UPDATE tr_citas SET lugar = $1 WHERE id_cita = $2 RETURNING *`;
        const result = await db.query(query, [lugar, id]);
        
        res.json({ success: true, cita: result.rows[0] });
    } catch (error) {
        console.error("Error al asignar lugar:", error);
        res.status(500).json({ success: false, error: "Error al asignar lugar" });
    }
};