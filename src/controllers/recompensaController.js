const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear
exports.crearRecompensa = async (req, res) => {
    const { nombre, descripcion, costo_tokens, imagen_url } = req.body;

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


// Obtener todas
exports.obtenerRecompensas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM RECOMPENSAS ORDER BY FECHA_CREACION DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener recompensas:', error);
        res.status(500).json({ error: 'Error al obtener recompensas' });
    }
};

// Obtener por ID
exports.obtenerRecompensaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query('SELECT * FROM RECOMPENSAS WHERE ID_RECOMPENSA = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recompensa no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener recompensa:', error);
        res.status(500).json({ error: 'Error al obtener recompensa' });
    }
};

// Editar
exports.editarRecompensa = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, costo_tokens, activo } = req.body;

    try {
        const result = await query(
            `UPDATE RECOMPENSAS 
             SET NOMBRE = $1, DESCRIPCION = $2, COSTO_TOKENS = $3, ACTIVO = $4 
             WHERE ID_RECOMPENSA = $5 RETURNING *`,
            [nombre, descripcion, costo_tokens, activo, id]
        );

        res.status(200).json({ mensaje: 'Recompensa actualizada', recompensa: result.rows[0] });
    } catch (error) {
        logger.error('Error al editar recompensa:', error);
        res.status(500).json({ error: 'Error al editar recompensa' });
    }
};

// Eliminar 
exports.eliminarRecompensa = async (req, res) => {
    const { id } = req.params;

    try {
        await query(
            `UPDATE RECOMPENSAS SET ACTIVO = FALSE WHERE ID_RECOMPENSA = $1`,
            [id]
        );

        res.status(200).json({ mensaje: 'Recompensa desactivada' });
    } catch (error) {
        logger.error('Error al eliminar recompensa:', error);
        res.status(500).json({ error: 'Error al desactivar recompensa' });
    }
};
