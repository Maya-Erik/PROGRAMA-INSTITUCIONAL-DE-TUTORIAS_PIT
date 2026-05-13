const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');
const { verifyToken } = require('../middlewares/roleAuth');

router.use(verifyToken);

// Obtener citas del usuario
router.get('/mis-citas', bitacoraController.obtenerCitasUsuario);

// Obtener inscritos por cita
router.get('/cita/:id_cita/inscritos', bitacoraController.obtenerInscritosPorCita);

// Agregar nota completa (general + personales)
router.post('/nota-completa', bitacoraController.agregarNotaCompleta);

// Obtener todas las notas
router.get('/todas', bitacoraController.obtenerTodasNotasCompleto);

module.exports = router;