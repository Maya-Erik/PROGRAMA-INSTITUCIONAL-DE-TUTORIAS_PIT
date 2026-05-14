const db = require("../connection");
const { Parser } = require('json2csv');

// Obtener citas del usuario (tutor o tutorado)
exports.obtenerCitasUsuario = async (req, res) => {
    try {
        const userId = req.user.id;
        
        let query = `
            SELECT c.id_cita, c.materia, c.tutor_nombre, c.fecha, c.hora, c.lugar,
                   (SELECT COUNT(*) FROM tr_citas_inscritos ci WHERE ci.id_cita = c.id_cita) as inscritos
            FROM tr_citas c
            WHERE c.id_creador = $1
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

// Agregar nota general y personales con nuevos campos
exports.agregarNotaCompleta = async (req, res) => {
    try {
        const { id_cita, nota_general, notas_personales, tipo_tutoria, canalizado } = req.body;
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
        
        // Insertar nota general con nuevos campos
        const result = await db.query(`
            INSERT INTO tr_bitacora (id_cita, id_usuario, nota, tipo_nota, tipo_tutoria, canalizado, fecha)
            VALUES ($1, $2, $3, 'general', $4, $5, NOW())
            RETURNING *
        `, [id_cita, userId, nota_general, tipo_tutoria, canalizado]);
        
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
        const userRole = req.user.role;
        const userId = req.user.id;
        
        let query = `
            SELECT b.id_bitacora, b.id_cita, b.id_usuario, b.nota, b.fecha, b.tipo_tutoria, b.canalizado,
                   u.nombre_completo as usuario_nombre,
                   c.materia, c.tutor_nombre, c.fecha as cita_fecha, c.hora
            FROM tr_bitacora b
            LEFT JOIN tr_user u ON b.id_usuario = u.id_user
            LEFT JOIN tr_citas c ON b.id_cita = c.id_cita
            WHERE b.tipo_nota = 'general'
        `;
        
        // Si no es admin, solo ver sus propias notas
        if (userRole !== 'admin') {
            query += ` AND (b.id_usuario = ${userId} OR c.id_creador = ${userId})`;
        }
        
        query += ` ORDER BY b.fecha DESC`;
        
        const notasGenerales = await db.query(query);
        
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

// Exportar bitacora a CSV
exports.exportarBitacora = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, citas_ids } = req.body;
        const userRole = req.user.role;
        const userId = req.user.id;
        
        let query = `
            SELECT 
                b.fecha as fecha_registro,
                c.materia as tema,
                c.tutor_nombre as tutor,
                c.fecha as fecha_cita,
                c.hora as hora_cita,
                b.tipo_tutoria as tipo_tutoria,
                b.canalizado as alumno_canalizado,
                b.nota as nota_general,
                u.nombre_completo as registrado_por
            FROM tr_bitacora b
            LEFT JOIN tr_citas c ON b.id_cita = c.id_cita
            LEFT JOIN tr_user u ON b.id_usuario = u.id_user
            WHERE b.tipo_nota = 'general'
        `;
        
        const params = [];
        let paramCount = 1;
        
        // Filtrar por fechas
        if (fecha_inicio && fecha_fin) {
            query += ` AND b.fecha BETWEEN $${paramCount} AND $${paramCount + 1}`;
            params.push(fecha_inicio, fecha_fin);
            paramCount += 2;
        }
        
        // Filtrar por citas seleccionadas
        if (citas_ids && citas_ids.length > 0) {
            const placeholders = citas_ids.map((_, i) => `$${paramCount + i}`).join(',');
            query += ` AND b.id_cita IN (${placeholders})`;
            params.push(...citas_ids);
            paramCount += citas_ids.length;
        }
        
        // Si no es admin, solo ver sus propias notas
        if (userRole !== 'admin') {
            query += ` AND (b.id_usuario = $${paramCount} OR c.id_creador = $${paramCount})`;
            params.push(userId);
        }
        
        query += ` ORDER BY b.fecha DESC`;
        
        const result = await db.query(query, params);
        
        // Convertir a CSV
        const fields = ['fecha_registro', 'tema', 'tutor', 'fecha_cita', 'hora_cita', 'tipo_tutoria', 'alumno_canalizado', 'nota_general', 'registrado_por'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(result.rows);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bitacora.csv');
        res.send(csv);
    } catch (error) {
        console.error("Error al exportar bitacora:", error);
        res.status(500).json({ success: false, error: "Error al exportar bitacora" });
    }
};