const { query } = require('../config/db');
const logger = require('../utils/logger');

// POST
exports.postAsistencia = async (req, res) => {
    const { id_clase, id_estudiante, fecha, presente, justificacion } = req.body;
    try {
        const result = await query(
            `INSERT INTO ASISTENCIAS_CLASES (ID_CLASE, ID_ESTUDIANTE, FECHA, PRESENTE, JUSTIFICACION)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_clase, id_estudiante, fecha, presente, justificacion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al registrar asistencia: ', error);
        res.status(500).json({ error: 'Error al registrar asistencia' });
    }
};

// GET por clase
exports.getAsistenciasPorClase = async (req, res) => {
    const { id_clase } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ASISTENCIAS_CLASES WHERE ID_CLASE = $1 ORDER BY FECHA DESC`,
            [id_clase]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener asistencias por clase: ', error);
        res.status(500).json({ error: 'Error al obtener asistencias por clase' });
    }
};

// GET por estudiante
exports.getAsistenciasPorEstudiante = async (req, res) => {
    const { id_estudiante } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ASISTENCIAS_CLASES WHERE ID_ESTUDIANTE = $1 ORDER BY FECHA DESC`,
            [id_estudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener asistencias por estudiante: ', error);
        res.status(500).json({ error: 'Error al obtener asistencias por estudiante' });
    }
};

// GET por estudiante en una clase
exports.getAsistenciasPorEstudianteEnClase = async (req, res) => {
    const { id_clase, id_estudiante } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ASISTENCIAS_CLASES WHERE ID_CLASE = $1 AND ID_ESTUDIANTE = $2 ORDER BY FECHA DESC`,
            [id_clase, id_estudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener asistencias del estudiante en clase: ', error);
        res.status(500).json({ error: 'Error al obtener asistencias del estudiante en clase' });
    }
};

// PUT para justificar o actualizar asistencia
exports.putAsistencia = async (req, res) => {
    const { id_asistencia } = req.params;
    const { presente, justificacion } = req.body;
    try {
        await query(
            `UPDATE ASISTENCIAS_CLASES SET PRESENTE = $1, JUSTIFICACION = $2 WHERE ID_ASISTENCIA = $3`,
            [presente, justificacion, id_asistencia]
        );
        const result = await query(
            `SELECT * FROM ASISTENCIAS_CLASES WHERE ID_ASISTENCIA = $1`,
            [id_asistencia]
        );
        res.status(200).json({ mensaje: 'Asistencia actualizada', asistencia: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar asistencia: ', error);
        res.status(500).json({ error: 'Error al actualizar asistencia' });
    }
};

// GET resumen por clase
exports.getResumenPorClase = async (req, res) => {
    const { id_clase } = req.params;
    try {
        const result = await query(`
            SELECT 
                u.ID_USUARIO AS id_estudiante,
                u.NOMBRE,
                u.APELLIDOS,
                COUNT(*) FILTER (WHERE a.PRESENTE = TRUE) AS asistencias,
                COUNT(*) FILTER (WHERE a.PRESENTE = FALSE) AS faltas,
                COUNT(*) FILTER (WHERE a.JUSTIFICACION IS NOT NULL AND a.JUSTIFICACION != '') AS justificadas
            FROM ASISTENCIAS_CLASES a
            JOIN USUARIOS u ON a.ID_ESTUDIANTE = u.ID_USUARIO
            WHERE a.ID_CLASE = $1
            GROUP BY u.ID_USUARIO, u.NOMBRE, u.APELLIDOS
            ORDER BY u.APELLIDOS, u.NOMBRE
        `, [id_clase]);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener resumen de asistencias: ', error);
        res.status(500).json({ error: 'Error al obtener resumen de asistencias' });
    }
};
