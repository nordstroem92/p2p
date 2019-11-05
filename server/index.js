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
  })

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server started on port ${port}`));