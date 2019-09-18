const express = require('express') 
const app = express.Router()
const controller = require('../controller/index')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/')
    .get(controller.index)

app.route('/save')
    .post(controller.save)

app.route('/insert-into-database')
    .post(controller.insertIntoDatabase)


module.exports = app
