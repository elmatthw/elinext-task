const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
var expressMongoDb = require('express-mongo-db');
const app = express();
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));

process.on('unhandledRejection', up => { throw up });

app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, '/public/view'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); 
app.use(expressMongoDb('mongodb://localhost:27017/'))
app.use(require('./routes/data.js'))
app.use(require('./routes/archives.js'))

var server = app.listen(3000, () => {
    console.log(`server listening on ${server.address().port}`)
})