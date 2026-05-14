const express = require('express');
const router = express.Router();
const controller = require('../controllers/citasController');
const { verifyToken } = require('../middlewares/roleAuth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.get('/', controller.obtenerCitas);
router.get('/mis-citas', controller.misCitas);
router.post('/:id/inscribirse', controller.inscribirseCita);

module.exports = router;