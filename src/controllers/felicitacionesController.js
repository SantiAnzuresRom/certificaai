const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear felicitación (solo con ID de usuario y fecha de cumpleaños)
exports.crearFelicitacion = async (req, res) => {
  const { id_usuario, fecha_cumple } = req.body;

  if (!id_usuario || !fecha_cumple) {
    return res.status(400).json({ error: 'ID de usuario y fecha de cumpleaños son requeridos' });
  }

  try {
    // Verificar si ya existe una felicitación para este usuario
    const existe = await query(
      'SELECT * FROM FELICITACIONES_USUARIOS WHERE ID_USUARIO = $1',
      [id_usuario]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Ya has registrado tu cumpleaños' });
    }

    // Insertar nueva felicitación con valores nulos en video y mensaje
    const result = await query(
      `INSERT INTO FELICITACIONES_USUARIOS 
       (ID_USUARIO, FECHA_CUMPLE, URL_VIDEO, MENSAJE) 
       VALUES ($1, $2, NULL, NULL) 
       RETURNING *`,
      [id_usuario, fecha_cumple]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear felicitación:', error);
    res.status(500).json({ error: 'Error al crear felicitación' });
  }
};


// Obtener todas las felicitaciones
exports.obtenerTodasFelicitaciones = async (req, res) => {
    try {
        const result = await query('SELECT * FROM FELICITACIONES_USUARIOS ORDER BY FECHA_CUMPLE DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener felicitaciones:', error);
        res.status(500).json({ error: 'Error al obtener felicitaciones' });
    }
};

// Obtener felicitaciones por ID de usuario
exports.obtenerPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const result = await query(
            'SELECT * FROM FELICITACIONES_USUARIOS WHERE ID_USUARIO = $1 ORDER BY FECHA_CUMPLE DESC',
            [idUsuario]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener felicitaciones por usuario:', error);
        res.status(500).json({ error: 'Error al obtener felicitaciones por usuario' });
    }
};

// Editar felicitación
exports.editarFelicitacion = async (req, res) => {
    const { id } = req.params;
    const { fecha_cumple, url_video, mensaje } = req.body;

    try {
        const result = await query(
            `UPDATE FELICITACIONES_USUARIOS 
             SET FECHA_CUMPLE = $1, URL_VIDEO = $2, MENSAJE = $3 
             WHERE ID_FELICITACIONES = $4 RETURNING *`,
            [fecha_cumple, url_video, mensaje, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Felicitación no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Felicitación actualizada',
            felicitacion: result.rows[0]
        });
    } catch (error) {
        logger.error('Error al editar felicitación:', error);
        res.status(500).json({ error: 'Error al editar felicitación' });
    }
};


// Actualizar felicitación (por ID de usuario)
exports.actualizarFelicitacionPorUsuario = async (req, res) => {
  const { url_video, mensaje } = req.body;
  const { idUsuario } = req.params;

  if (!idUsuario || !url_video || !mensaje) {
    return res.status(400).json({ error: 'ID de usuario, URL del video y mensaje son requeridos' });
  }

  try {
    const result = await query(
      `UPDATE FELICITACIONES_USUARIOS 
       SET URL_VIDEO = $1, MENSAJE = $2 
       WHERE ID_USUARIO = $3 
       RETURNING *`,
      [url_video, mensaje, idUsuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró una felicitación para este usuario' });
    }

    res.status(200).json({
      mensaje: 'Felicitación actualizada correctamente',
      felicitacion: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar felicitación:', error);
    res.status(500).json({ error: 'Error al actualizar felicitación' });
  }
};


// Obtener felicitaciones pendientes (sin video y/o mensaje)
exports.obtenerFelicitacionesPendientes = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM FELICITACIONES_USUARIOS 
       WHERE URL_VIDEO IS NULL OR MENSAJE IS NULL`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener felicitaciones pendientes:', error);
    res.status(500).json({ error: 'Error al obtener felicitaciones pendientes'});
}};


// Editar felicitación por ID de usuario (solo la primera encontrada)
exports.editarPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    const { fecha_cumple, url_video, mensaje } = req.body;

    try {
        const result = await query(
            `UPDATE FELICITACIONES_USUARIOS 
             SET FECHA_CUMPLE = $1, URL_VIDEO = $2, MENSAJE = $3 
             WHERE ID_USUARIO = $4 
             RETURNING *`,
            [fecha_cumple, url_video, mensaje, idUsuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Felicitación no encontrada para este usuario' });
        }

        res.status(200).json({
            mensaje: 'Felicitación actualizada por ID de usuario',
            felicitacion: result.rows[0]
        });
    } catch (error) {
        logger.error('Error al editar felicitación por usuario:', error);
        res.status(500).json({ error: 'Error al editar felicitación por usuario' });
    }
};
