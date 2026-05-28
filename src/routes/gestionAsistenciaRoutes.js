// routes/gestionAsistenciaRoutes.js
const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/gestionAsistenciaController');

// POST - Crear nueva asistencia
router.post('/', asistenciaController.crearAsistencia);

// GET - Obtener todas las asistencias
router.get('/', asistenciaController.obtenerTodas);

// GET - Asistencias por clase
router.get('/clase/:idClase', asistenciaController.obtenerPorClase);

// GET - Asistencias por estudiante
router.get('/estudiante/:idEstudiante', asistenciaController.obtenerPorEstudiante);

// PUT - Editar asistencia por ID
router.put('/:id', asistenciaController.editarAsistencia);

module.exports = router;