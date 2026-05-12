const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middlewares/roleAuth');
const userController = require('../controllers/userController');

// Todas las rutas requieren autenticacion y rol admin
router.use(verifyToken);
router.use(requireRole(['admin']));

router.get('/', userController.obtenerUsuarios);
router.get('/:id', userController.obtenerUsuarioPorId);
router.put('/:id', userController.actualizarUsuario);
router.patch('/:id/estado', userController.cambiarEstado);
router.patch('/:id/rol', userController.cambiarRol);
router.delete('/:id', userController.eliminarUsuario);
router.get('/roles/list', userController.obtenerRoles);

module.exports = router;