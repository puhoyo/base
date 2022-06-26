const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

exports.verifyToken = (req, res, next) => {
    try {
        if(process.env.NODE_ENV === 'local') {
            res.locals.userId = 1;
        }
        else {
            const {token} = req.body;
            if (!token) res.send(new Error('token is not defined'));
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            res.locals.userId = decoded.i;
        }
        return next();
    }
    catch(error) {
        if(error.name === 'TokenExpiredError') {
            return res.send(new Error('token is expired'));
        }
        else {
            return res.send(new Error('unknown token error'));
        }
    }
};

exports.apiLimiter = rateLimit({
    windowMs: 1000, // 1s
    max: 5,
    delayMs: 0,
    handler(req, res) {
        res.send();
    }
});

exports.verifyLocal = (req, res, next) => {
    if(process.env.NODE_ENV === 'local') {
        return next();
    }
    else {
        return res.json({
            code: 403,
            message: 'cannot execute this request: service state is not local state',
        });
    }
};

exports.verifyServerReady = (req, res, next) => {
    if(req.app.get('ready')) {
        return next();
    }
    else {
        return res.send(new Error('server is not ready'));
    }
};