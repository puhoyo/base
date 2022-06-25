const express = require('express');

const router = express.Router();

router.get('/asdfg', (req, res) => {
    res.render('test');
});

module.exports = router;