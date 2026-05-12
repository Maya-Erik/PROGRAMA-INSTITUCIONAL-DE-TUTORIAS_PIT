const db = require("../connection");

exports.obtenerCitas = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, u.nombre_completo as creador_nombre
            FROM tr_citas c
            LEFT JOIN tr_user u ON c.id_creador = u.id_user
            ORDER BY c.fecha DESC, c.hora DESC
        `);
        res.json({ success: true, citas: result.rows });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: "Error al obtener citas" });
    }
};

exports.crearCita = async (req, res) => {
    try {
        const { materia, tutor_nombre, fecha, hora, capacidad, tipo, carrera } = req.body;
        const userId = req.user.id;
        
        const result = await db.query(`
            INSERT INTO tr_citas (materia, tutor_nombre, fecha, hora, capacidad, tipo, carrera, id_creador)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [materia, tutor_nombre, fecha, hora, capacidad || 20, tipo || 'grupal', carrera, userId]);
        
        res.json({ success: true, cita: result.rows[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.actualizarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { materia, tutor_nombre, fecha, hora, capacidad, tipo, carrera, lugar } = req.body;
        
        const result = await db.query(`
            UPDATE tr_citas 
            SET materia = $1, tutor_nombre = $2, fecha = $3, hora = $4, 
                capacidad = $5, tipo = $6, carrera = $7, lugar = $8
            WHERE id_cita = $9
            RETURNING *
        `, [materia, tutor_nombre, fecha, hora, capacidad, tipo, carrera, lugar, id]);
        
        res.json({ success: true, cita: result.rows[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query("DELETE FROM tr_citas_inscritos WHERE id_cita = $1", [id]);
        await db.query("DELETE FROM tr_citas WHERE id_cita = $1", [id]);
        
        res.json({ success: true, message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.asignarLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { lugar } = req.body;
        
        const result = await db.query(`
            UPDATE tr_citas SET lugar = $1 WHERE id_cita = $2 RETURNING *
        `, [lugar, id]);
        
        res.json({ success: true, cita: result.rows[0] });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};