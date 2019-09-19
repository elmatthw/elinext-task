const Archive = require('../model')
const data = require('./data')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const validator = require('./validation')

exports.index = async(request, response) => {
    response.render('index.ejs');
}

exports.save = async(req, res, next) => {
    fileUpload({
        createParentPath: true
    })
    cors()
    bodyParser.json()
    bodyParser.urlencoded({ extended: true })
    try {
        
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {    
            let archive = req.files.archive;
            if(validator.isValidExtension(archive.name)){
                archive.mv('./storage/' + archive.name);
                res.json({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: archive.name,
                        mimetype: archive.mimetype,
                        size: archive.size
                    }
                });
            }
            else {
                res.json({
                    status: false,
                    error: "Invalid extension"}
                );
            }
            
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
}

exports.insertIntoDatabase = async(request, response, next) => {
    if (validator.isValidDate(request.body.date, request.body.time)) {
        var expire = new Date(request.body.date + " " + request.body.time).toISOString()
        let archive = new Archive({
            title: request.body.title,
            description: request.body.description,
            expire: expire
        })
        data.saveArchive(archive).then(
            onfullfilled => {
                response.json({message: "200"});
            }
        )  
    }
    else
        response.json({error: "Invalid date or time"})
    
}