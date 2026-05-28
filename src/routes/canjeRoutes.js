const express = require('express');
const router = express.Router();
const canjeController = require('../controllers/canjeController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Comprar recompensa
router.post('/', authenticateJWT, canjeController.comprarRecompensa);

// Actualizar estado del canje
router.put('/:id', authenticateJWT, canjeController.actualizarEstadoCanje);

// Obtener todos los canjes
router.get('/', authenticateJWT, canjeController.obtenerTodosLosCanjes);

// Obtener canjes por usuario
router.get('/usuario/:idUsuario', authenticateJWT, canjeController.obtenerCanjesPorUsuario);

module.exports = router;
