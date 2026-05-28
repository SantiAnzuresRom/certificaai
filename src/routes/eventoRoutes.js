const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear evento
router.post('/', authenticateJWT, eventoController.crearEvento);

// Obtener todos los eventos
router.get('/', authenticateJWT, eventoController.obtenerEventos);

// Obtener eventos por clase
router.get('/clase/:idClase', authenticateJWT, eventoController.obtenerEventosPorClase);

// Obtener evento por ID
router.get('/:id', authenticateJWT, eventoController.obtenerEventoPorId);

// Editar evento
router.put('/:id', authenticateJWT, eventoController.editarEvento);

// Eliminar evento
router.delete('/:id', authenticateJWT, eventoController.eliminarEvento);

router.get('/creador/:idCreador', authenticateJWT, eventoController.obtenerEventosPorCreador);


module.exports = router;
