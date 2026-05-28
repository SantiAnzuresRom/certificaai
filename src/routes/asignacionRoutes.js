const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear asignación
router.post('/', authenticateJWT, asignacionController.crearAsignacion);

// Obtener asignaciones por clase
router.get('/clase/:idClase', authenticateJWT, asignacionController.obtenerAsignacionesPorClase);

// Obtener una asignación específica
router.get('/:id', authenticateJWT, asignacionController.obtenerAsignacionPorId);

// Editar asignación
router.put('/:id', authenticateJWT, asignacionController.editarAsignacion);

// Eliminar asignación (opcional)
router.delete('/:id', authenticateJWT, asignacionController.eliminarAsignacion);

// Obtener asignaciones por profesor
router.get('/profesor/:idProfesor', authenticateJWT, asignacionController.obtenerAsignacionesPorProfesor);

module.exports = router;
