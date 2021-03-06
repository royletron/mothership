var express = require('express');
var moment = require('moment');
var router = express.Router();
var uuid = require('node-uuid');
var session = require('express-session')
var User = require('./models/User');
var Game = require('./models/Game');

//This is where you should announce you are ready to play
//POST -> {name: 'Darren'} -> {name: 'Darren', token: 'abc123'}
router.post('/lobby', function (req, res){
  if(req.body.name === undefined) {
    return res.status(400).send({message: 'You need to give me a name dammit!'})
  }
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if(err) return res.status(400).send(err);
    if(!user) {
      User.create({name: req.body.name, token: uuid.v4()}, function(err, user){
        if(err) return res.status(400).send(err);
        user.token = user._id
        res.send(user);
      })
    } else {
      User.update({_id: user._id}, {lastseen: Date.now(), lobby: true}, function(err, result) {
        res.send(user);
      })
    }
  })
})

//This is where you poll waiting for a game
//GET -> {} -> {} || {gameID: 'abc123'} in the second case the game is ready for you to go into
router.get('/lobby/:token', function(req, res) {
  User.findOne({
    token: req.params.token
  }, function(err, user) {
    if(err) return res.status(400).send(err);
    if(!user) return res.status(400).send({message: 'There was no user for that token... what are you upto?'})
    //I NEED TO FIND A PLAYER, OR EXISTING GAME?
    Game.findOne({
      $or: [{p1: user._id}, {p2: user._id}],
      status: 'playing'
    }, function(err, existingGame) {
      console.log(err, existingGame);
      if(err) return res.status(400).send(err);
      if(existingGame) return res.send({gameID: existingGame._id});
      //NEED TO MAKE A NEW GAME?
      User.findOne({token: {$ne: req.params.token}, lastseen: {$gt: moment().subtract(5, 'minutes')}, lobby: true}, function(err, result){
        if(err) return res.status(400).send(err);
        if(!result) return res.send({})
        Game.create({status: 'playing', p1: user._id, p2: result._id, currentPlayer: Math.random() > 0.5 ? user._id : result._id, gameState: [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]]}, function(err, newGame) {
          res.send({gameID: newGame._id})
        })
      })
    })
  })
})

//This is where you can poll the state of a game
//GET -> {} -> {status: 'playing | finished', currentPlayer: 'PLAYER_TOKEN', gameState: [columns][rows]}
router.get('/game/:gameID', function(req, res){
  Game.findOne({
    _id: req.params.gameID
  }, function(err, game) {
    if(err) return res.status(400).send(err);
    if(!game) return res.status(400).send({message: 'No game'})
    res.send(game);
  })
})

//This is where you can post your move
//POST -> {} -> {gamestate: [columns][rows], success: true || false} will only return false if it wasn't your go, or the game is closed
router.post('/game/:gameID/:column/:row', function(req, res){
  Game.findOne({
    _id: req.params.gameID
  }, function(err, game){
    if(err) return res.status(400).send(err);
    if(!game) return res.status(400).send({message: 'No game'})
    if(game.currentPlayer.toString() !== req.body.token.toString()) {
      return res.status(400).send({message: 'It is not your turn...'})
    }
    try {
      if(game.gameState[parseInt(req.params.column)][parseInt(req.params.row)] !== null) {
        return res.status(400).send({message: 'That position is already taken, are you trying to mess with me?'})
      }
      game.gameState[parseInt(req.params.column)][parseInt(req.params.row)] = req.body.token
      Game.update({_id: req.params.gameID}, {gameState: game.gameState, currentPlayer: game.currentPlayer.toString() === game.p1.toString() ? game.p2 : game.p1}, function(err, result){
        if(err) return res.status(400).send(err);
        return res.send(game);
      })
    } catch(e) {
      return res.status(400).send(err);
    }
  })
})

module.exports = router;
