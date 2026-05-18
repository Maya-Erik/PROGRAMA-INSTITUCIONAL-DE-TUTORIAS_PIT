const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionesController');
const { verifyToken } = require('../middlewares/roleAuth');

// Las rutas requieren autenticación
router.use(verifyToken);

router.get('/', notificacionesController.obtenerNotificaciones);
router.put('/:id/leida', notificacionesController.marcarLeida);
router.put('/todas/leidas', notificacionesController.marcarTodasLeidas);
router.delete('/:id', notificacionesController.eliminarNotificacion);

module.exports = router;