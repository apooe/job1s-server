const config =require('../../config');
const jwt = require('express-jwt');
const getTokenFromHeader = (req) => {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};


const isAuth = jwt({
    secret: config.auth.jwtSecret, // Has to be the same that we used to sign the JWT

    userProperty: 'token', // this is where the next middleware can find the encoded data generated in services/auth:generateToken -> 'req.token'

    getToken: getTokenFromHeader, // A function to dequeue the auth token from the request
});


module.exports = {isAuth};
