const express = require('express');
const router = express.Router();
const participacionesController = require('../controllers/participacionesVistaController');

//  Todas las participaciones (vista completa)
router.get('/', participacionesController.getTodasParticipaciones);

//  Participaciones por estudiante
router.get('/estudiante/:idEstudiante', participacionesController.getPorEstudiante);

//  Participaciones por clase
router.get('/clase/:idClase', participacionesController.getPorClase);

//  Participaciones de un estudiante en una clase específica
router.get('/estudiante/:idEstudiante/clase/:idClase', participacionesController.getPorEstudianteYClase);

module.exports = router;
