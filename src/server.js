var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mothership')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');

app.use(routes);

module.exports = app;
