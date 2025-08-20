const jwt = require('jsonwebtoken');
const JWT_SECRET = 'segredo-super-seguro';

function authenticateJWT(req, res, next) {
    // const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // if (!token) {
    //     return res.sendStatus(401); // sem token
    // }

    // jwt.verify(token, JWT_SECRET, (err, user) => {
    //     if (err) {
    //         return res.sendStatus(403); // token inválido
    //     }
    //     req.user = user;
    //     next();
    // });
    next();
}

module.exports = authenticateJWT;