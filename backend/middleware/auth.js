const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Expected format: "Bearer <token>"
        const actualToken = token.split(' ')[1] || token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'secret');

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admin role required.' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
