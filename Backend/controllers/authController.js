const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Controlador para el endpoint de inicio de sesión (Login)
 */
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
            SELECT u.id_user, u.correo, u.password, u.n_cuenta, r.nombre_rol AS role_name
            FROM tr_user u
            INNER JOIN tr_roles r ON u.id_rol = r.id_rol
            WHERE u.correo = $1
        `;

        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado. Verifique su correo electrónico."
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

        const tokenPayload = {
            id: user.id_user,
            email: user.correo,
            role: user.role_name,
            n_cuenta: user.n_cuenta
        };

        const secretKey = process.env.JWT_SECRET || 'llave_secreta_desarrollo_pit';
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '8h' });

        return res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso.",
            token: token,
            role: user.role_name,
            email: user.correo,
            n_cuenta: user.n_cuenta
        });

    } catch (error) {
        console.error("Error en el proceso de login:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor."
        });
    }
};

/**
 * Endpoint de Registro - Actualizado para guardar en Supabase/PostgreSQL
 */
const register = async (req, res) => {
    const { n_cuenta, email, password, nombre_completo, carrera, id_rol = 3 } = req.body;

    // Validaciones
    if (!n_cuenta || !email || !password || !nombre_completo) {
        return res.status(400).json({
            success: false,
            message: "Número de cuenta, correo, nombre completo y contraseña son obligatorios."
        });
    }

    // Validar formato del correo institucional
    const emailRegex = /^[0-9._-]+@pcpuma\.acatlan\.unam\.mx$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Debes usar un correo institucional válido (@pcpuma.acatlan.unam.mx)"
        });
    }

    // Validar número de cuenta (debe ser numérico)
    const cuentaRegex = /^\d+$/;
    if (!cuentaRegex.test(n_cuenta)) {
        return res.status(400).json({
            success: false,
            message: "El número de cuenta debe contener solo dígitos"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "La contraseña debe tener al menos 6 caracteres"
        });
    }

    try {
        // Verificar si el usuario ya existe por correo o número de cuenta
        const checkQuery = `
            SELECT id_user, correo, n_cuenta 
            FROM tr_user 
            WHERE correo = $1 OR n_cuenta = $2
        `;
        const checkResult = await db.query(checkQuery, [email, n_cuenta]);
        
        if (checkResult.rows.length > 0) {
            const existingUser = checkResult.rows[0];
            if (existingUser.correo === email) {
                return res.status(400).json({
                    success: false,
                    message: "El correo ya está registrado."
                });
            }
            if (existingUser.n_cuenta === n_cuenta) {
                return res.status(400).json({
                    success: false,
                    message: "El número de cuenta ya está registrado."
                });
            }
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario
        const insertQuery = `
            INSERT INTO tr_user (n_cuenta, correo, password, id_rol, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id_user, correo, n_cuenta
        `;
        const result = await db.query(insertQuery, [n_cuenta, email, hashedPassword, id_rol]);

        // Si quieres guardar también la carrera y nombre completo, necesitas tablas adicionales
        // Por ahora guardamos los datos básicos

        return res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            usuario: {
                id: result.rows[0].id_user,
                email: result.rows[0].correo,
                n_cuenta: result.rows[0].n_cuenta
            }
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor. Verifica que las tablas existan en Supabase."
        });
    }
};

module.exports = {
    login,
    register
};