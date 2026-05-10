const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "El correo electrónico y la contraseña son obligatorios."
        });
    }

    try {
        const query = `
            SELECT u.id_user, u.correo, u.password, u.n_cuenta, u.nombre_completo, 
                   r.id_rol, r.nombre_rol AS role_name
            FROM tr_user u
            INNER JOIN tr_roles r ON u.id_rol = r.id_rol
            WHERE u.correo = $1
        `;

        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado."
            });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Contraseña incorrecta."
            });
        }

        const secretKey = process.env.JWT_SECRET || 'llave_secreta_desarrollo_pit';
        const token = jwt.sign(
            { id: user.id_user, email: user.correo, role: user.role_name, id_rol: user.id_rol },
            secretKey,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso.",
            token: token,
            user: { id: user.id_user, email: user.correo, role: user.role_name, n_cuenta: user.n_cuenta }
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

const register = async (req, res) => {
    const { n_cuenta, email, password, nombre_completo, carrera, id_rol = 4 } = req.body;

    if (!n_cuenta || !email || !password || !nombre_completo) {
        return res.status(400).json({
            success: false,
            message: "Número de cuenta, correo, nombre completo y contraseña son obligatorios."
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQuery = `
            INSERT INTO tr_user (n_cuenta, correo, password, id_rol, nombre_completo, carrera, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id_user, correo, n_cuenta
        `;
        const result = await db.query(insertQuery, [n_cuenta, email, hashedPassword, id_rol, nombre_completo, carrera]);

        return res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id_user, u.n_cuenta, u.correo, u.nombre_completo, u.carrera,
                   r.id_rol, r.nombre_rol AS rol
            FROM tr_user u
            JOIN tr_roles r ON u.id_rol = r.id_rol
            ORDER BY u.id_user
        `;
        const result = await db.query(query);
        return res.status(200).json({ success: true, users: result.rows });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).json({ success: false, message: "Error al obtener usuarios" });
    }
};

const getAvailableRoles = async (req, res) => {
    try {
        const query = "SELECT id_rol, nombre_rol, descripcion FROM tr_roles ORDER BY id_rol";
        const result = await db.query(query);
        return res.status(200).json({ success: true, roles: result.rows });
    } catch (error) {
        console.error("Error al obtener roles:", error);
        return res.status(500).json({ success: false, message: "Error al obtener roles" });
    }
};

const updateUserRole = async (req, res) => {
    const { id_user, id_rol_nuevo, motivo } = req.body;

    if (!id_user || !id_rol_nuevo) {
        return res.status(400).json({ success: false, message: "ID de usuario y nuevo rol son obligatorios" });
    }

    try {
        await db.query("UPDATE tr_user SET id_rol = $1, updated_at = NOW() WHERE id_user = $2", [id_rol_nuevo, id_user]);
        return res.status(200).json({ success: true, message: "Rol actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar rol:", error);
        return res.status(500).json({ success: false, message: "Error al actualizar el rol" });
    }
};

// Obtener estadísticas de usuarios (alumnos, tutores, tutorados)
const getEstadisticas = async (req, res) => {
    try {
        // Contar alumnos (id_rol = 4)
        const alumnosQuery = await db.query(
            "SELECT COUNT(*) as total FROM tr_user WHERE id_rol = 4"
        );
        
        // Contar tutores (id_rol = 2)
        const tutoresQuery = await db.query(
            "SELECT COUNT(*) as total FROM tr_user WHERE id_rol = 2"
        );
        
        // Contar tutorados (id_rol = 3)
        const tutoradosQuery = await db.query(
            "SELECT COUNT(*) as total FROM tr_user WHERE id_rol = 3"
        );
        
        // Total de maestros = tutores + tutorados
        const totalMaestros = parseInt(tutoresQuery.rows[0].total) + parseInt(tutoradosQuery.rows[0].total);
        
        // Total de alumnos (solo id_rol = 4)
        const totalAlumnos = parseInt(alumnosQuery.rows[0].total);
        
        // Total de tutores (mostrar solo tutores, no tutorados)
        const totalTutores = parseInt(tutoresQuery.rows[0].total);
        
        return res.status(200).json({
            success: true,
            data: {
                alumnos: totalAlumnos,
                maestros: totalMaestros,
                tutores: totalTutores
            }
        });
        
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas"
        });
    }
};

module.exports = { login, register, getAllUsers, getAvailableRoles, updateUserRole };