const db = require("../connection");


exports.obtenerEstadisticas = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let queryStats = {};
        
        // ============================================
        // ADMIN: estadísticas generales
        // ============================================
        if (userRole === 'admin') {
            // Total de usuarios por rol
            const usuariosPorRol = await db.query(`
                SELECT r.nombre_rol, COUNT(u.id_user) as total
                FROM tr_user u
                JOIN tr_roles r ON u.id_rol = r.id_rol
                GROUP BY r.nombre_rol
            `);
            
            // Total de citas por estado
            const citasPorEstado = await db.query(`
                SELECT estado, COUNT(*) as total
                FROM tr_citas
                GROUP BY estado
            `);
            
            // Total de inscripciones
            const totalInscripciones = await db.query(`
                SELECT COUNT(*) as total FROM tr_citas_inscritos
            `);
            
            // Citas por mes (últimos 6 meses)
            const citasPorMes = await db.query(`
                SELECT 
                    TO_CHAR(fecha, 'YYYY-MM') as mes,
                    COUNT(*) as total
                FROM tr_citas
                WHERE fecha >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR(fecha, 'YYYY-MM')
                ORDER BY mes DESC
            `);
            
            // Top 5 materias con más citas
            const topMaterias = await db.query(`
                SELECT materia, COUNT(*) as total
                FROM tr_citas
                GROUP BY materia
                ORDER BY total DESC
                LIMIT 5
            `);
            
            // Top 5 tutores con más citas
            const topTutores = await db.query(`
                SELECT tutor_nombre, COUNT(*) as total
                FROM tr_citas
                GROUP BY tutor_nombre
                ORDER BY total DESC
                LIMIT 5
            `);
            
            // Usuarios activos vs inactivos
            const usuariosActivos = await db.query(`
                SELECT 
                    COUNT(CASE WHEN activo = true THEN 1 END) as activos,
                    COUNT(CASE WHEN activo = false THEN 1 END) as inactivos
                FROM tr_user
            `);
            
            queryStats = {
                usuariosPorRol: usuariosPorRol.rows,
                citasPorEstado: citasPorEstado.rows,
                totalInscripciones: totalInscripciones.rows[0].total,
                citasPorMes: citasPorMes.rows,
                topMaterias: topMaterias.rows,
                topTutores: topTutores.rows,
                usuariosActivos: usuariosActivos.rows[0]
            };
        }
        
        // ============================================
        // TUTOR: estadísticas de sus citas
        // ============================================
        else if (userRole === 'tutor') {
            // Total de citas creadas por el tutor
            const totalCitas = await db.query(`
                SELECT COUNT(*) as total FROM tr_citas WHERE id_creador = $1
            `, [userId]);
            
            // Citas activas vs completadas
            const citasPorEstado = await db.query(`
                SELECT estado, COUNT(*) as total
                FROM tr_citas
                WHERE id_creador = $1
                GROUP BY estado
            `, [userId]);
            
            // Total de alumnos inscritos a sus citas
            const totalAlumnos = await db.query(`
                SELECT COUNT(DISTINCT ci.id_usuario) as total
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE c.id_creador = $1
            `, [userId]);
            
            // Citas por mes (últimos 6 meses)
            const citasPorMes = await db.query(`
                SELECT 
                    TO_CHAR(fecha, 'YYYY-MM') as mes,
                    COUNT(*) as total
                FROM tr_citas
                WHERE id_creador = $1 AND fecha >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR(fecha, 'YYYY-MM')
                ORDER BY mes DESC
            `, [userId]);
            
            // Top materias que más da
            const topMaterias = await db.query(`
                SELECT materia, COUNT(*) as total
                FROM tr_citas
                WHERE id_creador = $1
                GROUP BY materia
                ORDER BY total DESC
                LIMIT 5
            `, [userId]);
            
            // Inscripciones por cita
            const inscripcionesPorCita = await db.query(`
                SELECT c.materia, c.fecha, COUNT(ci.id_usuario) as inscritos, c.capacidad
                FROM tr_citas c
                LEFT JOIN tr_citas_inscritos ci ON c.id_cita = ci.id_cita
                WHERE c.id_creador = $1
                GROUP BY c.id_cita, c.materia, c.fecha, c.capacidad
                ORDER BY c.fecha DESC
                LIMIT 10
            `, [userId]);
            
            queryStats = {
                totalCitas: totalCitas.rows[0].total,
                citasPorEstado: citasPorEstado.rows,
                totalAlumnos: totalAlumnos.rows[0].total,
                citasPorMes: citasPorMes.rows,
                topMaterias: topMaterias.rows,
                inscripcionesPorCita: inscripcionesPorCita.rows
            };
        }
        
        // ============================================
        // TUTORADO: estadísticas de sus inscripciones
        // ============================================
        else if (userRole === 'tutorado') {
            // Total de citas en las que está inscrito
            const totalInscripciones = await db.query(`
                SELECT COUNT(*) as total
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE ci.id_usuario = $1
            `, [userId]);
            
            // Citas completadas vs pendientes
            const citasPorEstado = await db.query(`
                SELECT c.estado, COUNT(*) as total
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE ci.id_usuario = $1
                GROUP BY c.estado
            `, [userId]);
            
            // Materias que más ha tomado
            const topMaterias = await db.query(`
                SELECT c.materia, COUNT(*) as total
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE ci.id_usuario = $1
                GROUP BY c.materia
                ORDER BY total DESC
                LIMIT 5
            `, [userId]);
            
            // Tutores que más le han dado clases
            const topTutores = await db.query(`
                SELECT c.tutor_nombre, COUNT(*) as total
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE ci.id_usuario = $1
                GROUP BY c.tutor_nombre
                ORDER BY total DESC
                LIMIT 5
            `, [userId]);
            
            // Próximas citas
            const proximasCitas = await db.query(`
                SELECT c.materia, c.tutor_nombre, c.fecha, c.hora, c.lugar
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE ci.id_usuario = $1 AND c.fecha >= CURRENT_DATE
                ORDER BY c.fecha ASC
                LIMIT 5
            `, [userId]);
            
            // Historial de citas pasadas
            const historialCitas = await db.query(`
                SELECT c.materia, c.tutor_nombre, c.fecha, c.hora, c.lugar, c.estado
                FROM tr_citas_inscritos ci
                JOIN tr_citas c ON ci.id_cita = c.id_cita
                WHERE ci.id_usuario = $1 AND c.fecha < CURRENT_DATE
                ORDER BY c.fecha DESC
                LIMIT 10
            `, [userId]);
            
            queryStats = {
                totalInscripciones: totalInscripciones.rows[0].total,
                citasPorEstado: citasPorEstado.rows,
                topMaterias: topMaterias.rows,
                topTutores: topTutores.rows,
                proximasCitas: proximasCitas.rows,
                historialCitas: historialCitas.rows
            };
        }
        
        res.json({ success: true, stats: queryStats, userRole });
        
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ success: false, error: "Error al obtener estadísticas" });
    }
};