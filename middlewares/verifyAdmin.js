const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next){
    const authHeader = req.header('Authorization');
    if(!authHeader) return res.status(401).json({ error : "Access denied. No token provided!"});
    
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. Invalid token format!" });
    }
    try{
        const decoded = jwt.verify(token, 'secret-key');
        if(decoded.isAdmin){
            req.user = decoded;
            next();
        }
        else{
            return res.status(403).json({ error : 'Access denied. Admins Only!'});
        }
    }
    catch(error){
        console.log(error);
            res.status(400).json({error : "Invalid token!"});
        }
};

module.exports = verifyAdmin;
