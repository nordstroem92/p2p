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

function getFromDatabase(){
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

//sendToDatabase(1, 0);
//getFromDatabase()

db.close();

//create websocket connection
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
	wss.on('connection', function connection(ws) {
		ws.on('message', function incomming(message) {
			console.log("message: "+message);

			let msgNoBrackets = message.replace(/{/g, "");
			let msgNoBackslash = message.replace(/\\/, "");
			let msgNoSpace = msgNoBackslash.replace(" ", "");
			var res = msgNoSpace.split(/[:,]+/);
			console.log("Message -> id:"+res[0]+"="+res[1]+", status:"+res[2]+"="+res[3]+"");

			if (message.toString().includes("{")){ //if message is a JSON object update DB
				let msgNoBrackets = message.replace(/{/g, "");
				let msgNoSpace = msgNoBrackets.replace(" ", "");
				var res = msgNoSpace.split(/[:,]+/);
				console.log("Message -> id: "+res[0]+"="+res[1]+", status: "+res[2]+"="+res[3]+"");
				//sendToDatabase(1, 3);
				//getFromDatabase()
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