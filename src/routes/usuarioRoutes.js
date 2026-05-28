const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticateJWT } = require('../middlewares/authMiddleware'); 

// GET /api/usuarios
router.get('/',  authenticateJWT, usuarioController.getUsuario);

// GET /api/usuarios/:id
router.get('/:id',  authenticateJWT, usuarioController.getUsuarioId);

// PUT /api/usuarios/:id
router.put('/:id',  authenticateJWT, usuarioController.updateUsuario);

// GET /api/usuarios/:id/clases
// router.get('/:id/clases', authMiddleware, usuarioController.getClasesEstudiante);

module.exports = router;