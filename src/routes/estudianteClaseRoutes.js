const express = require('express');
const router = express.Router();

const estudianteClaseController = require('../controllers/estudianteClaseController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// POST - Agregar estudiante a clase
router.post('/', authenticateJWT, estudianteClaseController.postEstudianteClase);

// GET - Todas las relaciones
router.get('/', authenticateJWT, estudianteClaseController.getEstudiantesClases);

// GET - Relación por ID (de la tabla intermedia)
router.get('/:id', authenticateJWT, estudianteClaseController.getEstudianteClaseById);

// GET - Clases por ID de estudiante
router.get('/estudiante/:id_estudiante', authenticateJWT, estudianteClaseController.getClasesByEstudianteId);

// GET - Estudiantes por ID de clase
router.get('/clase/:id_clase', authenticateJWT, estudianteClaseController.getEstudiantesByClaseId);

// PUT - Actualizar relación por ID
router.put('/:id', authenticateJWT, estudianteClaseController.updateEstudianteClase);

module.exports = router;
