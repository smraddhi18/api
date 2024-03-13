// // authMiddleware.js
const jwt = require('jsonwebtoken');
require("dotenv").config()
// // Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN,{ algorithms: ['HS256'] },(err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        console.log(req.user)
        next(); 
    });
    
}

module.exports = authenticateToken;

