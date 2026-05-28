const express = require('express');
const router = express.Router();
const gestionRecompensas = require('../controllers/gestionRecompensasController');

// Obtener todas (activas e inactivas)
router.get('/', gestionRecompensas.obtenerTodas);

// Obtener solo activas
router.get('/activas', gestionRecompensas.obtenerActivas);

// Obtener por ID
router.get('/:id', gestionRecompensas.obtenerPorId);

// Crear
router.post('/', gestionRecompensas.crear);

// Editar
router.put('/:id', gestionRecompensas.editar);

// Activar
router.put('/activar/:id', gestionRecompensas.activar);

// Desactivar
router.put('/desactivar/:id', gestionRecompensas.desactivar);

module.exports = router;
