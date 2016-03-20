var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var redis = require('redis');
var client = redis.createClient(6379, 'redis');
var os = require("os");
var hitsi,reqno = 0;
var hostname = os.hostname();
const PORT=8080;


// connect to redis
client.on('connect', function() {
  console.log('Connected to redis');
  client.get('hits', updateHits);
});

function updateHits(err, reply) {
  hits = reply;
}



var app = express();
app.use(favicon());
app.use(bodyParser.urlencoded());

// app.use('/', index);
// app.use('/guestbook', guestbook);

app.get('/', function (req, res) {
  client.incr('hits');
  client.get('hits', updateHits);
  answer = 'Request no ' + reqno++ + ' on ' + hostname + '/' + req.url;
  // console.log(answer);
  res.send(answer);
});

app.listen(PORT, function () {
  console.log("Server listening on: http://" + hostname + ":%s", PORT);
})
