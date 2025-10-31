const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15d' });
}

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed: Token format is incorrect' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Authentication failed: Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
}

function validateRole(...roles) {
    return (req, res, next) => {
        const role = req.headers['x-role'];
        console.log(roles, role)
        if (!roles.includes(role)) {
            return res.status(403).json({ message: 'Authorization failed: Role not authorized' });
        }
        next();
    }
}

module.exports = {
    generateToken,
    validateToken,
    validateRole
};
