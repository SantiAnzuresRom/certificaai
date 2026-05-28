const { query } = require('../config/db');
const logger = require('../utils/logger');

//  Obtener todas las participaciones por estudiante y clase
exports.getTodasParticipaciones = async (req, res) => {
  try {
    const sql = `SELECT * FROM vista_participaciones_estudiante`;
    const { rows } = await query(sql);
    res.status(200).json(rows);
  } catch (error) {
    logger.error('Error al obtener todas las participaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Obtener participaciones de un estudiante (todas sus clases)
exports.getPorEstudiante = async (req, res) => {
  try {
    const { idEstudiante } = req.params;
    const sql = `SELECT * FROM vista_participaciones_estudiante WHERE id_estudiante = $1`;
    const { rows } = await query(sql, [idEstudiante]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron participaciones para este estudiante' });
    }

    res.status(200).json(rows);
  } catch (error) {
    logger.error('Error al obtener participaciones por estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Obtener participaciones de una clase (todos sus estudiantes)
exports.getPorClase = async (req, res) => {
  try {
    const { idClase } = req.params;
    const sql = `SELECT * FROM vista_participaciones_estudiante WHERE id_clase = $1`;
    const { rows } = await query(sql, [idClase]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron participaciones para esta clase' });
    }

    res.status(200).json(rows);
  } catch (error) {
    logger.error('Error al obtener participaciones por clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  Obtener participaciones de un estudiante en una clase específica
exports.getPorEstudianteYClase = async (req, res) => {
  try {
    const { idEstudiante, idClase } = req.params;
    const sql = `
      SELECT * FROM vista_participaciones_estudiante 
      WHERE id_estudiante = $1 AND id_clase = $2
    `;
    const { rows } = await query(sql, [idEstudiante, idClase]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron participaciones para este estudiante en esta clase' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    logger.error('Error al obtener participaciones por estudiante y clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
