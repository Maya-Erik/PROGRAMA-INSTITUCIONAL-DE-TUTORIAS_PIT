const express = require('express');
const router = express.Router();
const controller = require('../controllers/citasController');
const { verifyToken } = require('../middlewares/roleAuth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas
router.get('/', controller.obtenerCitas);
router.post('/', controller.crearCita);
router.put('/:id', controller.editarCita);
router.delete('/:id', controller.eliminarCita);
router.post('/:id/inscribirse', controller.inscribirseCita);
router.delete('/:id/cancelar-inscripcion', controller.cancelarInscripcionCita);
router.get('/mis-citas', controller.misCitas);
router.put('/:id/lugar', controller.asignarLugar);

module.exports = router;