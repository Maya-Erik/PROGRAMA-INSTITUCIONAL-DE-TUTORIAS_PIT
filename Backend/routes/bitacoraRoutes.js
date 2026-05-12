const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');
const { verifyToken, requireRole } = require('../middlewares/roleAuth');

// Todas las rutas requieren autenticacion
router.use(verifyToken);

// Rutas para notas de una cita especifica
router.get('/cita/:id_cita', bitacoraController.obtenerNotasPorCita);
router.post('/cita/:id_cita', bitacoraController.agregarNota);

// Rutas para editar/eliminar notas especificas
router.put('/:id_bitacora', bitacoraController.editarNota);
router.delete('/:id_bitacora', bitacoraController.eliminarNota);

// Admin puede ver todas las notas
router.get('/todas', requireRole(['admin']), bitacoraController.obtenerTodasNotas);

module.exports = router;