const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear insignia
exports.crearInsignia = async (req, res) => {
    try {
        const { nombre, descripcion, imagen_url } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }

        const { rows } = await query(
            `INSERT INTO INSIGNIAS (NOMBRE, DESCRIPCION, IMAGEN_URL)
             VALUES ($1, $2, $3) RETURNING *`,
            [nombre, descripcion || null, imagen_url || null]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        logger.error('Error al crear insignia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todas las insignias
exports.obtenerInsignias = async (req, res) => {
    try {
        const { rows } = await query(`SELECT * FROM INSIGNIAS ORDER BY FECHA_CREACION DESC`);
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener insignias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Otorgar una insignia a un estudiante
exports.otorgarInsignia = async (req, res) => {
    try {
        const { id_insignia, id_estudiante } = req.body;

        if (!id_insignia || !id_estudiante) {
            return res.status(400).json({ error: 'id_insignia e id_estudiante son requeridos' });
        }

        const { rows } = await query(
            `INSERT INTO INSIGNIAS_ESTUDIANTE (ID_INSIGNIA, ID_ESTUDIANTE)
             VALUES ($1, $2) RETURNING *`,
            [id_insignia, id_estudiante]
        );

        res.status(201).json({ mensaje: 'Insignia otorgada con éxito', registro: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El estudiante ya tiene esta insignia' });
        }
        logger.error('Error al otorgar insignia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todas las insignias de un estudiante
exports.obtenerInsigniasEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;

        const { rows } = await query(
            `SELECT IE.ID_INSIGNIA_ESTUDIANTE, I.NOMBRE, I.DESCRIPCION, I.IMAGEN_URL, IE.FECHA_OTORGADA
             FROM INSIGNIAS_ESTUDIANTE IE
             JOIN INSIGNIAS I ON IE.ID_INSIGNIA = I.ID_INSIGNIA
             WHERE IE.ID_ESTUDIANTE = $1
             ORDER BY IE.FECHA_OTORGADA DESC`,
            [id_estudiante]
        );

        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener insignias del estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
