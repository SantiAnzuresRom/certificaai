const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Subir entrega
router.post('/', authenticateJWT, entregaController.subirEntrega);

// Obtener todas las entregas
router.get('/', authenticateJWT, entregaController.obtenerTodasEntregas);

// Obtener entregas por estudiante
router.get('/estudiante/:idEstudiante', authenticateJWT, entregaController.obtenerPorEstudiante);

// Obtener entregas por asignación
router.get('/asignacion/:idAsignacion', authenticateJWT, entregaController.obtenerPorAsignacion);

// Obtener entregas por clase
router.get('/clase/:idClase', entregaController.obtenerPorClase);

// Obtener entregas por clase y asignación
router.get('/clase/:idClase/asignacion/:idAsignacion', entregaController.obtenerPorClaseYAsignacion);

// Resumen de entregas por clase
router.get('/resumen/clase/:idClase', entregaController.obtenerResumenEntregasPorClase);


// Eliminar entrega (opcional)
router.delete('/:id', authenticateJWT, entregaController.eliminarEntrega);

// Actualizar URL de entrega
router.put('/:id', authenticateJWT, entregaController.actualizarUrlEntrega);

module.exports = router;
