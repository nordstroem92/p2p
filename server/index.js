'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');

const app = express();

//midlleware 
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

app.use(express.static(__dirname + '/images'));

const port = process.env.PORT || 5000 ;

app.use(express.static('public'));

app.listen(port, ()=> console.log(`Server started on port ${port}`));

function originIsAllowed(origin) {
  return true;
}

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 80 });
wss.on('connection', ((ws) => {
ws.on('message', (message) => {
console.log(`received: ${message}`);
});

ws.on('end', () => {
console.log('Connection ended...');
});
ws.send('Hello Client');
}));