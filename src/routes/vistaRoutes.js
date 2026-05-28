const express = require('express');
const router = express.Router();
const vistaController = require('../controllers/vistaController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// RESUMEN ACADEMICO
router.get('/resumen-academico', authenticateJWT, vistaController.obtenerResumenAcademico);
router.get('/resumen-academico/usuario/:idUsuario', authenticateJWT, vistaController.obtenerResumenAcademico);
router.get('/resumen-academico/clase/:idClase', authenticateJWT, vistaController.obtenerResumenAcademico);
router.get('/resumen-academico/usuario/:idUsuario/clase/:idClase', authenticateJWT, vistaController.obtenerResumenAcademico);

// ASISTENCIAS DETALLADAS
router.get('/asistencias-detalladas', authenticateJWT, vistaController.obtenerAsistenciasDetalladas);
router.get('/asistencias-detalladas/clase/:idClase', authenticateJWT, vistaController.obtenerAsistenciasDetalladas);

// EVENTOS CON ASISTENCIA
router.get('/eventos-asistencia', authenticateJWT, vistaController.obtenerEventosConAsistencia);
router.get('/eventos-asistencia/clase/:idClase', authenticateJWT, vistaController.obtenerEventosConAsistencia);

// CUADRO DE HONOR GENERAL
router.get('/cuadro-honor-general', authenticateJWT, vistaController.obtenerCuadroHonorGeneral);

// CUADRO DE HONOR POR CLASE
router.get('/cuadro-honor-clase/:idClase', authenticateJWT, vistaController.obtenerCuadroHonorPorClase);

module.exports = router;
