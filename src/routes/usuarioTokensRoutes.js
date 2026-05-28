const express = require('express');
const router = express.Router();
const usuarioTokensController = require('../controllers/usuarioTokensController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Obtener todos los registros
router.get('/', authenticateJWT, usuarioTokensController.obtenerTodos);

// Obtener tokens por ID de usuario
router.get('/:idUsuario', authenticateJWT, usuarioTokensController.obtenerPorUsuario);

// Modificar manualmente el balance (para pruebas)
router.put('/:idUsuario', authenticateJWT, usuarioTokensController.actualizarTokens);

module.exports = router;
