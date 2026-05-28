const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token){
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

const checkRole = (role) => (req, res, next) => {
    if (!roles.includes(req.user.tipo_usuario)) {
        return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
    }
    next();
};

module.exports = { authenticateJWT, checkRole };