const express = require('express');
const router = express.Router();
const asistenciaEventoController = require('../controllers/asistenciaEventoController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.post('/', authenticateJWT, asistenciaEventoController.registrarAsistencia);

router.get('/evento/:idEvento', authenticateJWT, asistenciaEventoController.obtenerPorEvento);

router.get('/usuario/:idUsuario', authenticateJWT, asistenciaEventoController.obtenerPorUsuario);

module.exports = router;
