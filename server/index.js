const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
var path = require('path');

const app = express();

//setup database
let db = new sqlite3.Database('./test.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the test database.');
});
db.run('CREATE TABLE IF NOT EXISTS available(spotID INT, status INT)');
  
function sendToDatabase(available, status){
console.log(available, status)
db.run('INSERT INTO available(spotID, status) VALUES('+available+','+status +');');
}

function GetFromDatabase(){
let sql = 'SELECT * FROM available WHERE status=1';
db.all(sql, [], (err, rows) => {
	if (err) {
	throw err;
	}
	rows.forEach((row) => {
	console.log(row.name);
	});
});
}

sendToDatabase(1, 0);
GetFromDatabase()

db.close();

//create websocket connection
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
	wss.on('connection', function connection(ws) {
		ws.on('message', function incomming(message) {
			if (typeof message === 'string' ) {
				console.log("message: "+message[id]);
				console.log("message: "+message);
			} else {
				//get ID of object
				var dataObj = JSON.parse(message);
				slotID = dataObj['id'];
				console.log(slotID);
			}
		});
		ws.send("WITT OG JONAS STYRER TIL AT LAVE WEBSOCKETS! :) <3<3<3<3");
	});
//midlleware
app.use(bodyParser.json());
app.use(cors());

//routing
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