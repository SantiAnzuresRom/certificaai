const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Registrar calificación
router.post('/', authenticateJWT, calificacionController.crearCalificacion);

// Obtener todas
router.get('/', authenticateJWT, calificacionController.obtenerTodas);

// Obtener por estudiante
router.get('/estudiante/:idEstudiante', authenticateJWT, calificacionController.obtenerPorEstudiante);

// Obtener por asignación
router.get('/asignacion/:idAsignacion', authenticateJWT, calificacionController.obtenerPorAsignacion);

// Actualizar calificación
router.put('/:id', authenticateJWT, calificacionController.actualizarCalificacion);

// Eliminar calificación 
router.delete('/:id', authenticateJWT, calificacionController.eliminarCalificacion);

module.exports = router;
