var express = require('express');
var router = express.Router();

//This is where you should announce you are ready to play
//POST -> {name: 'Darren'} -> {name: 'Darren', token: 'abc123'}
router.post('/lobby')

//This is where you poll waiting for a game
//GET -> {} -> {} || {gameID: 'abc123'} in the second case the game is ready for you to go into
router.get('/lobby/:token')

//This is where you can poll the state of a game
//GET -> {} -> {status: 'playing | finished', currentPlayer: 'PLAYER_TOKEN', gameState: [columns][rows]}
router.get('/game/:gameID')

//This is where you can post your move
//POST -> {} -> {gamestate: [columns][rows], success: true || false} will only return false if it wasn't your go, or the game is closed
router.post('/game/:token/:column/:row')

module.exports = router;
