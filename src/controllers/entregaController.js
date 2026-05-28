const { query } = require('../config/db');
const logger = require('../utils/logger');

// POST
exports.subirEntrega = async (req, res) => {
    const { id_asignacion, id_estudiante, url_entrega } = req.body;

    try {
        // Validar entrega duplicada (opcional)
        const yaEntrego = await query(
            `SELECT * FROM ENTREGAS_ASIGNACIONES 
             WHERE ID_ASIGNACION = $1 AND ID_ESTUDIANTE = $2`,
            [id_asignacion, id_estudiante]
        );

        if (yaEntrego.rows.length > 0) {
            return res.status(409).json({ error: 'Entrega ya registrada para esta asignación' });
        }

        // Registrar entrega
        const { rows } = await query(
            `INSERT INTO ENTREGAS_ASIGNACIONES (ID_ASIGNACION, ID_ESTUDIANTE, URL_ENTREGA) 
             VALUES ($1, $2, $3) RETURNING *`,
            [id_asignacion, id_estudiante, url_entrega]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al subir entrega:', error);
        res.status(500).json({ error: 'Error al subir entrega' });
    }
};

// GET todas
exports.obtenerTodasEntregas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM ENTREGAS_ASIGNACIONES ORDER BY FECHA_ENTREGA DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas:', error);
        res.status(500).json({ error: 'Error al obtener entregas' });
    }
};

// GET por estudiante
exports.obtenerPorEstudiante = async (req, res) => {
    const { idEstudiante } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ENTREGAS_ASIGNACIONES 
             WHERE ID_ESTUDIANTE = $1 ORDER BY FECHA_ENTREGA DESC`,
            [idEstudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas del estudiante:', error);
        res.status(500).json({ error: 'Error al obtener entregas del estudiante' });
    }
};

// GET por asignación
exports.obtenerPorAsignacion = async (req, res) => {
    const { idAsignacion } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ENTREGAS_ASIGNACIONES 
             WHERE ID_ASIGNACION = $1 ORDER BY FECHA_ENTREGA DESC`,
            [idAsignacion]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas por asignación:', error);
        res.status(500).json({ error: 'Error al obtener entregas por asignación' });
    }
};

// GET por clase
exports.obtenerPorClase = async (req, res) => {
    const { idClase } = req.params;
    try {
        const result = await query(
            `SELECT ea.* 
             FROM ENTREGAS_ASIGNACIONES ea
             INNER JOIN ASIGNACIONES a ON ea.ID_ASIGNACION = a.ID_ASIGNACION
             WHERE a.ID_CLASE = $1
             ORDER BY ea.FECHA_ENTREGA DESC`,
            [idClase]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas por clase:', error);
        res.status(500).json({ error: 'Error al obtener entregas por clase' });
    }
};

// GET por clase y asignación
exports.obtenerPorClaseYAsignacion = async (req, res) => {
    const { idClase, idAsignacion } = req.params;

    try {
        const result = await query(
            `SELECT ea.* 
             FROM ENTREGAS_ASIGNACIONES ea
             INNER JOIN ASIGNACIONES a ON ea.ID_ASIGNACION = a.ID_ASIGNACION
             WHERE a.ID_CLASE = $1 AND ea.ID_ASIGNACION = $2
             ORDER BY ea.FECHA_ENTREGA DESC`,
            [idClase, idAsignacion]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener entregas por clase y asignación:', error);
        res.status(500).json({ error: 'Error al obtener entregas por clase y asignación' });
    }
};


exports.obtenerResumenEntregasPorClase = async (req, res) => {
    const { idClase } = req.params;

    try {
        const result = await query(
            `SELECT 
                u.id_usuario AS id_estudiante,
                u.nombre,
                u.apellidos,
                c.id_clase,
                c.nombre AS clase,
                a.id_asignacion,
                a.titulo AS actividad,
                ea.id_entrega IS NOT NULL AS entregado,
                cal.calificacion,
                cal.valor_tokens
            FROM ESTUDIANTES_CLASES ec
            JOIN USUARIOS u ON ec.id_estudiante = u.id_usuario
            JOIN CLASES c ON ec.id_clase = c.id_clase
            JOIN ASIGNACIONES a ON c.id_clase = a.id_clase
            LEFT JOIN ENTREGAS_ASIGNACIONES ea 
                ON a.id_asignacion = ea.id_asignacion AND ea.id_estudiante = u.id_usuario
            LEFT JOIN CALIFICACIONES cal 
                ON a.id_asignacion = cal.id_asignacion AND cal.id_estudiante = u.id_usuario
            WHERE c.id_clase = $1
            ORDER BY u.apellidos, u.nombre, a.fecha_entrega`,
            [idClase]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener resumen de entregas por clase:', error);
        res.status(500).json({ error: 'Error al obtener resumen' });
    }
};




// DELETE
exports.eliminarEntrega = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM ENTREGAS_ASIGNACIONES WHERE ID_ENTREGA = $1', [id]);
        res.status(200).json({ mensaje: 'Entrega eliminada' });
    } catch (error) {
        logger.error('Error al eliminar entrega:', error);
        res.status(500).json({ error: 'Error al eliminar entrega' });
    }
};


exports.actualizarUrlEntrega = async (req, res) => {
    const { id } = req.params;
    const { url_entrega } = req.body;

    try {
        const result = await query(
            `UPDATE ENTREGAS_ASIGNACIONES 
             SET URL_ENTREGA = $1, FECHA_ENTREGA = NOW()
             WHERE ID_ENTREGA = $2 RETURNING *`,
            [url_entrega, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entrega no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Entrega actualizada correctamente',
            entrega: result.rows[0]
        });

    } catch (error) {
        logger.error('Error al actualizar URL de entrega:', error);
        res.status(500).json({ error: 'Error al actualizar la entrega' });
    }
};
