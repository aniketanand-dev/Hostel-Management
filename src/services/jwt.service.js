const jwt = require('jsonwebtoken');

const env = require('./../config/env.config');

const JWT_SECRET = env.SECRET_KEY || 'your_jwt_secret';

exports.generateLoginToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET);
};

