// controllers/gestionAsistenciaController.js
const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear asistencia
exports.crearAsistencia = async (req, res) => {
  const { id_clase, id_estudiante, fecha, presente, justificacion } = req.body;

  if (!id_clase || !id_estudiante || !fecha || presente === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO ASISTENCIAS_CLASES 
      (ID_CLASE, ID_ESTUDIANTE, FECHA, PRESENTE, JUSTIFICACION) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_clase, id_estudiante, fecha, presente, justificacion]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    logger.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};

// Obtener todas las asistencias
exports.obtenerTodas = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM ASISTENCIAS_CLASES ORDER BY FECHA DESC`);
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener asistencias:', error);
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
};

// Obtener asistencias por clase
exports.obtenerPorClase = async (req, res) => {
  const { idClase } = req.params;
  try {
    const result = await query(
      `SELECT * FROM ASISTENCIAS_CLASES WHERE ID_CLASE = $1 ORDER BY FECHA DESC`,
      [idClase]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener asistencias por clase:', error);
    res.status(500).json({ error: 'Error al obtener asistencias por clase' });
  }
};

// Obtener asistencias por estudiante
exports.obtenerPorEstudiante = async (req, res) => {
  const { idEstudiante } = req.params;
  try {
    const result = await query(
      `SELECT * FROM ASISTENCIAS_CLASES WHERE ID_ESTUDIANTE = $1 ORDER BY FECHA DESC`,
      [idEstudiante]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener asistencias por estudiante:', error);
    res.status(500).json({ error: 'Error al obtener asistencias por estudiante' });
  }
};

// Editar asistencia
exports.editarAsistencia = async (req, res) => {
  const { id } = req.params;
  const { presente, justificacion, fecha } = req.body;

  try {
    const result = await query(
      `UPDATE ASISTENCIAS_CLASES 
      SET PRESENTE = $1, JUSTIFICACION = $2, FECHA = $3 
      WHERE ID_ASISTENCIA = $4 
      RETURNING *`,
      [presente, justificacion, fecha, id]
    );

    res.status(200).json({ mensaje: 'Asistencia actualizada', asistencia: result.rows[0] });
  } catch (error) {
    logger.error('Error al editar asistencia:', error);
    res.status(500).json({ error: 'Error al editar asistencia' });
  }
};
