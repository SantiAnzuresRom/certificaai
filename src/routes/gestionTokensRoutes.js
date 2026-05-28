// routes/gestionTokensRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/gestionTokensController');

// POST - Crear nuevo registro de saldo
router.post('/', controller.crearSaldoTokens);

// GET - Todos los saldos
router.get('/', controller.obtenerTodos);

// GET - Por usuario
router.get('/:idUsuario', controller.obtenerPorUsuario);

// PUT - Editar saldo directamente
router.put('/:idUsuario', controller.editarSaldo);

// PUT - Aumentar tokens
router.put('/:idUsuario/aumentar', controller.aumentarTokens);

// PUT - Disminuir tokens
router.put('/:idUsuario/disminuir', controller.disminuirTokens);

module.exports = router;
