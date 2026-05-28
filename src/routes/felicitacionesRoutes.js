const express = require('express');
const router = express.Router();
const felicitacionesController = require('../controllers/felicitacionesController');

// Post Felicitaciones
router.post('/', felicitacionesController.crearFelicitacion);

// GET de todas las Felicitaciones
router.get('/', felicitacionesController.obtenerTodasFelicitaciones);

// GET de Felicitaciones por ID de usuario
router.get('/usuario/:idUsuario', felicitacionesController.obtenerPorUsuario);

// Obtener Felicitaciones pendientes
router.get('/pendientes', felicitacionesController.obtenerFelicitacionesPendientes);

// Editar Felicitación
router.put('/:id', felicitacionesController.editarFelicitacion);

// Actualizar Felicitación por ID
router.put('/usuario/:idUsuario', felicitacionesController.actualizarFelicitacionPorUsuario);

// Editar Felicitación por ID de usuario
router.put('/usuario/:idUsuario', felicitacionesController.editarPorUsuario);


module.exports = router;
