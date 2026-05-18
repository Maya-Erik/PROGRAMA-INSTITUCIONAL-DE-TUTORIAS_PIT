const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const { verifyToken, requireRole } = require('../middlewares/roleAuth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Estadísticas - accesible para admin, tutor, tutorado
router.get('/estadisticas', requireRole(['admin', 'tutor', 'tutorado']), reportesController.obtenerEstadisticas);

module.exports = router;