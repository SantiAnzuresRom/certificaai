// controllers/gestionTokensController.js
const { query } = require('../config/db');
const logger = require('../utils/logger');

// Crear saldo inicial de tokens para un usuario
exports.crearSaldoTokens = async (req, res) => {
  const { id_usuario, balance } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: 'ID de usuario es requerido' });
  }

  try {
    // Verificar si ya tiene un registro
    const existe = await query(
      `SELECT * FROM USUARIO_TOKENS WHERE ID_USUARIO = $1`,
      [id_usuario]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Este usuario ya tiene un saldo registrado' });
    }

    const result = await query(
      `INSERT INTO USUARIO_TOKENS (ID_USUARIO, BALANCE) VALUES ($1, $2) RETURNING *`,
      [id_usuario, balance || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error al crear saldo de tokens:', error);
    res.status(500).json({ error: 'Error al crear saldo de tokens' });
  }
};

// Obtener todos los saldos de tokens
exports.obtenerTodos = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM USUARIO_TOKENS ORDER BY ID_USUARIO_TOKENS`);
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error al obtener saldos de tokens:', error);
    res.status(500).json({ error: 'Error al obtener saldos' });
  }
};

// Obtener saldo por usuario
exports.obtenerPorUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const result = await query(
      `SELECT * FROM USUARIO_TOKENS WHERE ID_USUARIO = $1`,
      [idUsuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario sin registro de tokens' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    logger.error('Error al obtener saldo del usuario:', error);
    res.status(500).json({ error: 'Error al obtener saldo' });
  }
};

// Editar (actualizar directamente el balance)
exports.editarSaldo = async (req, res) => {
  const { idUsuario } = req.params;
  const { balance } = req.body;

  if (balance === undefined || balance < 0) {
    return res.status(400).json({ error: 'Balance inválido' });
  }

  try {
    const result = await query(
      `UPDATE USUARIO_TOKENS 
       SET BALANCE = $1, ULTIMA_ACTUALIZACION = NOW() 
       WHERE ID_USUARIO = $2 RETURNING *`,
      [balance, idUsuario]
    );

    res.status(200).json({ mensaje: 'Balance actualizado', saldo: result.rows[0] });
  } catch (error) {
    logger.error('Error al actualizar balance:', error);
    res.status(500).json({ error: 'Error al actualizar balance' });
  }
};

// Aumentar tokens
exports.aumentarTokens = async (req, res) => {
  const { idUsuario } = req.params;
  const { cantidad } = req.body;

  if (!cantidad || cantidad < 1) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const result = await query(
      `UPDATE USUARIO_TOKENS 
       SET BALANCE = BALANCE + $1, ULTIMA_ACTUALIZACION = NOW() 
       WHERE ID_USUARIO = $2 RETURNING *`,
      [cantidad, idUsuario]
    );

    res.status(200).json({ mensaje: 'Tokens aumentados', saldo: result.rows[0] });
  } catch (error) {
    logger.error('Error al aumentar tokens:', error);
    res.status(500).json({ error: 'Error al aumentar tokens' });
  }
};

// Disminuir tokens
exports.disminuirTokens = async (req, res) => {
  const { idUsuario } = req.params;
  const { cantidad } = req.body;

  if (!cantidad || cantidad < 1) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const result = await query(
      `UPDATE USUARIO_TOKENS 
       SET BALANCE = BALANCE - $1, ULTIMA_ACTUALIZACION = NOW() 
       WHERE ID_USUARIO = $2 AND BALANCE >= $1
       RETURNING *`,
      [cantidad, idUsuario]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Saldo insuficiente o usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Tokens disminuidos', saldo: result.rows[0] });
  } catch (error) {
    logger.error('Error al disminuir tokens:', error);
    res.status(500).json({ error: 'Error al disminuir tokens' });
  }
};
