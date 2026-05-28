const express = require('express');
const router = express.Router();
const cuadroHonorController = require('../controllers/cuadroHonorController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Cuadro de honor general
router.get('/', authenticateJWT, cuadroHonorController.obtenerCuadroHonorGeneral);

// Cuadro de honor por clase
router.get('/clase/:id_clase', authenticateJWT, cuadroHonorController.obtenerCuadroHonorPorClase);

module.exports = router;
