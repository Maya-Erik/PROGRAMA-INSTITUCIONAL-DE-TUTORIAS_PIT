const db = require("../connection");

// Obtener citas del usuario (tutor o tutorado)
exports.obtenerCitasUsuario = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let query = `
            SELECT c.id_cita, c.materia, c.tutor_nombre, c.fecha, c.hora, c.lugar,
                   (SELECT COUNT(*) FROM tr_citas_inscritos ci WHERE ci.id_cita = c.id_cita) as inscritos
            FROM tr_citas c
            WHERE c.id_creador = $1 OR c.id_creador IN (
                SELECT id_user FROM tr_user WHERE id_rol = 2
            )
            ORDER BY c.fecha DESC, c.hora DESC
        `;
        
        const result = await db.query(query, [userId]);
        res.json({ success: true, citas: result.rows });
    } catch (error) {
        console.error("Error al obtener citas del usuario:", error);
        res.status(500).json({ success: false, error: "Error al obtener citas" });
    }
};

// Obtener inscritos de una cita
exports.obtenerInscritosPorCita = async (req, res) => {
    try {
        const { id_cita } = req.params;
        
        const result = await db.query(`
            SELECT u.id_user, u.n_cuenta, u.nombre_completo, u.carrera
            FROM tr_citas_inscritos ci
            JOIN tr_user u ON ci.id_usuario = u.id_user
            WHERE ci.id_cita = $1
        `, [id_cita]);
        
        res.json({ success: true, inscritos: result.rows });
    } catch (error) {
        console.error("Error al obtener inscritos:", error);
        res.status(500).json({ success: false, error: "Error al obtener inscritos" });
    }
};

// Agregar nota general y personales
exports.agregarNotaCompleta = async (req, res) => {
    try {
        const { id_cita, nota_general, notas_personales } = req.body;
        const userId = req.user.id;
        
        if (!id_cita) {
            return res.status(400).json({ success: false, error: "Debe seleccionar una cita" });
        }
        
        if (!nota_general || nota_general.trim() === '') {
            return res.status(400).json({ success: false, error: "La nota general es obligatoria" });
        }
        
        // Verificar que la cita existe
        const citaCheck = await db.query(
            "SELECT id_cita, materia, tutor_nombre, fecha, hora FROM tr_citas WHERE id_cita = $1",
            [id_cita]
        );
        
        if (citaCheck.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Cita no encontrada" });
        }
        
        // Insertar nota general
        const result = await db.query(`
            INSERT INTO tr_bitacora (id_cita, id_usuario, nota, tipo_nota, fecha)
            VALUES ($1, $2, $3, 'general', NOW())
            RETURNING *
        `, [id_cita, userId, nota_general]);
        
        const id_bitacora = result.rows[0].id_bitacora;
        
        // Insertar notas personales por alumno
        if (notas_personales && notas_personales.length > 0) {
            for (const np of notas_personales) {
                if (np.nota && np.nota.trim() !== '') {
                    await db.query(`
                        INSERT INTO tr_bitacora_personal (id_bitacora, id_alumno, nota)
                        VALUES ($1, $2, $3)
                    `, [id_bitacora, np.id_alumno, np.nota]);
                }
            }
        }
        
        res.json({ 
            success: true, 
            message: "Notas guardadas correctamente",
            cita: citaCheck.rows[0]
        });
    } catch (error) {
        console.error("Error al agregar notas:", error);
        res.status(500).json({ success: false, error: "Error al agregar notas" });
    }
};

// Obtener todas las notas con detalles
exports.obtenerTodasNotasCompleto = async (req, res) => {
    try {
        // Obtener notas generales
        const notasGenerales = await db.query(`
            SELECT b.id_bitacora, b.id_cita, b.id_usuario, b.nota, b.fecha,
                   u.nombre_completo as usuario_nombre,
                   c.materia, c.tutor_nombre, c.fecha as cita_fecha, c.hora
            FROM tr_bitacora b
            LEFT JOIN tr_user u ON b.id_usuario = u.id_user
            LEFT JOIN tr_citas c ON b.id_cita = c.id_cita
            WHERE b.tipo_nota = 'general'
            ORDER BY b.fecha DESC
        `);
        
        // Obtener notas personales por cada bitacora
        const notasCompletas = [];
        for (const nota of notasGenerales.rows) {
            const personales = await db.query(`
                SELECT p.id_personal, p.id_alumno, p.nota, 
                       u.n_cuenta, u.nombre_completo
                FROM tr_bitacora_personal p
                JOIN tr_user u ON p.id_alumno = u.id_user
                WHERE p.id_bitacora = $1
            `, [nota.id_bitacora]);
            
            notasCompletas.push({
                ...nota,
                notas_personales: personales.rows
            });
        }
        
        res.json({ success: true, notas: notasCompletas });
    } catch (error) {
        console.error("Error al obtener notas:", error);
        res.status(500).json({ success: false, error: "Error al obtener notas" });
    }
};