const express = require("express");
const router = express.Router();

const { 
    login, 
    register, 
    updateUserRole, 
    getAllUsers, 
    getAvailableRoles,
    getEstadisticas,
    getPerfil,
    updatePerfil
} = require("../controllers/authController");

const { verifyToken, requireRole } = require("../middlewares/roleAuth");

// Rutas públicas
router.post("/login", login);
router.post("/register", register);
router.get("/estadisticas", getEstadisticas);

// Rutas de perfil (protegidas)
router.get("/perfil", verifyToken, getPerfil);
router.put("/perfil", verifyToken, updatePerfil);

// Rutas protegidas (solo admin)
router.get("/users", verifyToken, requireRole(['admin']), getAllUsers);
router.get("/roles", verifyToken, requireRole(['admin']), getAvailableRoles);
router.put("/user-role", verifyToken, requireRole(['admin']), updateUserRole);

module.exports = router;