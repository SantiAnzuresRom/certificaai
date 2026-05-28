const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.postEstudianteClase = async (req, res) => {
    const { id_clase, id_estudiante } = req.body;
    try {
        const result = await query(
            'INSERT INTO ESTUDIANTES_CLASES (ID_CLASE, ID_ESTUDIANTE) VALUES ($1, $2) RETURNING *',
            [id_clase, id_estudiante]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al agregar estudiante a la clase: ', error);
        res.status(500).json({ error: 'Error al agregar estudiante a la clase' });
    }
};


exports.getEstudiantesClases = async (req, res) => {
    try {
        const result = await query('SELECT * FROM ESTUDIANTES_CLASES');
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener relaciones estudiantes-clases: ', error);
        res.status(500).json({ error: 'Error al obtener relaciones' });
    }
};


exports.getEstudianteClaseById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query('SELECT * FROM ESTUDIANTES_CLASES WHERE ID_ESTUDIANTE_CLASE = $1',
        [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener relación por ID: ', error);
        res.status(500).json({ error: 'Error al obtener relación por ID' });
    }
};



exports.getClasesByEstudianteId = async (req, res) => {
    const { id_estudiante } = req.params;
    try {
        const result = await query(
            'SELECT * FROM ESTUDIANTES_CLASES WHERE ID_ESTUDIANTE = $1',
            [id_estudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener clases del estudiante: ', error);
        res.status(500).json({ error: 'Error al obtener clases del estudiante' });
    }
};


exports.getEstudiantesByClaseId = async (req, res) => {
    const { id_clase } = req.params;
    try {
        const result = await query(
            `SELECT 
                ec.*, 
                u.nombre, 
                u.apellidos 
             FROM ESTUDIANTES_CLASES ec
             JOIN USUARIOS u ON ec.ID_ESTUDIANTE = u.ID_USUARIO
             WHERE ec.ID_CLASE = $1`,
            [id_clase]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener estudiantes de la clase: ', error);
        res.status(500).json({ error: 'Error al obtener estudiantes de la clase' });
    }
};



exports.updateEstudianteClase = async (req, res) => {
    const { id } = req.params;
    const { id_clase, id_estudiante } = req.body;

    try {
        const result = await query(
            'UPDATE ESTUDIANTES_CLASES SET ID_CLASE = $1, ID_ESTUDIANTE = $2 WHERE ID_ESTUDIANTE_CLASE = $3 RETURNING *',
            [id_clase, id_estudiante, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Relación no encontrada para actualizar' });
        }

        res.status(200).json({ mensaje: 'Relación actualizada', relacion: result.rows[0] });
    } catch (error) {
        logger.error('Error al actualizar relación estudiante-clase: ', error);
        res.status(500).json({ error: 'Error al actualizar relación estudiante-clase' });
    }
};
