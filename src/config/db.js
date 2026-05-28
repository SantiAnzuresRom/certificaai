const { Pool } = require('pg');
const { connectionString } = require('pg/lib/defaults.js');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20, // maximo de conexiones en el pool
    idleTimeoutMillis: 30000, // tiempo de espera para liberar conexiones inactivas
    connectionTimeoutMillis: 5000
});

// Verificacion de conexion al iniciar
pool.on('connect', () => console.log('🟢 Conectado a PostgreSQL en Neon.tech'));
pool.on('error', (err) => console.error('🔴 Error de conexion:', err));


module.exports = {
    query: (text, params) => pool.query(text, params),
    pool // Para transacciones avanzadas
};