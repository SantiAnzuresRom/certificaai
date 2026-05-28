const express = require('express');
const router = express.Router();
const recompensaController = require('../controllers/recompensaController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear recompensa
router.post('/', authenticateJWT, recompensaController.crearRecompensa);

// Obtener todas las recompensas
router.get('/', authenticateJWT, recompensaController.obtenerRecompensas);

// Obtener una por ID
router.get('/:id', authenticateJWT, recompensaController.obtenerRecompensaPorId);

// Editar recompensa
router.put('/:id', authenticateJWT, recompensaController.editarRecompensa);

// Eliminar (opcional: marcar como inactiva)
router.delete('/:id', authenticateJWT, recompensaController.eliminarRecompensa);

module.exports = router;
