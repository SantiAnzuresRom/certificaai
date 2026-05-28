const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// Reporte de promedio de asistencia por clase
router.get('/promedio-asistencia/:id_clase', reportesController.promedioAsistencia);

// Reporte asistencia a evento
router.get('/asistencia-evento/:idEvento', reportesController.obtenerReporteAsistenciaEvento);

// Conteo de usuarios por tipo
router.get('/usuarios-por-tipo', reportesController.reporteUsuariosPorTipo);

// Reporte de recompensas
router.get('/recompensas', reportesController.reporteRecompensas);

// Reporte de eventos por mes
router.get('/eventos-por-mes', reportesController.reporteEventosPorMes);

// Reporte de total de insignias
router.get('/insignias', reportesController.reporteTotalInsignias);

// Reporte de clases con profesor y total de alumnos
router.get('/clases', reportesController.reporteClases);


module.exports = router;
