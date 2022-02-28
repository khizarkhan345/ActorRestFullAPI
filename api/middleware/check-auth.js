const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        
        const token = req.headers.Authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next()
    } catch(err) {
        return res.status(401).json({
            message: "Auth Failed!!"
        })
    }
     
    
}