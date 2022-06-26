const express = require('express');
const {restApi} = require('../dist/restApi/restApi');
const {verifyToken} = require('./middlewares');

const router = express.Router();

router.post('/', verifyToken, restApi, (req, res) => {
    res.send(res.locals.resData);
});

module.exports = router;