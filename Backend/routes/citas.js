const express = require('express');
const router = express.Router();
const controller = require('../controllers/citasController');
const { verifyToken, requireRole } = require('../middlewares/roleAuth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas generales
router.get('/', controller.obtenerCitas);
router.post('/', requireRole(['admin', 'tutor', 'tutorado']), controller.crearCita);
router.put('/:id', requireRole(['admin', 'tutor', 'tutorado']), controller.editarCita);
router.delete('/:id', requireRole(['admin', 'tutor', 'tutorado']), controller.eliminarCita);
router.post('/:id/inscribirse', requireRole(['alumno', 'tutorado']), controller.inscribirseCita);
router.get('/mis-citas', controller.misCitas);
router.put('/:id/lugar', requireRole(['admin']), controller.asignarLugar);

module.exports = router;