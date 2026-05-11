
const express = require('express');
const router = express.Router();
const avisoController = require('../controllers/avisoController');
const { verifyToken, requireRole } = require('../middlewares/roleAuth');

// Rutas publicas (para el carrusel)
router.get('/', avisoController.obtenerAvisos);

// Rutas protegidas (solo admin)
router.get('/admin', verifyToken, requireRole(['admin']), avisoController.obtenerAvisosAdmin);
router.post('/', verifyToken, requireRole(['admin']), avisoController.crearAviso);
router.put('/:id', verifyToken, requireRole(['admin']), avisoController.actualizarAviso);
router.delete('/:id', verifyToken, requireRole(['admin']), avisoController.eliminarAviso);
router.put('/orden/actualizar', verifyToken, requireRole(['admin']), avisoController.actualizarOrden);

module.exports = router;