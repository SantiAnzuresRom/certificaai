const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.getClase = async (req, res) => {
    // Implementacion para el GET /clases/
    try{
        // Aqui hacemos la consulta para que nos devuelva todas las clases la base de datos
        const result =  await query('SELECT * FROM CLASES');
        // Si la consulta se realizo correctamente devolveremos todas las clases
        res.status(200).json(result.rows);
        
    } catch (error) {
        // Si la consulta falla devolveremos un error
        logger.error('Error al obtener cursos: ', error);
        res.status(500).json({ error: 'Error al obtener cursos' });

    }
};

exports.getClaseId = async (req, res) => {
    // Implementacion para el GET /clases/{id}
    // Obtenemos el id de la clase que se esta buscando
    const { id } = req.params;
    try {
        // Hacemos la consulta para obtener la clase con el id que se esta buscando
        const result = await query('SELECT * FROM CLASES WHERE ID_CLASE = $1', [id]);
        if(result.rows.length > 0) {
            // Si la clase existe la devolvemos
            res.status(200).json(result.rows[0]);
        } else {
            // Si la clase no existe devolvemos un error
            res.status(404).json({ error: 'Clase no encontrada'});
        }
    } catch (error) {
        // Si la consulta falla devolvemos un error
        logger.error('Error al obtener clase por ID: ', error);
        res.status(500).json({ error: 'Error al obtener clase por ID: ' + id });

    }
};

exports.postClase = async (req, res) => {
    // Implementacion para el POST /clases/
    // Obtenemos los datos de la clase que se esta creando
    const { nombre, id_profesor, nivel_academico} = req.body;

    try {
        // Hacemos la consulta para crear la clase con los datos que nos debieron haber pasado
        const { rows } = await query(
            'INSERT INTO CLASES (NOMBRE, ID_PROFESOR, NIVEL_ACADEMICO) VALUES ($1, $2, $3) RETURNING *',
            [nombre, id_profesor, nivel_academico]
        );
        // Si la clase se creo correctamente la devolvemos
        res.status(201).json(rows[0]);

    } catch (error) {
        // Si la consulta falla devolvemos un error
        console.error('Error en registrar la calse: ', error);
        res.status(500).json({ error: 'Error interno del servidor'})

    }
};

exports.putClase = async (req, res) => {
    // Implementacion para el PUT /clases/:id
    // Obtenemos el id de la clase que se esta actualizando
    const { id } = req.params;
    // Obtenemos los datos de la clase que se esta actualizando
    const { nombre, id_profesor, nivel_academico } = req.body;
    try {
        // Hacemos la consulta para actualizar la clase con los datos que nos debieron haber pasado
       const result = await query(
        `UPDATE CLASES SET NOMBRE = $1, ID_PROFESOR = $2, NIVEL_ACADEMICO = $3 WHERE ID_CLASE = $4`,
         [nombre, id_profesor, nivel_academico, id]
        );

        // Si la clase se actualizo correctamente la devolvemos
        const claseActualizada = await query('SELECT * FROM CLASES WHERE ID_CLASE = $1', [id]);
        res.status(200).json({ mensaje: 'Clase actualizada', clase: claseActualizada.rows[0] });
        
    } catch (error) {
        // Si la consulta falla devolvemos un error
        logger.error('Error al actualizar clase: ', error);
        res.status(500).json({ error: 'Error al actualizar la clase' });
    }
};


// Obtener clases por profesor
exports.getClasesPorProfesor = async (req, res) => {
    const { idProfesor } = req.params;

    try {
        const result = await query(
            'SELECT * FROM CLASES WHERE ID_PROFESOR = $1 ORDER BY FECHA_CREACION DESC',
            [idProfesor]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener clases por profesor:', error);
        res.status(500).json({ error: 'Error al obtener clases del profesor' });
    }
};


// Obtener clases por estudiante
exports.getClasesByEstudianteId = async (req, res) => {
    const { idEstudiante } = req.params;
    try {
        const result = await query(
            `SELECT C.*
             FROM ESTUDIANTES_CLASES EC
             JOIN CLASES C ON EC.ID_CLASE = C.ID_CLASE
             WHERE EC.ID_ESTUDIANTE = $1`,
            [idEstudiante]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error('Error al obtener clases del estudiante: ', error);
        res.status(500).json({ error: 'Error al obtener clases del estudiante' });
    }
};


// proximo DELETE clase
// exports.deletClase = async (req, res) => {
//     // Implementacion para el DELETE /clases/:id
//     // Obtenemos el id de la clase que se esta eliminando
//     const { id } = req.params;
//     try {
//         // Hacemos la consulta para eliminar la clase con el id que nos pasaron
//         const result = await query('DELETE FROM CLASES WHERE ID_CLASE = $1', [id]);

//         const claseEliminada = await query('SELECT * FROM CLASES WHERE ID_CLASE = $1', [id]);
//         res.status(200).json({ mensaje: 'Clase eliminada con exito, con id: ', id, clase: claseEliminada.result})
//     } catch (error) {
//         // Si la consulta falla devolvemos un error
//         logger.error('Error al eliminar clase: ', error);
//         res.statur(500).json({ error: 'Error al eliminar la clase'});
//     }
// }


