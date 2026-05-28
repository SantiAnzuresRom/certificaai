const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// GET: Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM USUARIOS ORDER BY ID_USUARIO');
    res.status(200).json(rows);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// GET: Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query('SELECT * FROM USUARIOS WHERE ID_USUARIO = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    logger.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// POST: Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { email, contrasena, nombre, apellidos, tipo_usuario, telefono, matricula } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    const { rows } = await query(
      `INSERT INTO USUARIOS (EMAIL, CONTRASENA, NOMBRE, APELLIDOS, TIPO_USUARIO, TELEFONO, MATRICULA)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [email, contrasenaHash, nombre, apellidos, tipo_usuario, telefono, matricula]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    logger.error('Error al crear usuario:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'El correo o la matrícula ya están registrados' });
    } else {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }
};

// PUT: Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, contrasena, nombre, apellidos, tipo_usuario, telefono, matricula } = req.body;

  try {
    const { rows } = await query(
      `UPDATE USUARIOS SET 
        EMAIL = $1,
        CONTRASENA = $2, 
        NOMBRE = $3, 
        APELLIDOS = $4, 
        TIPO_USUARIO = $5, 
        TELEFONO = $6, 
        MATRICULA = $7,
        FECHA_ACTUALIZACION = NOW()
       WHERE ID_USUARIO = $8 RETURNING *`,
      [email, contrasena, nombre, apellidos, tipo_usuario, telefono, matricula, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado', usuario: rows[0] });
  } catch (error) {
    logger.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// PUT Actualizar contraseña de usuario
exports.actualizarContrasena = async (req, res) => {
  const { id } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nuevaContrasena, salt);

    const result = await query(
      `UPDATE USUARIOS SET CONTRASENA = $1, FECHA_ACTUALIZACION = NOW() WHERE ID_USUARIO = $2 RETURNING *`,
      [hash, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    logger.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};


// GET: Verificar si un usuario tiene fecha de cumpleaños registrada
exports.verificarCumpleanios = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await query(
      `SELECT FECHA_CUMPLE 
       FROM FELICITACIONES_USUARIOS 
       WHERE ID_USUARIO = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(200).json({
        tieneCumpleanios: false,
        mensaje: 'El usuario no tiene registrada su fecha de cumpleaños'
      });
    }

    res.status(200).json({
      tieneCumpleanios: true,
      fechaCumple: rows[0].fecha_cumple
    });

  } catch (error) {
    logger.error('Error al verificar cumpleaños:', error);
    res.status(500).json({ error: 'Error al verificar cumpleaños' });
  }
};
