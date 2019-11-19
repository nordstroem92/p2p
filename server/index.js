const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
var http = require('http');
var path = require('path');

const app = express();
const sqlite3 = require('sqlite3').verbose();
//midlleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + 'images'));

const port = process.env.PORT || 80;

const server = http.createServer(app);//create a server


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})


const WebSocket = require('ws');
const s = new WebSocket.Server({ server });

app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){
  /******* when server receives messsage from client trigger function with argument message *****/
  ws.on('message',function(message){
  console.log("Received: "+message);
    s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
      if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
        client.send("broadcast: " +message);
      }
    });
    // ws.send("From Server only to sender: "+ message); //send to client where message is from
  });
  ws.on('close', function(){
    console.log("lost one client");
  });
  //ws.send("new client connected");
  console.log("new client connected");
});

app.use('/watchdog', function (req, res, next) {
    var t = moment.duration(parseInt(req.param('uptime')), 'milliseconds')
    var _message = req.param('ip') + " uptime " + t.hours() + " h " + t.minutes() + "m " + t.seconds() + "s + button: " + req.param("spot");
    console.log("watchdog from " + _message);
    var spot = req.param('spot');
    res.send("It is Alive" + _message);
    sendToDatabase(spot);
});

app.post('/watchdog', function(req,res){
    var sensor_data = req.body.reading;
    console.log(sensor_data); 
    res.end("yes");
});

app.post('/', (req, res) => {
  console.log("post received");
  const test  = req.body;
  console.log(req.body);
  res.send('OK'); // ALL GOOD
});

app.listen(port, ()=> console.log(`Server started on port ${port}`));

let db = new sqlite3.Database('./test.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the test database.');
});
 

db.run('CREATE TABLE IF NOT EXISTS available(spot INT)');

function sendToDatabase(available){
  console.log(available)
  db.run(`INSERT INTO available(spot) VALUES(` + available + ')' ,  function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}

let sql = `SELECT * FROM available`;

var minutes = 5, the_interval = minutes * 1 * 1000;

/*setInterval(function() {
  db.all(sql, [], (err, rows) => {
  if (err) {  
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.spot);
  });
});
// do your stuff here
}, the_interval);
*/
