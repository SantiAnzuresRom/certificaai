const express = require('express');
const router = express.Router();
const insigniasController = require('../controllers/insigniasController');

// Crear insignia
router.post('/crear', insigniasController.crearInsignia);

// Obtener todas las insignias
router.get('/', insigniasController.obtenerInsignias);

// Otorgar insignia a un estudiante
router.post('/otorgar', insigniasController.otorgarInsignia);

// Obtener insignias de un estudiante
router.get('/estudiante/:id_estudiante', insigniasController.obtenerInsigniasEstudiante);

module.exports = router;
