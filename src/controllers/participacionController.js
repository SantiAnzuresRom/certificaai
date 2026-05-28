const { query } = require('../config/db');
const logger = require('../utils/logger');

// POST
exports.postParticipacion = async (req, res) => {
    const { id_clase, id_estudiante, fecha, cantidad, tipo, detalles } = req.body;

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
        logger.error('Error al registrar participación:', error);
        res.status(500).json({ error: 'Error al registrar participación' });
    }
};

// GET por clase
exports.getParticipacionesPorClase = async (req, res) => {
    const { idClase } = req.params;

    try {
        const result = await query(
            `SELECT * FROM PARTICIPACIONES_CLASES WHERE ID_CLASE = $1`,
            [idClase]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener participaciones por clase:', error);
        res.status(500).json({ error: 'Error al obtener participaciones por clase' });
    }
};

// GET por estudiante
exports.getParticipacionesPorEstudiante = async (req, res) => {
    const { idEstudiante } = req.params;

    try {
        const result = await query(
            `SELECT * FROM PARTICIPACIONES_CLASES WHERE ID_ESTUDIANTE = $1`,
            [idEstudiante]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener participaciones por estudiante:', error);
        res.status(500).json({ error: 'Error al obtener participaciones por estudiante' });
    }
};

// PUT
exports.putParticipacion = async (req, res) => {
    const { id } = req.params;
    const { cantidad, tipo, detalles } = req.body;

    try {
        const result = await query(
            `UPDATE PARTICIPACIONES_CLASES 
            SET CANTIDAD = $1, TIPO = $2, DETALLES = $3 
            WHERE ID_PARTICIPACIONES = $4 
            RETURNING *`,
            [cantidad, tipo, detalles, id]
        );

        res.status(200).json({ mensaje: 'Participación actualizada', participacion: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar participación:', error);
        res.status(500).json({ error: 'Error al actualizar participación' });
    }
};
