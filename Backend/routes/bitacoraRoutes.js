const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');
const { verifyToken } = require('../middlewares/roleAuth');

router.use(verifyToken);

router.get('/mis-citas', bitacoraController.obtenerCitasUsuario);
router.get('/cita/:id_cita/inscritos', bitacoraController.obtenerInscritosPorCita);
router.post('/nota-completa', bitacoraController.agregarNotaCompleta);
router.get('/todas', bitacoraController.obtenerTodasNotasCompleto);
router.post('/exportar', bitacoraController.exportarBitacora);

module.exports = router;