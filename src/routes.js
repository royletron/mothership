var express = require('express');
var router = express.Router();

router.post('/lobby')

router.get('/lobby/:token')

router.get('/game/:gameID')

router.post('/game/:token/:column/:row')

module.exports = router;
