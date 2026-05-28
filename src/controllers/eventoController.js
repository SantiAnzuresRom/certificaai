const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.crearEvento = async (req, res) => {
    const {
        titulo,
        descripcion,
        tiempo_inicio,
        tiempo_termino,
        id_clase,
        creado_por,
        tokens_otorgados,
        url_evento
    } = req.body;

    try {
        const { rows } = await query(
            `INSERT INTO EVENTOS (TITULO, DESCRIPCION, TIEMPO_INICIO, TIEMPO_TERMINO, ID_CLASE, CREADO_POR, TOKENS_OTORGADOS, URL_EVENTO)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                titulo,
                descripcion,
                tiempo_inicio,
                tiempo_termino,
                id_clase,
                creado_por,
                tokens_otorgados || 0,
                url_evento || null
            ]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error al crear evento' });
    }
};


// Obtener todos
exports.obtenerEventos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM EVENTOS ORDER BY TIEMPO_INICIO DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
};

// Obtener por clase
exports.obtenerEventosPorClase = async (req, res) => {
    const { idClase } = req.params;

    try {
        const result = await query(
            'SELECT * FROM EVENTOS WHERE ID_CLASE = $1 ORDER BY TIEMPO_INICIO DESC',
            [idClase]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener eventos por clase:', error);
        res.status(500).json({ error: 'Error al obtener eventos por clase' });
    }
};

// Obtener por ID
exports.obtenerEventoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query('SELECT * FROM EVENTOS WHERE ID_EVENTO = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener evento:', error);
        res.status(500).json({ error: 'Error al obtener evento' });
    }
};


// Obtener eventos por el ID del creador (profesor)
exports.obtenerEventosPorCreador = async (req, res) => {
    const { idCreador } = req.params;

    try {
        const result = await query(
            'SELECT * FROM EVENTOS WHERE CREADO_POR = $1 ORDER BY TIEMPO_INICIO DESC',
            [idCreador]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener eventos por creador:', error);
        res.status(500).json({ error: 'Error al obtener eventos por creador' });
    }
};



// Editar
exports.editarEvento = async (req, res) => {
    const { id } = req.params;
    const {
        titulo,
        descripcion,
        tiempo_inicio,
        tiempo_termino,
        tokens_otorgados,
        url_evento
    } = req.body;

    try {
        const result = await query(
            `UPDATE EVENTOS 
             SET TITULO = $1,
                 DESCRIPCION = $2,
                 TIEMPO_INICIO = $3,
                 TIEMPO_TERMINO = $4,
                 TOKENS_OTORGADOS = $5,
                 URL_EVENTO = $6
             WHERE ID_EVENTO = $7 RETURNING *`,
            [
                titulo,
                descripcion,
                tiempo_inicio,
                tiempo_termino,
                tokens_otorgados,
                url_evento || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json({ mensaje: 'Evento actualizado', evento: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar evento:', error);
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
};


// Eliminar
exports.eliminarEvento = async (req, res) => {
    const { id } = req.params;

    try {
        await query('DELETE FROM EVENTOS WHERE ID_EVENTO = $1', [id]);
        res.status(200).json({ mensaje: 'Evento eliminado' });
    } catch (error) {
        logger.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error al eliminar evento' });
    }
};
