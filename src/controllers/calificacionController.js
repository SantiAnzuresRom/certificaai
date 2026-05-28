const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear calificación
exports.crearCalificacion = async (req, res) => {
    const { id_asignacion, id_estudiante, calificacion, comentario, valor_tokens } = req.body;

    try {
        const { rows } = await query(
            `INSERT INTO CALIFICACIONES 
            (ID_ASIGNACION, ID_ESTUDIANTE, CALIFICACION, COMENTARIO, VALOR_TOKENS) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_asignacion, id_estudiante, calificacion, comentario, valor_tokens || 0]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al registrar calificación:', error);
        res.status(500).json({ error: 'Error al registrar calificación' });
    }
};

// Obtener todas
exports.obtenerTodas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM CALIFICACIONES ORDER BY FECHA_CALIFICACION DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener calificaciones:', error);
        res.status(500).json({ error: 'Error al obtener calificaciones' });
    }
};

// Por estudiante
exports.obtenerPorEstudiante = async (req, res) => {
    const { idEstudiante } = req.params;
    try {
        const result = await query(
            `SELECT * FROM CALIFICACIONES 
             WHERE ID_ESTUDIANTE = $1 ORDER BY FECHA_CALIFICACION DESC`,
            [idEstudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener calificaciones del estudiante:', error);
        res.status(500).json({ error: 'Error al obtener calificaciones del estudiante' });
    }
};

// Por asignación
exports.obtenerPorAsignacion = async (req, res) => {
    const { idAsignacion } = req.params;
    try {
        const result = await query(
            `SELECT * FROM CALIFICACIONES 
             WHERE ID_ASIGNACION = $1 ORDER BY FECHA_CALIFICACION DESC`,
            [idAsignacion]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener calificaciones por asignación:', error);
        res.status(500).json({ error: 'Error al obtener calificaciones por asignación' });
    }
};

// Actualizar calificación
exports.actualizarCalificacion = async (req, res) => {
    const { id } = req.params;
    const { calificacion, comentario, valor_tokens } = req.body;

    try {
        const result = await query(
            `UPDATE CALIFICACIONES 
             SET CALIFICACION = $1, COMENTARIO = $2, VALOR_TOKENS = $3, FECHA_CALIFICACION = NOW()
             WHERE ID_CALIFICACION = $4 RETURNING *`,
            [calificacion, comentario, valor_tokens, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Calificación no encontrada' });
        }

        res.status(200).json({ mensaje: 'Calificación actualizada', calificacion: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar calificación:', error);
        res.status(500).json({ error: 'Error al actualizar calificación' });
    }
};

// Eliminar calificación
exports.eliminarCalificacion = async (req, res) => {
    const { id } = req.params;

    try {
        await query('DELETE FROM CALIFICACIONES WHERE ID_CALIFICACION = $1', [id]);
        res.status(200).json({ mensaje: 'Calificación eliminada' });
    } catch (error) {
        logger.error('Error al eliminar calificación:', error);
        res.status(500).json({ error: 'Error al eliminar calificación' });
    }
};
