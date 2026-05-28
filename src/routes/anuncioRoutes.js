const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// POST
router.post('/', authenticateJWT, anuncioController.crearAnuncio);

// GETs
router.get('/', authenticateJWT, anuncioController.obtenerTodosAnuncios);
router.get('/:id', authenticateJWT, anuncioController.obtenerAnuncioPorId);
router.get('/clase/:idClase', authenticateJWT, anuncioController.obtenerAnunciosPorClase);
router.get('/tipo/:tipo', authenticateJWT, anuncioController.obtenerAnunciosPorTipo);
router.get('/clase/:idClase/tipo/:tipo', authenticateJWT, anuncioController.obtenerAnunciosPorClaseYTipo);
router.get('/importancia/:importancia', authenticateJWT, anuncioController.obtenerAnunciosPorImportancia);
router.get('/clase/:idClase/tipo/:tipo/importancia/:importancia', authenticateJWT, anuncioController.obtenerAnunciosPorClaseTipoEImportancia);


// PUT
router.put('/:id', authenticateJWT, anuncioController.editarAnuncio);

// DELETE
router.delete('/:id', authenticateJWT, anuncioController.eliminarAnuncio);

module.exports = router;
