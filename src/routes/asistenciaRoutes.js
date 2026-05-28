const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// POST - Registrar asistencia
router.post('/', authenticateJWT, asistenciaController.postAsistencia);

// GET - Asistencias por clase
router.get('/clase/:id_clase', authenticateJWT, asistenciaController.getAsistenciasPorClase);

// GET - Asistencias por estudiante
router.get('/estudiante/:id_estudiante', authenticateJWT, asistenciaController.getAsistenciasPorEstudiante);

// GET - Asistencias de un estudiante en una clase
router.get('/clase/:id_clase/estudiante/:id_estudiante', authenticateJWT, asistenciaController.getAsistenciasPorEstudianteEnClase);

// PUT - Actualizar asistencia (ej. justificar)
router.put('/:id_asistencia', authenticateJWT, asistenciaController.putAsistencia);

// GET - Resumen por clase
router.get('/clase/:id_clase/resumen', authenticateJWT, asistenciaController.getResumenPorClase);

module.exports = router;
