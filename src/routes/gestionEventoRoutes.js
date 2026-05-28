const express = require('express');
const router = express.Router();
const gestionEventoController = require('../controllers/gestionEventoController');

// Crear evento
router.post('/', gestionEventoController.crearEvento);

// Obtener todos los eventos
router.get('/', gestionEventoController.obtenerEventos);

// Obtener evento por ID
router.get('/:id', gestionEventoController.obtenerEventoPorId);

// Obtener eventos por clase
router.get('/clase/:id_clase', gestionEventoController.obtenerEventosPorClase);

// Obtener usuarios inscritos a un evento
router.get('/usuarios/:id_evento', gestionEventoController.obtenerUsuariosPorEvento);

// Editar evento
router.put('/:id', gestionEventoController.editarEvento);

// Eliminar evento
router.delete('/:id', gestionEventoController.eliminarEvento);

module.exports = router;
