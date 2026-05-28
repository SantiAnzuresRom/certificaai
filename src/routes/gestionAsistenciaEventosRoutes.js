// routes/gestionAsistenciaEventosRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/gestionAsistenciaEventosController');

// POST - Registrar asistencia
router.post('/', controller.crearAsistenciaEvento);

// GET - Todas las asistencias a eventos
router.get('/', controller.obtenerTodas);

// GET - Asistencias por evento
router.get('/evento/:idEvento', controller.obtenerPorEvento);

// GET - Asistencias por usuario
router.get('/usuario/:idUsuario', controller.obtenerPorUsuario);

// PUT - Editar asistencia
router.put('/:id', controller.editarAsistenciaEvento);

module.exports = router;