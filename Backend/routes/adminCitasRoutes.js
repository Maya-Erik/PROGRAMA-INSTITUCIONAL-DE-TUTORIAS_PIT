
const express = require('express');
const router = express.Router();
const adminCitasController = require('../controllers/adminCitasController');
const { verifyToken, requireRole } = require('../middlewares/roleAuth');

// Todas las rutas requieren admin
router.use(verifyToken);
router.use(requireRole(['admin']));

router.get('/', adminCitasController.obtenerCitas);
router.post('/', adminCitasController.crearCita);
router.put('/:id', adminCitasController.actualizarCita);
router.delete('/:id', adminCitasController.eliminarCita);
router.put('/:id/lugar', adminCitasController.asignarLugar);

module.exports = router;