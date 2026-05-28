const express = require('express');
const router = express.Router();
const gestionParticipacionController = require('../controllers/gestionParticipacionController');

// GET todas
router.get('/', gestionParticipacionController.obtenerTodasParticipaciones);

// GET por clase
router.get('/clase/:idClase', gestionParticipacionController.obtenerParticipacionesPorClase);

// GET por estudiante
router.get('/estudiante/:idEstudiante', gestionParticipacionController.obtenerParticipacionesPorEstudiante);

// POST nueva participación
router.post('/', gestionParticipacionController.crearParticipacion);

// PUT editar participación por ID
router.put('/:id', gestionParticipacionController.editarParticipacion);

module.exports = router;
