require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT; // Render asigna el puerto

// Verificar conexión a la DB antes de iniciar
pool.query('SELECT NOW()')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error al conectar a la base de datos:', err);
        process.exit(1); // Terminar proceso si no hay conexión
    });