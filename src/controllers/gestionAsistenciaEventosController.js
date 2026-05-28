// controllers/gestionAsistenciaEventosController.js
const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear asistencia a evento
exports.crearAsistenciaEvento = async (req, res) => {
  const { id_evento, id_usuario, asistencia } = req.body;

  if (!id_evento || !id_usuario || asistencia === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO ASISTENCIA_EVENTOS 
      (ID_EVENTO, ID_USUARIO, ASISTENCIA) 
      VALUES ($1, $2, $3) RETURNING *`,
      [id_evento, id_usuario, asistencia]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    logger.error('Error al registrar asistencia a evento:', error);
    res.status(500).json({ error: 'Error al registrar asistencia a evento' });
  }
};

// Obtener todas las asistencias a eventos
exports.obtenerTodas = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM ASISTENCIA_EVENTOS ORDER BY FECHA_REGISTRO DESC`);
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener asistencias a eventos:', error);
    res.status(500).json({ error: 'Error al obtener asistencias a eventos' });
  }
};

// Obtener asistencias por evento
exports.obtenerPorEvento = async (req, res) => {
  const { idEvento } = req.params;
  try {
    const result = await query(
      `SELECT * FROM ASISTENCIA_EVENTOS WHERE ID_EVENTO = $1 ORDER BY FECHA_REGISTRO DESC`,
      [idEvento]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener asistencias por evento:', error);
    res.status(500).json({ error: 'Error al obtener asistencias por evento' });
  }
};

// Obtener asistencias por usuario
exports.obtenerPorUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const result = await query(
      `SELECT * FROM ASISTENCIA_EVENTOS WHERE ID_USUARIO = $1 ORDER BY FECHA_REGISTRO DESC`,
      [idUsuario]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener asistencias por usuario:', error);
    res.status(500).json({ error: 'Error al obtener asistencias por usuario' });
  }
};

// Editar asistencia
exports.editarAsistenciaEvento = async (req, res) => {
  const { id } = req.params;
  const { asistencia } = req.body;

  if (asistencia === undefined) {
    return res.status(400).json({ error: 'Se requiere el campo asistencia' });
  }

  try {
    const result = await query(
      `UPDATE ASISTENCIA_EVENTOS 
      SET ASISTENCIA = $1 
      WHERE ID_ASISTENCIA = $2 
      RETURNING *`,
      [asistencia, id]
    );

    res.status(200).json({ mensaje: 'Asistencia actualizada', asistencia: result.rows[0] });
  } catch (error) {
    logger.error('Error al editar asistencia a evento:', error);
    res.status(500).json({ error: 'Error al editar asistencia a evento' });
  }
};
