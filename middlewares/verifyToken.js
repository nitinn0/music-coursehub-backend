const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    console.log("Received Token:", token);

    if (!token) {
        return res.status(400).json({ error: 'Access Denied: No token provided' });
    }

    try {
        const bearerToken = token.split(' ')[1]; // Extract token from Bearer <token>
        if (!bearerToken) {
            return res.status(400).json({ error: 'Access Denied: Invalid token format' });
        }

        const decoded = jwt.verify(bearerToken, 'secret-key');
        req.user = decoded; 

        if (decoded.isAdmin) {
            console.log('Admin user detected');
            return next(); 
        }

        req.userId = decoded.userId; 
        console.log('Non-admin user detected');
        next();

    } catch (error) {
        console.log('Error during token verification:', error.message);
        res.status(401).json({ error: 'Invalid Token', details: error.message });
    }
}

module.exports = verifyToken;
