const db = require("../connection");
const bcrypt = require("bcrypt");

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.id_user, u.n_cuenta, u.correo, u.nombre_completo, u.carrera, u.activo,
                   r.id_rol, r.nombre_rol as rol, r.descripcion
            FROM tr_user u
            JOIN tr_roles r ON u.id_rol = r.id_rol
            ORDER BY u.id_user
        `);
        res.json({ success: true, usuarios: result.rows });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ success: false, error: "Error al obtener usuarios" });
    }
};

// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT u.id_user, u.n_cuenta, u.correo, u.nombre_completo, u.carrera, u.activo,
                   r.id_rol, r.nombre_rol as rol
            FROM tr_user u
            JOIN tr_roles r ON u.id_rol = r.id_rol
            WHERE u.id_user = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }
        
        res.json({ success: true, usuario: result.rows[0] });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ success: false, error: "Error al obtener usuario" });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, carrera, id_rol } = req.body;
        
        const result = await db.query(`
            UPDATE tr_user 
            SET nombre_completo = $1, carrera = $2, id_rol = $3, updated_at = NOW()
            WHERE id_user = $4
            RETURNING *
        `, [nombre_completo, carrera, id_rol, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }
        
        res.json({ success: true, usuario: result.rows[0], message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ success: false, error: "Error al actualizar usuario" });
    }
};

// Cambiar estado del usuario (activo/inactivo)
exports.cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        
        const result = await db.query(`
            UPDATE tr_user 
            SET activo = $1, updated_at = NOW()
            WHERE id_user = $2
            RETURNING *
        `, [activo, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }
        
        res.json({ 
            success: true, 
            usuario: result.rows[0], 
            message: activo ? "Usuario activado correctamente" : "Usuario desactivado correctamente" 
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ success: false, error: "Error al cambiar estado" });
    }
};

// Cambiar rol del usuario
exports.cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_rol } = req.body;
        
        const result = await db.query(`
            UPDATE tr_user 
            SET id_rol = $1, updated_at = NOW()
            WHERE id_user = $2
            RETURNING *
        `, [id_rol, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }
        
        res.json({ success: true, usuario: result.rows[0], message: "Rol actualizado correctamente" });
    } catch (error) {
        console.error("Error al cambiar rol:", error);
        res.status(500).json({ success: false, error: "Error al cambiar rol" });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que no sea el propio admin
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({ success: false, error: "No puedes eliminar tu propio usuario" });
        }
        
        // Eliminar inscripciones primero
        await db.query("DELETE FROM tr_citas_inscritos WHERE id_usuario = $1", [id]);
        // Eliminar citas creadas por el usuario
        await db.query("UPDATE tr_citas SET id_creador = NULL WHERE id_creador = $1", [id]);
        // Eliminar usuario
        await db.query("DELETE FROM tr_user WHERE id_user = $1", [id]);
        
        res.json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ success: false, error: "Error al eliminar usuario" });
    }
};

// Obtener roles disponibles
exports.obtenerRoles = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id_rol, nombre_rol, descripcion 
            FROM tr_roles 
            ORDER BY id_rol
        `);
        res.json({ success: true, roles: result.rows });
    } catch (error) {
        console.error("Error al obtener roles:", error);
        res.status(500).json({ success: false, error: "Error al obtener roles" });
    }
};