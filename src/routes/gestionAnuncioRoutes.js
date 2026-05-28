const express = require('express');
const router = express.Router();
const gestionAnuncioController = require('../controllers/gestionAnuncioController');

// Crear anuncio
router.post('/', gestionAnuncioController.crearAnuncio);

// Obtener todos los anuncios
router.get('/', gestionAnuncioController.obtenerAnuncios);

// Obtener anuncio por ID
router.get('/:id', gestionAnuncioController.obtenerAnuncioPorId);

// Obtener anuncios por clase
router.get('/clase/:id_clase', gestionAnuncioController.obtenerAnunciosPorClase);

// Obtener anuncios filtrados por dirigido_a
router.get('/dirigido/:tipo', gestionAnuncioController.obtenerAnunciosPorDirigidoA);

// Editar anuncio
router.put('/:id', gestionAnuncioController.editarAnuncio);

// Eliminar anuncio
router.delete('/:id', gestionAnuncioController.eliminarAnuncio);

module.exports = router;
