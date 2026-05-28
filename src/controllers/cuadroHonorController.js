const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.obtenerCuadroHonorGeneral = async (req, res) => {
    try {
        const result = await query(`
            SELECT *, RANK() OVER (ORDER BY promedio_general DESC) AS posicion
            FROM VISTA_CUADRO_HONOR_GENERAL
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener cuadro de honor general:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.obtenerCuadroHonorPorClase = async (req, res) => {
    const { id_clase } = req.params;
    try {
        const result = await query(`
            SELECT *, RANK() OVER (ORDER BY promedio_clase DESC) AS posicion
            FROM VISTA_CUADRO_HONOR_CLASE
            WHERE id_clase = $1
        `, [id_clase]);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener cuadro de honor por clase:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
