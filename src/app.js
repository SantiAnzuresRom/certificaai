require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
// const db = require('./config/db');
const app = express();

app.get('/', (req, res) => {
    res.send('✅ Backend XLearning funcionando');
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('✅ Backend XLearning funcionando en Render');
});


// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const claseRoutes = require('./routes/claseRoutes');
const estudianteClaseRoutes = require('./routes/estudianteClaseRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const participacionRoutes = require('./routes/participacionRoutes');
const asignacionRoutes = require('./routes/asignacionRoutes');
const cuadroHonorRoutes = require('./routes/cuadroHonorRoutes');
const anuncioRoutes = require ('./routes/anuncioRoutes')
const entregaRoutes = require ('./routes/entregaRoutes');
const calificacionRoutes = require ('./routes/calificacionRoutes');
const recompensaRoutes = require ('./routes/recompensaRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const asistenciaEventoRoutes = require('./routes/asistenciaEventoRoutes');
const certificacionRoutes = require('./routes/certificacionRoutes');
const vistaRoutes = require('./routes/vistaRoutes');
const canjeRoutes = require('./routes/canjeRoutes');
const usuarioTokensRoutes = require('./routes/usuarioTokensRoutes');
const felicitacionesRoutes = require('./routes/felicitacionesRoutes');
const gestionUsuarioRoutes = require('./routes/gestionUsuariosRoutes');
const gestionParticipacionRoutes = require('./routes/gestionParticipacionRoutes');
const gestionRecompensasRoutes = require('./routes/gestionRecompensasRoutes');
const gestionAsistenciaRoutes = require('./routes/gestionAsistenciaRoutes');
const gestionAsistenciaEventosRoutes = require('./routes/gestionAsistenciaEventosRoutes');
const gestionTokensRoutes = require('./routes/gestionTokensRoutes');
const gestionEventoRoutes = require('./routes/gestionEventoRoutes');
const gestionAnuncioRoutes = require('./routes/gestionAnuncioRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const insigniasRoutes = require('./routes/insigniasRoutes');
const vistaParticipacionesRoutes = require('./routes/participacionesVistaRoutes');



// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/estudiantes-clases', estudianteClaseRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/participaciones', participacionRoutes);
app.use('/api/asignaciones', asignacionRoutes);
app.use('/api/cuadro-honor', cuadroHonorRoutes);
app.use('/api/anuncios', anuncioRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/recompensas', recompensaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/asistencia-eventos', asistenciaEventoRoutes);
app.use('/api/certificaciones', certificacionRoutes);
app.use('/api/vistas', vistaRoutes);
app.use('/api/canjes', canjeRoutes);
app.use('/api/usuario-tokens', usuarioTokensRoutes);
app.use('/api/felicitaciones', felicitacionesRoutes);
app.use('/api/usuarios', gestionUsuarioRoutes);
app.use('/api/gestion-participacion', gestionParticipacionRoutes);
app.use('/api/gestion-recompensas', gestionRecompensasRoutes);
app.use('/api/gestion-asistencia', gestionAsistenciaRoutes);
app.use('/api/gestion-asistencia-eventos', gestionAsistenciaEventosRoutes);
app.use('/api/gestion-tokens', gestionTokensRoutes);
app.use('/api/gestion-evento', gestionEventoRoutes);
app.use('/api/gestion-anuncio', gestionAnuncioRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/insignias', insigniasRoutes);
app.use('/api/participaciones-vista', vistaParticipacionesRoutes);



// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
