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
const PORT=80;


// connect to redis
client.on('connect', function() {
  console.log('Connected to redis');
});

var app = express();
app.use(favicon());
app.use(bodyParser.urlencoded());
app.use(express.static('./public'));
app.set('views', __dirname);
app.set('view engine', 'jade');


app.get('/', function (req, res) {
  var info =   answer = 'Request no ' + reqno++ + ' on ' + hostname + '/' + req.url;

  client.lrange('comments', 0, 3, function(error, commentsary) {
    if (!error) {
      var len = commentsary.length;
      var comments = [];
      for (var i = 0; i < len; i++) {
        comments.push(JSON.parse(commentsary[i]));
      }
      res.render('index', { title: 'Guestbook', comments: comments, message: info});
    } else {
      console.log('Error: ' + error);
      res.render('index', { title: 'Guestbook', comments: [], message: info});
    }
  });
});



app.post('/', function (req, res) {
  var name     = req.body.name;
  var email    = req.body.email;
  var message  = req.body.message;
  var jsondata = JSON.stringify({name: name, email: email, message: message});
  client.lpush('comments', jsondata);
  res.redirect('/');
})

app.listen(PORT, function () {
  console.log("Server listening on: http://" + hostname + ":%s", PORT);
})
