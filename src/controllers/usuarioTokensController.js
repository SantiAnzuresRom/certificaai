const { query } = require('../config/db');
const logger = require('../utils/logger');

// Obtener todos los registros de tokens
exports.obtenerTodos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM USUARIO_TOKENS ORDER BY ID_USUARIO_TOKENS');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener todos los tokens:', error);
        res.status(500).json({ error: 'Error al obtener los registros de tokens' });
    }
};

// Obtener tokens por ID de usuario
exports.obtenerPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const result = await query('SELECT * FROM USUARIO_TOKENS WHERE ID_USUARIO = $1', [idUsuario]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no tiene registro de tokens' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener tokens por usuario:', error);
        res.status(500).json({ error: 'Error al obtener los tokens del usuario' });
    }
};

// Modificar el balance manualmente (solo para pruebas)
exports.actualizarTokens = async (req, res) => {
    const { idUsuario } = req.params;
    const { balance } = req.body;

    try {
        const result = await query(
            `UPDATE USUARIO_TOKENS
             SET BALANCE = $1, ULTIMA_ACTUALIZACION = NOW()
             WHERE ID_USUARIO = $2 RETURNING *`,
            [balance, idUsuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado en tokens' });
        }

        res.status(200).json({ mensaje: 'Balance actualizado', usuario_tokens: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar balance:', error);
        res.status(500).json({ error: 'Error al actualizar balance de tokens' });
    }
};
