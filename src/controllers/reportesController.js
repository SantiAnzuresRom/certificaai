const { query } = require('../config/db');
const logger = require('../utils/logger');

// Procedimiento: Obtener promedio de asistencia por clase y opcionalmente por día (GET)
exports.promedioAsistencia = async (req, res) => {
    try {
        const { id_clase } = req.params; // <-- ahora viene de la URL
        const { fecha } = req.query; // <-- fecha sigue viniendo como query param opcional

        if (!id_clase) {
            return res.status(400).json({ error: 'El campo id_clase es requerido en la URL' });
        }

        const sql = `
            SELECT * FROM obtener_promedio_asistencia($1, $2)
        `;

        const { rows } = await query(sql, [id_clase, fecha || null]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'No hay registros de asistencia para los parámetros indicados' });
        }

        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error al obtener promedio de asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener reporte de asistencia a un evento
exports.obtenerReporteAsistenciaEvento = async (req, res) => {
    try {
        const { idEvento } = req.params;

        if (!idEvento) {
            return res.status(400).json({ error: 'El campo idEvento es requerido en la URL' });
        }

        const { rows } = await query(
            'SELECT * FROM obtener_reporte_asistencia_evento($1)',
            [idEvento]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron registros para este evento' });
        }

        res.json(rows[0]);
    } catch (error) {
        logger.error('Error al obtener reporte de asistencia a evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



// Obtener conteo de usuarios por tipo
exports.reporteUsuariosPorTipo = async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) AS total_usuarios,
                SUM(CASE WHEN TIPO_USUARIO = 'ADMINISTRADOR' THEN 1 ELSE 0 END) AS administradores,
                SUM(CASE WHEN TIPO_USUARIO = 'ESTUDIANTE' THEN 1 ELSE 0 END) AS estudiantes,
                SUM(CASE WHEN TIPO_USUARIO = 'PROFESOR' THEN 1 ELSE 0 END) AS profesores
            FROM USUARIOS;
        `;

        const { rows } = await query(sql);

        res.status(200).json(rows[0]);
    } catch (error) {
        logger.error('Error al obtener reporte de usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Obtener reporte de recompensas
exports.reporteRecompensas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                (SELECT COUNT(*) FROM RECOMPENSAS) AS total_recompensas,
                (SELECT COUNT(*) FROM RECOMPENSAS WHERE ACTIVO = TRUE) AS recompensas_disponibles,
                (SELECT COUNT(*) FROM CANJE_RECOMPENSAS) AS total_canjeadas,
                (SELECT COUNT(*) FROM CANJE_RECOMPENSAS WHERE ESTADO = 'ENTREGADO') AS entregadas,
                (SELECT COUNT(*) FROM CANJE_RECOMPENSAS WHERE ESTADO = 'PENDIENTE') AS pendientes,
                (SELECT COUNT(*) FROM CANJE_RECOMPENSAS WHERE ESTADO = 'CANCELADO') AS canceladas
        `;

        const { rows } = await query(sql);

        res.status(200).json(rows[0]);
    } catch (error) {
        logger.error('Error al obtener reporte de recompensas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Reporte de eventos por mes (por defecto mes actual)
exports.reporteEventosPorMes = async (req, res) => {
    try {
        let { mes, anio } = req.query; // se reciben como parámetros de consulta

        const fechaActual = new Date();
        mes = mes ? parseInt(mes) : fechaActual.getMonth() + 1; // 1-12
        anio = anio ? parseInt(anio) : fechaActual.getFullYear();

        const sql = `
            SELECT 
                COUNT(*) AS total_eventos,
                ARRAY_AGG(JSON_BUILD_OBJECT(
                    'id_evento', ID_EVENTO,
                    'titulo', TITULO,
                    'descripcion', DESCRIPCION,
                    'tiempo_inicio', TIEMPO_INICIO,
                    'tiempo_termino', TIEMPO_TERMINO,
                    'id_clase', ID_CLASE,
                    'tokens_otorgados', TOKENS_OTORGADOS
                )) AS eventos
            FROM EVENTOS
            WHERE EXTRACT(MONTH FROM TIEMPO_INICIO) = $1
            AND EXTRACT(YEAR FROM TIEMPO_INICIO) = $2
        `;

        const { rows } = await query(sql, [mes, anio]);

        res.status(200).json({
            mes,
            anio,
            total_eventos: parseInt(rows[0].total_eventos, 10),
            eventos: rows[0].eventos || []
        });
    } catch (error) {
        logger.error('Error al obtener reporte de eventos por mes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Reporte de total de insignias
exports.reporteTotalInsignias = async (req, res) => {
    try {
        const sqlTotal = `
            SELECT COUNT(*) AS total_insignias
            FROM CERTIFICACIONES
        `;

        const sqlPorUsuario = `
            SELECT 
                U.ID_USUARIO,
                U.NOMBRE,
                U.APELLIDOS,
                COUNT(C.ID_CERTIDICADO) AS total_insignias
            FROM CERTIFICACIONES C
            JOIN USUARIOS U ON C.ID_USUARIO = U.ID_USUARIO
            GROUP BY U.ID_USUARIO, U.NOMBRE, U.APELLIDOS
            ORDER BY total_insignias DESC
        `;

        const sqlPorTitulo = `
            SELECT 
                TITULO,
                COUNT(*) AS total_otorgadas
            FROM CERTIFICACIONES
            GROUP BY TITULO
            ORDER BY total_otorgadas DESC
        `;

        const [totalRes, porUsuarioRes, porTituloRes] = await Promise.all([
            query(sqlTotal),
            query(sqlPorUsuario),
            query(sqlPorTitulo)
        ]);

        res.status(200).json({
            total_insignias: parseInt(totalRes.rows[0].total_insignias, 10),
            insignias_por_usuario: porUsuarioRes.rows,
            insignias_por_titulo: porTituloRes.rows
        });
    } catch (error) {
        logger.error('Error al obtener reporte de insignias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// Reporte de clases con profesor y total de alumnos
exports.reporteClases = async (req, res) => {
    try {
        // Total de clases
        const totalClasesQuery = `
            SELECT COUNT(*) AS total_clases
            FROM CLASES
        `;

        // Lista de clases con profesor y número de alumnos
        const clasesDetalleQuery = `
            SELECT 
                C.ID_CLASE,
                C.NOMBRE AS nombre_clase,
                U.NOMBRE || ' ' || U.APELLIDOS AS profesor,
                COUNT(EC.ID_ESTUDIANTE) AS total_alumnos
            FROM CLASES C
            JOIN USUARIOS U ON C.ID_PROFESOR = U.ID_USUARIO
            LEFT JOIN ESTUDIANTES_CLASES EC ON C.ID_CLASE = EC.ID_CLASE
            GROUP BY C.ID_CLASE, C.NOMBRE, U.NOMBRE, U.APELLIDOS
            ORDER BY C.NOMBRE
        `;

        const [totalRes, detalleRes] = await Promise.all([
            query(totalClasesQuery),
            query(clasesDetalleQuery)
        ]);

        res.status(200).json({
            total_clases: parseInt(totalRes.rows[0].total_clases, 10),
            detalle_clases: detalleRes.rows
        });
    } catch (error) {
        logger.error('Error al obtener reporte de clases:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
