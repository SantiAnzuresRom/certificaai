const express = require('express');
const router = express.Router();
const certificacionController = require('../controllers/certificacionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear certificación
router.post('/', authenticateJWT, certificacionController.crearCertificacion);

// Obtener todas
router.get('/', authenticateJWT, certificacionController.obtenerTodas);

// Obtener por usuario
router.get('/usuario/:idUsuario', authenticateJWT, certificacionController.obtenerPorUsuario);

// Obtener por ID
router.get('/:id', authenticateJWT, certificacionController.obtenerPorId);

// Editar
router.put('/:id', authenticateJWT, certificacionController.editarCertificacion);

// Eliminar
router.delete('/:id', authenticateJWT, certificacionController.eliminarCertificacion);

module.exports = router;
