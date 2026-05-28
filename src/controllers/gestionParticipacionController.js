const { query } = require('../config/db');
const logger = require('../utils/logger');

// GET: Todas las participaciones
exports.obtenerTodasParticipaciones = async (req, res) => {
  try {
    const result = await query('SELECT * FROM PARTICIPACIONES_CLASES ORDER BY CREADO_EN DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener todas las participaciones:', error);
    res.status(500).json({ error: 'Error al obtener las participaciones' });
  }
};

// GET: Participaciones por clase
exports.obtenerParticipacionesPorClase = async (req, res) => {
  const { idClase } = req.params;

  try {
    const result = await query(
      'SELECT * FROM PARTICIPACIONES_CLASES WHERE ID_CLASE = $1 ORDER BY CREADO_EN DESC',
      [idClase]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener participaciones por clase:', error);
    res.status(500).json({ error: 'Error al obtener participaciones por clase' });
  }
};

// GET: Participaciones por estudiante
exports.obtenerParticipacionesPorEstudiante = async (req, res) => {
  const { idEstudiante } = req.params;

  try {
    const result = await query(
      'SELECT * FROM PARTICIPACIONES_CLASES WHERE ID_ESTUDIANTE = $1 ORDER BY CREADO_EN DESC',
      [idEstudiante]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener participaciones por estudiante:', error);
    res.status(500).json({ error: 'Error al obtener participaciones por estudiante' });
  }
};

// POST: Crear participación (admin)
exports.crearParticipacion = async (req, res) => {
  const { id_clase, id_estudiante, fecha, cantidad, tipo, detalles } = req.body;

  if (!id_clase || !id_estudiante || !fecha || cantidad == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const result = await query(
      `INSERT INTO PARTICIPACIONES_CLASES 
       (ID_CLASE, ID_ESTUDIANTE, FECHA, CANTIDAD, TIPO, DETALLES) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [id_clase, id_estudiante, fecha, cantidad, tipo, detalles]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error al crear participación:', error);
    res.status(500).json({ error: 'Error al crear participación' });
  }
};

// PUT: Editar participación por ID
exports.editarParticipacion = async (req, res) => {
  const { id } = req.params;
  const { fecha, cantidad, tipo, detalles } = req.body;

  try {
    const result = await query(
      `UPDATE PARTICIPACIONES_CLASES 
       SET FECHA = $1, CANTIDAD = $2, TIPO = $3, DETALLES = $4 
       WHERE ID_PARTICIPACIONES = $5 
       RETURNING *`,
      [fecha, cantidad, tipo, detalles, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participación no encontrada' });
    }

    res.status(200).json({ mensaje: 'Participación actualizada', participacion: result.rows[0] });
  } catch (error) {
    logger.error('Error al editar participación:', error);
    res.status(500).json({ error: 'Error al editar participación' });
  }
};
