const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');

const app = express();
const sqlite3 = require('sqlite3').verbose();

//midlleware 
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + 'images'));
app.use(express.static(__dirname + 'js'));

const port = process.env.PORT || 5000;

app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

app.listen(port, ()=> console.log(`Server started on port ${port}`));

let db = new sqlite3.Database('./test.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the test database.');
});


db.run('CREATE TABLE IF NOT EXISTS langs(name text)');

db.run(`INSERT INTO langs(name) VALUES(?)`, ['C'], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
