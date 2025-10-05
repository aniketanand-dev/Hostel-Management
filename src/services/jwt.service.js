const jwt = require('jsonwebtoken');

const env = require('./../config/env.config');

const JWT_SECRET = env.SECRET_KEY || 'your_jwt_secret';

exports.generateLoginToken = (user) => {
    //console.log(user);

    return jwt.sign(
        { id: user.id, email: user.email, type: 'login'},
        JWT_SECRET,
        //{ expiresIn: '1h' }
    );
};

//exports.generateSignupToken = (user) => {
//    return jwt.sign(
//        { id: user.id, email: user.email, type: 'signup' },
//        JWT_SECRET,
//        { expiresIn: '10m' }
//    );
//};

//exports.generatePasswordResetToken = (user) => {
//    return jwt.sign(
//        { id: user.id, email: user.email, type: 'password-reset' },
//        JWT_SECRET,
//        { expiresIn: '15m' }
//    );
//};

