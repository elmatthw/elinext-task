const express = require('express') 
const router = express.Router()
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const tar = require('tar-stream')
const fs = require('fs')
const zlib = require('zlib')
const readline = require('readline')
const Archive = require('../model')

router.use(fileUpload({
    createParentPath: true
}));

router.use(cors());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/save', async(req, res, next) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            let archive = req.files.archive;
            archive.mv('./storage/' + archive.name);
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: archive.name,
                    mimetype: archive.mimetype,
                    size: archive.size
                }
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

router.post('/insert-into-database', async(request, response, next) => {
    let archive = new Archive({
        title: request.body.title,
        description: request.body.description,
        expire: request.body.expire
    })
    saveArchive(archive).then(
        onfullfilled => {
            response.json({message: "200"});
        }
    )  
})

router.get('/archives', function(request, response, next) {
    return response.render('archives.ejs')
})

router.get('archives/archive', async(request, response) => {
    response.render('archive.ejs');
})

router.get('/archives/archive/get', async(request, response) => {
    let id = request.query.id
    await getArchiveById(id.toString()).then(
        result => {
            response.json(result);        
        },
        error => {
            response.send(`error: ${error}`);
        }
    )
    
})

router.get('/archives/all', async (request, response, next) => {
    var archives = await getArchives().then(
        result => {
            console.log(result);
            return response.json({archives: result})
        },
        error => {
            return response.json({message: `error: ${error}`})
        }
    );
})

router.get('/')

function readLines(archive, number_lines){
    var extract = tar.extract()
    let line_no = 0,
        lines = []
    extract.on('entry', function(header, stream, next) {
        let rl = readline.createInterface({
            input: stream
        })
        rl.on('line', function(line){
            line_no++
            lines.push(line);
            //console.log(line)
            if (line_no === number_lines) {
                rl.pause()
                rl.close()
                rl.removeAllListeners()
            }
        })
        stream.on('end', function() {
            next()
        })

        stream.resume()
    })
    extract.on('finish', function() {
        return lines;
    })
    fs.createReadStream("./storage/" + archive.title)
        .pipe(zlib.createGunzip())
        .pipe(extract);
}

async function getArchiveById(id){
    return await new Promise(function(resolve, reject){
        Archive.findById(id, function(err, doc) {
            if (err)
                throw err;
            resolve(doc)
            
        })
    })
}

async function saveArchive(archive){
    archive.save(function(err){
        if (err) {
            console.log(err);
            throw err;
        }
        console.log('saved to db');
    })
}

async function getArchives(){
    return new Promise(function(resolve, reject){
        Archive.find({}, function(err, doc) {
            if (err)
                throw err;
            resolve(doc);
        })
    })
}

router.get('/', async(request, response) => {
    response.render('index.ejs');
})


module.exports = router;