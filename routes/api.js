const express = require('express');
const {restApi} = require('../restApi/restApi');
const {verifyToken} = require('./middlewares');

const router = express.Router();

router.post('/', verifyToken, restApi, (req, res) => {
    res.send(res.resData);
});

module.exports = router;