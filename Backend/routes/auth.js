const express = require("express");
const router = express.Router();

const { 
    login, 
    register, 
    updateUserRole, 
    getAllUsers, 
    getAvailableRoles,
    getEstadisticas   // ← Asegurar que está importado
} = require("../controllers/authController");

const { verifyToken, requireRole } = require("../middlewares/roleAuth");

// Verificar que las funciones existen
console.log('Funciones importadas:', { login, register, getEstadisticas });

// Rutas públicas
router.post("/login", login);
router.post("/register", register);

// Ruta para estadísticas (pública)
if (getEstadisticas) {
    router.get("/estadisticas", getEstadisticas);
} else {
    console.error('getEstadisticas no está definida');
}

// Rutas protegidas (solo admin)
router.get("/users", verifyToken, requireRole(['admin']), getAllUsers);
router.get("/roles", verifyToken, requireRole(['admin']), getAvailableRoles);
router.put("/user-role", verifyToken, requireRole(['admin']), updateUserRole);

module.exports = router;