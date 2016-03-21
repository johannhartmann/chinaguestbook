var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var reqno = 0;
var http = require('http');
var redis = require('redis');
var client = redis.createClient(6379, 'redis');
var os = require("os");
var hostname = os.hostname();
const PORT=8080;


// connect to redis
client.on('connect', function() {
  console.log('Connected to redis');
});

var app = express();
app.use(favicon());
app.use(bodyParser.text());
app.use(express.static('./public'));
app.set('view engine', 'jade');
var comments = [
  {name: "Johann-Peter Hartmann",
   email: "hartmann@mayflower.de",
   message: "Sehr nettes Land"},
  {name: "Johann Hartmann anonym",
   email: "johannhartmann@gmail.com",
   message: "Immer nur Reis"}];

app.get('/', function (req, res) {
  client.incr('hits');
  client.get('hits', function(err, reply) {
    hits = reply;
    answer = 'Request no ' + reqno++ + ' on ' + hostname + '/' + req.url;
    res.render('index', { title: 'Guestbook', comments: comments, message: answer});
  });
});

app.post('/', function (req, res) {
  var name     = req.body.name;
  var email    = req.body.email;
  var message  = req.body.message;
})

app.listen(PORT, function () {
  console.log("Server listening on: http://" + hostname + ":%s", PORT);
})
