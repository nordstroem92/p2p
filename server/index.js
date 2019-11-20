const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
var path = require('path');

const app = express();


const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
	wss.on('connection', function connection(ws) {
		ws.on('message', function incomming(message) {
			console.log("'received", message);
		});
		ws.send("WITT OG JONAS STYRER TIL AT LAVE WEBSOCKETS! :) <3<3<3<3");
	});

//midlleware
app.use(bodyParser.json());
app.use(cors());


/*wss.on('connection', ws => {
	ws.on('message', message => {
		console.log(`received: ${message}`);
	});
	ws.send('Hello Client');
});*/

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

app.use(express.static(__dirname + '/images'));

app.use(express.static('public'));

server.listen(process.env.PORT || 80, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

function originIsAllowed(origin) {
  return true;
}


//POST from PI
app.post('/', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    res.send('OK'); // ALL GOOD
  } else {
    res.status(400).send('You need to provide Username & password'); // BAD REQUEST
  }
});

const express = require('express')
const bodyParser = require('body-parser')
const express = require('express')
const bodyParser = require('body-parser')
