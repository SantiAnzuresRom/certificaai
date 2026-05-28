const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const { authenticateJWT } = require('../middlewares/authMiddleware'); 

// GET /api/clases
router.get('/', authenticateJWT, claseController.getClase);

// GET /api/clases/:id
router.get('/:id', authenticateJWT, claseController.getClaseId);

// POST /api/clases
router.post('/', authenticateJWT, claseController.postClase);

// PUT /api/clases/:id
router.put('/:id', authenticateJWT, claseController.putClase);

// Obtener clases por ID de profesor
router.get('/profesor/:idProfesor', authenticateJWT, claseController.getClasesPorProfesor);

// Obtener clases por ID de estudiante
router.get('/estudiante/:idEstudiante', authenticateJWT, claseController.getClasesByEstudianteId);


module.exports = router;