const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear anuncio
exports.crearAnuncio = async (req, res) => {
    const { id_clase, titulo, descripcion, dirigido_a, importancia } = req.body;

    try {
        const { rows } = await query(
            `INSERT INTO ANUNCIOS (ID_CLASE, TITULO, DESCRIPCION, DIRIGIDO_A, IMPORTANCIA) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                id_clase,
                titulo,
                descripcion,
                dirigido_a?.toUpperCase() || 'TODOS',
                importancia?.toUpperCase() || 'NORMAL'
            ]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear anuncio:', error);
        res.status(500).json({ error: 'Error al crear el anuncio' });
    }
};


// Obtener todos
exports.obtenerTodosAnuncios = async (req, res) => {
    try {
        const result = await query('SELECT * FROM ANUNCIOS ORDER BY FECHA_CREACION DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios:', error);
        res.status(500).json({ error: 'Error al obtener anuncios' });
    }
};

// Obtener por ID
exports.obtenerAnuncioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM ANUNCIOS WHERE ID_ANUNCIO = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener anuncio:', error);
        res.status(500).json({ error: 'Error al obtener anuncio por ID' });
    }
};

// Obtener por clase
exports.obtenerAnunciosPorClase = async (req, res) => {
    const { idClase } = req.params;
    try {
        const result = await query(
            'SELECT * FROM ANUNCIOS WHERE ID_CLASE = $1 ORDER BY FECHA_CREACION DESC',
            [idClase]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por clase:', error);
        res.status(500).json({ error: 'Error al obtener anuncios por clase' });
    }
};

// Obtener por tipo
exports.obtenerAnunciosPorTipo = async (req, res) => {
    const { tipo } = req.params;
    try {
        const result = await query(
            'SELECT * FROM ANUNCIOS WHERE DIRIGIDO_A = $1 ORDER BY FECHA_CREACION DESC',
            [tipo.toUpperCase()]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por tipo:', error);
        res.status(500).json({ error: 'Error al obtener anuncios por tipo' });
    }
};

// Obtener por clase y tipo
exports.obtenerAnunciosPorClaseYTipo = async (req, res) => {
    const { idClase, tipo } = req.params;
    try {
        const result = await query(
            `SELECT * FROM ANUNCIOS WHERE ID_CLASE = $1 AND DIRIGIDO_A = $2 ORDER BY FECHA_CREACION DESC`,
            [idClase, tipo.toUpperCase()]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por clase y tipo:', error);
        res.status(500).json({ error: 'Error al obtener anuncios por clase y tipo' });
    }
};

exports.obtenerAnunciosPorImportancia = async (req, res) => {
    const { importancia } = req.params;
    try {
        const result = await query(
            'SELECT * FROM ANUNCIOS WHERE IMPORTANCIA = $1 ORDER BY FECHA_CREACION DESC',
            [importancia.toUpperCase()]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por importancia:', error);
        res.status(500).json({ error: 'Error al obtener anuncios por importancia' });
    }
};

// Obtener anuncios por clase, tipo y nivel de importancia
exports.obtenerAnunciosPorClaseTipoEImportancia = async (req, res) => {
    const { idClase, tipo, importancia } = req.params;

    try {
        const result = await query(
            `SELECT * FROM ANUNCIOS 
             WHERE ID_CLASE = $1 
             AND DIRIGIDO_A = $2 
             AND IMPORTANCIA = $3
             ORDER BY FECHA_CREACION DESC`,
            [idClase, tipo.toUpperCase(), importancia.toUpperCase()]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener anuncios por clase, tipo e importancia:', error);
        res.status(500).json({ error: 'Error al obtener anuncios con filtros combinados' });
    }
};



// Editar
exports.editarAnuncio = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, dirigido_a, importancia } = req.body;

    try {
        const result = await query(
            `UPDATE ANUNCIOS 
             SET TITULO = $1, DESCRIPCION = $2, DIRIGIDO_A = $3, IMPORTANCIA = $4
             WHERE ID_ANUNCIO = $5 RETURNING *`,
            [
                titulo,
                descripcion,
                dirigido_a?.toUpperCase() || 'TODOS',
                importancia?.toUpperCase() || 'NORMAL',
                id
            ]
        );
        res.status(200).json({ mensaje: 'Anuncio actualizado', anuncio: result.rows[0] });
    } catch (error) {
        logger.error('Error al editar anuncio:', error);
        res.status(500).json({ error: 'Error al editar anuncio' });
    }
};


// Eliminar
exports.eliminarAnuncio = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM ANUNCIOS WHERE ID_ANUNCIO = $1', [id]);
        res.status(200).json({ mensaje: 'Anuncio eliminado' });
    } catch (error) {
        logger.error('Error al eliminar anuncio:', error);
        res.status(500).json({ error: 'Error al eliminar anuncio' });
    }
};
