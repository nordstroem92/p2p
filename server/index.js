const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment'); //
var path = require('path');

const app = express();
const sqlite3 = require('sqlite3').verbose();
//midlleware 
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + 'images'));

const port = process.env.PORT || 5000;


app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/watchdog', function (req, res, next) {
    var t = moment.duration(parseInt(req.param('uptime')), 'milliseconds')
    var _message = req.param('ip') + " uptime " + t.hours() + " h " + t.minutes() + "m " + t.seconds() + "s + button: " + req.param("spot");
    console.log("watchdog from " + _message);
    var spot = req.param('spot');
    res.send("It is Alive" + _message);
    sendToDatabase(spot);
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

let sql = `SELECT * FROM available ORDER BY spot DESC LIMIT 5`;

var minutes = 5, the_interval = minutes * 1 * 1000;

setInterval(function() {
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

