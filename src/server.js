var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost:27017/mothership' || process.env.MONGODB_URI)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var routes = require('./routes');
