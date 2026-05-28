// controllers/canjeController.js
const { query } = require('../config/db');
const logger = require('../utils/logger');

// POST - Comprar recompensa
exports.comprarRecompensa = async (req, res) => {
    const { id_usuario, id_recompensa } = req.body;

    try {
        // Verificar si ya tiene una recompensa pendiente sin entregar
        const canjeExistente = await query(
            `SELECT * FROM CANJE_RECOMPENSAS 
             WHERE ID_USUARIO = $1 AND ID_RECOMPENSA = $2 AND ESTADO = 'PENDIENTE'`,
            [id_usuario, id_recompensa]
        );

        if (canjeExistente.rows.length > 0) {
            return res.status(400).json({ error: 'Ya tienes esta recompensa pendiente por canjear' });
        }

        // Verificar si tiene suficientes tokens
        const recompensa = await query('SELECT * FROM RECOMPENSAS WHERE ID_RECOMPENSA = $1', [id_recompensa]);
        if (recompensa.rows.length === 0) {
            return res.status(404).json({ error: 'Recompensa no encontrada' });
        }

        const costo = recompensa.rows[0].costo_tokens;

        const tokens = await query('SELECT * FROM USUARIO_TOKENS WHERE ID_USUARIO = $1', [id_usuario]);
        const balance = tokens.rows[0]?.balance || 0;

        if (balance < costo) {
            return res.status(400).json({ error: 'Saldo insuficiente de tokens' });
        }

        // Registrar canje
        const { rows } = await query(
            `INSERT INTO CANJE_RECOMPENSAS (ID_USUARIO, ID_RECOMPENSA, ESTADO) 
             VALUES ($1, $2, 'PENDIENTE') RETURNING *`,
            [id_usuario, id_recompensa]
        );

        // Registrar transacción y actualizar balance
        await query(
            `INSERT INTO TRANSACCION_TOKENS (ID_USUARIO, MONTO, TIPO, ID_REFERENCIA, TIPO_REFERENCIA, FECHA) 
             VALUES ($1, $2, 'GASTADO', $3, 'RECOMPENSA', NOW())`,
            [id_usuario, costo, id_recompensa]
        );

        await query(
            `UPDATE USUARIO_TOKENS SET BALANCE = BALANCE - $1, ULTIMA_ACTUALIZACION = NOW() 
             WHERE ID_USUARIO = $2`,
            [costo, id_usuario]
        );

        res.status(201).json({ mensaje: 'Recompensa comprada exitosamente', canje: rows[0] });
    } catch (error) {
        logger.error('Error al comprar recompensa:', error);
        res.status(500).json({ error: 'Error al comprar recompensa' });
    }
};

// PUT - Cambiar estado de canje (ej. marcar como entregado)
exports.actualizarEstadoCanje = async (req, res) => {
    const { id } = req.params;
    const { estado, comentario } = req.body;

    try {
        const result = await query(
            `UPDATE CANJE_RECOMPENSAS SET ESTADO = $1, COMENTARIO = $2, FECHA_CANJE = NOW() WHERE ID_CANJE = $3 RETURNING *`,
            [estado, comentario, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Canje no encontrado' });
        }

        res.status(200).json({ mensaje: 'Estado actualizado', canje: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar estado de canje:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// GET - Todos los canjes
exports.obtenerTodosLosCanjes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM CANJE_RECOMPENSAS ORDER BY FECHA_CANJE DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener canjes:', error);
        res.status(500).json({ error: 'Error al obtener canjes' });
    }
};

// GET - Canjes por usuario
exports.obtenerCanjesPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const result = await query(
            'SELECT * FROM CANJE_RECOMPENSAS WHERE ID_USUARIO = $1 ORDER BY FECHA_CANJE DESC',
            [idUsuario]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener canjes por usuario:', error);
        res.status(500).json({ error: 'Error al obtener canjes por usuario' });
    }
};
