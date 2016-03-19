var http = require('http');
var redis = require('redis');
var client = redis.createClient(6379, 'redis');
var hits = 0;

client.on('connect', function() {
  console.log('Connected to redis');
  client.set('hits', hits);
});

function updateHits(err, reply) {
  hits = reply;
}


//Lets define a port we want to listen to
const PORT=80;

//We need a function which handles requests and send response
function handleRequest(request, response){
  client.incr('hits');
  client.get('hits', updateHits);
  response.end('It Works!! Path Hit No ' + hits);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
