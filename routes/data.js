const express = require('express') 
const app = express.Router()
const bodyParser = require('body-parser');
const controller = require('../controller/archives')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/')
    .get(controller.index)

app.route('/all')
    .get(controller.all)

app.route('/archive')
    .get(controller.archive)

app.route('/archive/get')
    .get(controller.getArchive)

app.route('/archive/getlines')
    .get(controller.getLines)

module.exports = app;