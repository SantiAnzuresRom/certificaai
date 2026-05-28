const { query } = require('../config/db');
const logger = require('../utils/logger');

//
// RESUMEN ACADEMICO
//
exports.obtenerResumenAcademico = async (req, res) => {
    const { idUsuario, idClase } = req.params;

    try {
        let sql = 'SELECT * FROM VISTA_RESUMEN_ESTUDIANTE';
        const params = [];

        if (idUsuario && idClase) {
            sql += ' WHERE ID_USUARIO = $1 AND ID_CLASE = $2';
            params.push(idUsuario, idClase);
        } else if (idUsuario) {
            sql += ' WHERE ID_USUARIO = $1';
            params.push(idUsuario);
        } else if (idClase) {
            sql += ' WHERE ID_CLASE = $1';
            params.push(idClase);
        }

        const result = await query(sql, params);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error al obtener resumen academico' });
    }
};

//
// ASISTENCIAS DETALLADAS
//
exports.obtenerAsistenciasDetalladas = async (req, res) => {
    const { idClase } = req.params;

    try {
        let sql = 'SELECT * FROM VISTA_ASISTENCIAS_DETALLADAS';
        const params = [];
        if (idClase) {
            sql += ' WHERE CLASE = (SELECT NOMBRE FROM CLASES WHERE ID_CLASE = $1)';
            params.push(idClase);
        }

        const result = await query(sql, params);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error al obtener asistencias detalladas' });
    }
};

//
// EVENTOS CON ASISTENCIA
//
exports.obtenerEventosConAsistencia = async (req, res) => {
    const { idClase } = req.params;

    try {
        let sql = 'SELECT * FROM VISTA_EVENTOS_ASISTENCIA';
        const params = [];
        if (idClase) {
            sql += ' WHERE CLASE = (SELECT NOMBRE FROM CLASES WHERE ID_CLASE = $1)';
            params.push(idClase);
        }

        const result = await query(sql, params);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error al obtener eventos con asistencia' });
    }
};

//
// CUADRO DE HONOR GENERAL
//
exports.obtenerCuadroHonorGeneral = async (req, res) => {
    try {
        const result = await query('SELECT * FROM VISTA_CUADRO_HONOR_GENERAL');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error al obtener cuadro de honor general' });
    }
};

//
// CUADRO DE HONOR POR CLASE
//
exports.obtenerCuadroHonorPorClase = async (req, res) => {
    const { idClase } = req.params;

    try {
        const result = await query(
            'SELECT * FROM VISTA_CUADRO_HONOR_CLASE WHERE ID_CLASE = $1',
            [idClase]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error al obtener cuadro de honor por clase' });
    }
};
