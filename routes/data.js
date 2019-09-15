const express = require('express') 
const router = express.Router()
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const Archive = require('../model')

router.use(fileUpload({
    createParentPath: true
}));

router.use(cors());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/save', async(req, res) => {
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

router.post('/insert-into-database', async(request, response) => {
    let archive = new Archive({
        title: request.body.title,
        description: request.body.description,
        expire: request.body.expire
    })
    await saveArchive(archive);
    response.json({message: "200"});
})

router.get('/archives', function(request, response, next) {
    return response.render('archives.ejs')
})

router.get('/archive', async(request, response) => {
    response.render('archive.ejs');
})

router.get('/get-archive', async(request, response) => {
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

router.get('/all-archives', async (request, response, next) => {
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

async function getArchiveById(id){
    return await new Promise(function(resolve, reject){
        Archive.findById(id, function(err, doc) {
            if (err)
                throw err;
            console.log(doc);
            resolve(doc);
        })
    })
}

async function saveArchive(archive){
    return new Promise(function(reject, resolve){
        archive.save(function(err){
            if (err) {
                console.log(err);
                throw err;
            }
                
            console.log('saved to db');
        })
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