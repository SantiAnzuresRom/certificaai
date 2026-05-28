const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.crearAsignacion = async (req, res) => {
    const { id_clase, id_profesor, titulo, descripcion, fecha_entrega, calificacion_maxima, url_archivo } = req.body;

    try {
        const result = await query(
            `INSERT INTO ASIGNACIONES 
            (ID_CLASE, ID_PROFESOR, TITULO, DESCRIPCION, FECHA_ENTREGA, CALIFICACION_MAXIMA, URL_ARCHIVO) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id_clase, id_profesor, titulo, descripcion, fecha_entrega, calificacion_maxima, url_archivo]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al crear asignación:', error);
        res.status(500).json({ error: 'Error al crear asignación' });
    }
};


exports.obtenerAsignacionesPorClase = async (req, res) => {
    const { idClase } = req.params;

    try {
        const result = await query(
            `SELECT * FROM ASIGNACIONES WHERE ID_CLASE = $1 ORDER BY FECHA_ENTREGA ASC`,
            [idClase]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener asignaciones:', error);
        res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
};

exports.obtenerAsignacionPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            `SELECT * FROM ASIGNACIONES WHERE ID_ASIGNACION = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Asignación no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener asignación:', error);
        res.status(500).json({ error: 'Error al obtener asignación' });
    }
};

exports.editarAsignacion = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha_entrega, calificacion_maxima, url_archivo } = req.body;

    try {
        const result = await query(
            `UPDATE ASIGNACIONES 
            SET TITULO = $1, DESCRIPCION = $2, FECHA_ENTREGA = $3, 
                CALIFICACION_MAXIMA = $4, URL_ARCHIVO = $5 
            WHERE ID_ASIGNACION = $6 RETURNING *`,
            [titulo, descripcion, fecha_entrega, calificacion_maxima, url_archivo, id]
        );

        res.status(200).json({ mensaje: 'Asignación actualizada', asignacion: result.rows[0] });
    } catch (error) {
        logger.error('Error al editar asignación:', error);
        res.status(500).json({ error: 'Error al editar asignación' });
    }
};

exports.eliminarAsignacion = async (req, res) => {
    const { id } = req.params;

    try {
        await query(`DELETE FROM ASIGNACIONES WHERE ID_ASIGNACION = $1`, [id]);
        res.status(200).json({ mensaje: 'Asignación eliminada' });
    } catch (error) {
        logger.error('Error al eliminar asignación:', error);
        res.status(500).json({ error: 'Error al eliminar asignación' });
    }
};


// Obtener asignaciones por profesor
exports.obtenerAsignacionesPorProfesor = async (req, res) => {
    const { idProfesor } = req.params;

    try {
        const result = await query(
            `SELECT * FROM ASIGNACIONES WHERE ID_PROFESOR = $1 ORDER BY FECHA_ENTREGA ASC`,
            [idProfesor]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener asignaciones por profesor:', error);
        res.status(500).json({ error: 'Error al obtener asignaciones por profesor' });
    }
};

