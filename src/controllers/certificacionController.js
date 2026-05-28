const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear
exports.crearCertificacion = async (req, res) => {
    const { id_usuario, titulo, fecha_obtencion, url_documento } = req.body;

    try {
        const { rows } = await query(
            `INSERT INTO CERTIFICACIONES (ID_USUARIO, TITULO, FECHA_OBTENCION, URL_DOCUMENTO)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_usuario, titulo, fecha_obtencion, url_documento]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear certificación:', error);
        res.status(500).json({ error: 'Error al crear certificación' });
    }
};

// Obtener todas
exports.obtenerTodas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM CERTIFICACIONES ORDER BY FECHA_OBTENCION DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener certificaciones:', error);
        res.status(500).json({ error: 'Error al obtener certificaciones' });
    }
};

// Obtener por usuario
exports.obtenerPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const result = await query(
            'SELECT * FROM CERTIFICACIONES WHERE ID_USUARIO = $1 ORDER BY FECHA_OBTENCION DESC',
            [idUsuario]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener certificaciones por usuario:', error);
        res.status(500).json({ error: 'Error al obtener certificaciones por usuario' });
    }
};

// Obtener por ID
exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            'SELECT * FROM CERTIFICACIONES WHERE ID_CERTIDICADO = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Certificación no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener certificación:', error);
        res.status(500).json({ error: 'Error al obtener certificación' });
    }
};

// Editar
exports.editarCertificacion = async (req, res) => {
    const { id } = req.params;
    const { titulo, fecha_obtencion, url_documento } = req.body;

    try {
        const result = await query(
            `UPDATE CERTIFICACIONES 
             SET TITULO = $1, FECHA_OBTENCION = $2, URL_DOCUMENTO = $3
             WHERE ID_CERTIDICADO = $4 RETURNING *`,
            [titulo, fecha_obtencion, url_documento, id]
        );

        res.status(200).json({ mensaje: 'Certificación actualizada', certificacion: result.rows[0] });
    } catch (error) {
        logger.error('Error al editar certificación:', error);
        res.status(500).json({ error: 'Error al editar certificación' });
    }
};

// Eliminar
exports.eliminarCertificacion = async (req, res) => {
    const { id } = req.params;

    try {
        await query('DELETE FROM CERTIFICACIONES WHERE ID_CERTIDICADO = $1', [id]);
        res.status(200).json({ mensaje: 'Certificación eliminada' });
    } catch (error) {
        logger.error('Error al eliminar certificación:', error);
        res.status(500).json({ error: 'Error al eliminar certificación' });
    }
};
