const { query } = require('../config/db');
const logger = require('../utils/logger');

// Obtener todas las recompensas (activas e inactivas)
exports.obtenerTodas = async (req, res) => {
  try {
    const result = await query('SELECT * FROM RECOMPENSAS ORDER BY FECHA_CREACION DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener recompensas:', error);
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
};

// Obtener solo recompensas activas
exports.obtenerActivas = async (req, res) => {
  try {
    const result = await query('SELECT * FROM RECOMPENSAS WHERE ACTIVO = TRUE ORDER BY FECHA_CREACION DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener recompensas activas:', error);
    res.status(500).json({ error: 'Error al obtener recompensas activas' });
  }
};

// Obtener recompensa por ID
exports.obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM RECOMPENSAS WHERE ID_RECOMPENSA = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recompensa no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    logger.error('Error al obtener recompensa por ID:', error);
    res.status(500).json({ error: 'Error al obtener recompensa' });
  }
};

// Crear nueva recompensa
exports.crear = async (req, res) => {
  const { nombre, descripcion, costo_tokens, imagen_url } = req.body;

  if (!nombre || !costo_tokens) {
    return res.status(400).json({ error: 'Nombre y costo de tokens son requeridos' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO RECOMPENSAS (NOMBRE, DESCRIPCION, COSTO_TOKENS, IMAGEN_URL)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, descripcion, costo_tokens, imagen_url]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    logger.error('Error al crear recompensa:', error);
    res.status(500).json({ error: 'Error al crear recompensa' });
  }
};

// Editar recompensa
exports.editar = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, costo_tokens, imagen_url, activo } = req.body;

  try {
    const result = await query(
      `UPDATE RECOMPENSAS 
       SET NOMBRE = $1, DESCRIPCION = $2, COSTO_TOKENS = $3, IMAGEN_URL = $4, ACTIVO = $5 
       WHERE ID_RECOMPENSA = $6 RETURNING *`,
      [nombre, descripcion, costo_tokens, imagen_url, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recompensa no encontrada' });
    }

    res.status(200).json({ mensaje: 'Recompensa actualizada', recompensa: result.rows[0] });
  } catch (error) {
    logger.error('Error al editar recompensa:', error);
    res.status(500).json({ error: 'Error al editar recompensa' });
  }
};

// Desactivar recompensa
exports.desactivar = async (req, res) => {
  const { id } = req.params;

  try {
    await query('UPDATE RECOMPENSAS SET ACTIVO = FALSE WHERE ID_RECOMPENSA = $1', [id]);
    res.status(200).json({ mensaje: 'Recompensa desactivada' });
  } catch (error) {
    logger.error('Error al desactivar recompensa:', error);
    res.status(500).json({ error: 'Error al desactivar recompensa' });
  }
};

// Activar recompensa
exports.activar = async (req, res) => {
  const { id } = req.params;

  try {
    await query('UPDATE RECOMPENSAS SET ACTIVO = TRUE WHERE ID_RECOMPENSA = $1', [id]);
    res.status(200).json({ mensaje: 'Recompensa activada' });
  } catch (error) {
    logger.error('Error al activar recompensa:', error);
    res.status(500).json({ error: 'Error al activar recompensa' });
  }
};
