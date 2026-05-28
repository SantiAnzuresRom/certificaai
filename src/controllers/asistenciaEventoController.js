const { query } = require('../config/db');
const logger = require('../utils/logger');

// Registrar asistencia
exports.registrarAsistencia = async (req, res) => {
    const { id_evento, id_usuario, asistencia } = req.body;

    try {
        const yaRegistrado = await query(
            `SELECT * FROM ASISTENCIA_EVENTOS 
             WHERE ID_EVENTO = $1 AND ID_USUARIO = $2`,
            [id_evento, id_usuario]
        );

        if (yaRegistrado.rows.length > 0) {
            return res.status(409).json({ error: 'Ya se registró asistencia para este evento' });
        }

        const result = await query(
            `INSERT INTO ASISTENCIA_EVENTOS (ID_EVENTO, ID_USUARIO, ASISTENCIA) 
             VALUES ($1, $2, $3) RETURNING *`,
            [id_evento, id_usuario, asistencia]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al registrar asistencia:', error);
        res.status(500).json({ error: 'Error al registrar asistencia al evento' });
    }
}; 

// Obtener asistencias por evento
exports.obtenerPorEvento = async (req, res) => {
    const { idEvento } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ASISTENCIA_EVENTOS WHERE ID_EVENTO = $1`,
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
            `SELECT * FROM ASISTENCIA_EVENTOS WHERE ID_USUARIO = $1`,
            [idUsuario]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener asistencias por usuario:', error);
        res.status(500).json({ error: 'Error al obtener asistencias por usuario' });
    }
};
