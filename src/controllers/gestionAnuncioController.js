const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear anuncio
exports.crearAnuncio = async (req, res) => {
    const { id_clase, titulo, descripcion, dirigido_a, importancia } = req.body;

    if (!titulo) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }

    try {
        const { rows } = await query(
            `INSERT INTO ANUNCIOS (ID_CLASE, TITULO, DESCRIPCION, DIRIGIDO_A, IMPORTANCIA)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id_clase || null, titulo, descripcion || null, dirigido_a || 'TODOS', importancia || 'NORMAL']
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear anuncio:', error);
        res.status(500).json({ error: 'Error al crear anuncio' });
    }
};

// Obtener todos los anuncios
exports.obtenerAnuncios = async (req, res) => {
    try {
        const { rows } = await query(`SELECT * FROM ANUNCIOS ORDER BY FECHA_CREACION DESC`);
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener anuncios:', error);
        res.status(500).json({ error: 'Error al obtener anuncios' });
    }
};

// Obtener anuncio por ID
exports.obtenerAnuncioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await query(`SELECT * FROM ANUNCIOS WHERE ID_ANUNCIO = $1`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Anuncio no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        logger.error('Error al obtener anuncio:', error);
        res.status(500).json({ error: 'Error al obtener anuncio' });
    }
};

// Obtener anuncios por clase
exports.obtenerAnunciosPorClase = async (req, res) => {
    const { id_clase } = req.params;
    try {
        const { rows } = await query(`SELECT * FROM ANUNCIOS WHERE ID_CLASE = $1 ORDER BY FECHA_CREACION DESC`, [id_clase]);
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por clase:', error);
        res.status(500).json({ error: 'Error al obtener anuncios por clase' });
    }
};

// Obtener anuncios filtrados por dirigido_a
exports.obtenerAnunciosPorDirigidoA = async (req, res) => {
    const { tipo } = req.params;
    try {
        const { rows } = await query(`SELECT * FROM ANUNCIOS WHERE DIRIGIDO_A = $1 ORDER BY FECHA_CREACION DESC`, [tipo]);
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener anuncios filtrados:', error);
        res.status(500).json({ error: 'Error al obtener anuncios filtrados' });
    }
};

// Actualizar anuncio
exports.editarAnuncio = async (req, res) => {
    const { id } = req.params;
    const { id_clase, titulo, descripcion, dirigido_a, importancia } = req.body;

    try {
        const { rows } = await query(
            `UPDATE ANUNCIOS
             SET ID_CLASE = $1, TITULO = $2, DESCRIPCION = $3, DIRIGIDO_A = $4, IMPORTANCIA = $5
             WHERE ID_ANUNCIO = $6 RETURNING *`,
            [id_clase || null, titulo, descripcion, dirigido_a || 'TODOS', importancia || 'NORMAL', id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Anuncio no encontrado' });
        res.status(200).json({ mensaje: 'Anuncio actualizado', anuncio: rows[0] });
    } catch (error) {
        logger.error('Error al actualizar anuncio:', error);
        res.status(500).json({ error: 'Error al actualizar anuncio' });
    }
};

// Eliminar anuncio
exports.eliminarAnuncio = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await query(`DELETE FROM ANUNCIOS WHERE ID_ANUNCIO = $1`, [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Anuncio no encontrado' });
        res.status(200).json({ mensaje: 'Anuncio eliminado' });
    } catch (error) {
        logger.error('Error al eliminar anuncio:', error);
        res.status(500).json({ error: 'Error al eliminar anuncio' });
    }
};
