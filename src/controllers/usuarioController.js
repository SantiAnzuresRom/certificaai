const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const logger = require('../utils/logger');

exports.getUsuario = async (req, res) => {
    try{
        // aqui va la logica para obtener a todos los usuarios
        const result = await query('SELECT * FROM USUARIOS');
        // esta es la respuesta que nos va a arrojar
        res.status(200).json(result.rows);
    } catch (error) {
        // si hay un error, lo vamos a capturar y enviar una respuesta con el error
        logger.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.getUsuarioId = async (req, res) => {
    // Implementacion para GET /usuario/{id}
    // aqui va la logica para obtener a un usuario por id
    const { id } = req.params;
    try {
        // aqui es donde hacemos una consulta a la base de datos a traves de un query
        const result = await query('SELECT * FROM USUARIOS WHERE ID_USUARIO = $1', [id]);
        if (result.rows.length > 0) {
            // si el usuario existe, lo vamos a enviar en la respuesta
            res.status(200).json(result.rows[0]);
        } else {
            // si el usuario no existe, vamos a enviar un mensaje de error
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        // si hay un error, lo vamos a capturar y enviar una respuesta con el error
        logger.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario por ID: ' + id });
    }
};

exports.updateUsuario = async (req, res) => {
    // Implementacion para PUT /usuario/{id}

    // Primero obtenemos el usuario que se quiere actualizar atraves del id como constante
    const { id } = req.params;
    
    // Luego aqui ponemos los datos que solicitamos para que actualice (es necesario que el cuerpo json lleve todos estos)
    const { email, contrasena, nombre, apellidos, tipo_usuario, telefono, matricula } = req.body;
    try {
        // Validamos que el usuario exista y hacemos un hash de la contrasenia con la libreria de bcrypt
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Actualizamos el usuario
        const result = await query(
            `UPDATE USUARIOS SET EMAIL = $1, CONTRASENA = $2, NOMBRE = $3, APELLIDOS = $4, TIPO_USUARIO = $5, TELEFONO = $6, MATRICULA = $7 WHERE ID_USUARIO = $8`,
            [email, hashedPassword, nombre, apellidos, tipo_usuario, telefono, matricula, id]
        )
        // Si el usuario se actualizo correctamente, devolvemos un 200
        const usuarioActualizado = await query('SELECT * FROM USUARIOS WHERE ID_USUARIO = $1', [id]);
        res.status(200).json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado.rows[0] });

    } catch (error) {
        // Si hay un error, lo mandamos a la consola y devolvemos un 500
        logger.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

exports.getClasesEstudiante = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            `SELECT 
                C.ID_CLASE,
                C.NOMBRE AS NOMBRE_CLASE,
                C.NIVEL_ACADEMICO,
                C.FECHA_CREACION,
                U_PROF.NOMBRE || ' ' || U_PROF.APELLIDOS AS NOMBRE_PROFESOR,
                EC.FECHA_INSCRIPCION
            FROM ESTUDIANTES_CLASES EC
            JOIN CLASES C ON EC.ID_CLASE = C.ID_CLASE
            JOIN USUARIOS U_PROF ON C.ID_PROFESOR = U_PROF.ID_USUARIO
            WHERE EC.ID_ESTUDIANTE = $1`,
            [id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener clases del estudiante:', error);
        res.status(500).json({ error: 'Error al obtener clases del estudiante' });
    }
};
