const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear evento
exports.crearEvento = async (req, res) => {
    const { titulo, descripcion, tiempo_inicio, tiempo_termino, id_clase, creado_por, tokens_otorgados } = req.body;

    if (!titulo || !tiempo_inicio || !tiempo_termino || !id_clase) {
        return res.status(400).json({ error: 'Título, fecha de inicio, fecha de término e ID de clase son obligatorios' });
    }

    try {
        const { rows } = await query(
            `INSERT INTO EVENTOS (TITULO, DESCRIPCION, TIEMPO_INICIO, TIEMPO_TERMINO, ID_CLASE, CREADO_POR, TOKENS_OTORGADOS)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [titulo, descripcion, tiempo_inicio, tiempo_termino, id_clase, creado_por || null, tokens_otorgados || 0]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error al crear evento' });
    }
};

// Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
    try {
        const { rows } = await query(`SELECT * FROM EVENTOS ORDER BY TIEMPO_INICIO DESC`);
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
};

// Obtener evento por ID
exports.obtenerEventoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await query(`SELECT * FROM EVENTOS WHERE ID_EVENTO = $1`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        logger.error('Error al obtener evento:', error);
        res.status(500).json({ error: 'Error al obtener evento' });
    }
};

// Obtener eventos por clase
exports.obtenerEventosPorClase = async (req, res) => {
    const { id_clase } = req.params;
    try {
        const { rows } = await query(`SELECT * FROM EVENTOS WHERE ID_CLASE = $1 ORDER BY TIEMPO_INICIO DESC`, [id_clase]);
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener eventos por clase:', error);
        res.status(500).json({ error: 'Error al obtener eventos por clase' });
    }
};

// Obtener usuarios inscritos en un evento (asistencia true o false)
exports.obtenerUsuariosPorEvento = async (req, res) => {
    const { id_evento } = req.params;
    try {
        const { rows } = await query(
            `SELECT ae.*, u.nombre, u.apellidos, u.email, u.tipo_usuario
             FROM ASISTENCIA_EVENTOS ae
             JOIN USUARIOS u ON ae.id_usuario = u.id_usuario
             WHERE ae.id_evento = $1`,
            [id_evento]
        );
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener usuarios por evento:', error);
        res.status(500).json({ error: 'Error al obtener usuarios por evento' });
    }
};

// Actualizar evento
exports.editarEvento = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, tiempo_inicio, tiempo_termino, id_clase, tokens_otorgados } = req.body;

    try {
        const { rows } = await query(
            `UPDATE EVENTOS 
             SET TITULO = $1, DESCRIPCION = $2, TIEMPO_INICIO = $3, TIEMPO_TERMINO = $4, ID_CLASE = $5, TOKENS_OTORGADOS = $6
             WHERE ID_EVENTO = $7 RETURNING *`,
            [titulo, descripcion, tiempo_inicio, tiempo_termino, id_clase, tokens_otorgados, id]
        );

        if (rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
        res.status(200).json({ mensaje: 'Evento actualizado', evento: rows[0] });
    } catch (error) {
        logger.error('Error al actualizar evento:', error);
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
};

// Eliminar evento
exports.eliminarEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await query(`DELETE FROM EVENTOS WHERE ID_EVENTO = $1`, [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Evento no encontrado' });
        res.status(200).json({ mensaje: 'Evento eliminado' });
    } catch (error) {
        logger.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error al eliminar evento' });
    }
};
