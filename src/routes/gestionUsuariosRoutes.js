const express = require('express');
const router = express.Router();
const gestionUsuarioController = require('../controllers/gestionUsuarioController');

// Obtener todos los usuarios
router.get('/', gestionUsuarioController.obtenerUsuarios);

// Obtener usuario por ID
router.get('/:id', gestionUsuarioController.obtenerUsuarioPorId);

// Crear usuario (solo admin)
router.post('/', gestionUsuarioController.crearUsuario);

// Actualizar usuario
router.put('/:id', gestionUsuarioController.actualizarUsuario);

// Actualizar contraseña de usuario
router.put('/:id/password', gestionUsuarioController.actualizarContrasena);

// Verificar cumpleaños del usuario
router.get('/:id/verificar-cumple', gestionUsuarioController.verificarCumpleanios);


module.exports = router;
