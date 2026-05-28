const express = require('express');
const router = express.Router();
const participacionController = require('../controllers/participacionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Crear participación
router.post('/', authenticateJWT, participacionController.postParticipacion);

// Obtener participaciones por clase
router.get('/clase/:idClase', authenticateJWT, participacionController.getParticipacionesPorClase);

// Obtener participaciones por estudiante
router.get('/estudiante/:idEstudiante', authenticateJWT, participacionController.getParticipacionesPorEstudiante);

// Actualizar participación
router.put('/:id', authenticateJWT, participacionController.putParticipacion);

// (Opcional) Eliminar participación
// router.delete('/:id', authenticateJWT, participacionController.deleteParticipacion);

module.exports = router;
