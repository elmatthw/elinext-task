const router = require('express').Router()
const fs = require('fs')
const pump = require('pump')
const Archive = require('../model')
const dbName = 'elinext';

//const collection = database.collection('archives')

//fastify.register(require('fastify-multipart'))

/* fastify.post('/save', async (request, response) => {
    const mp = request.multipart(handler, function (err) {
    
    response.code(200).send()
    })
    mp.on('field', function (key, value) {
        console.log('form-data', key, value)
    })
    
    async function handler (field, file, filename, encoding, mimetype) {
        pump(file, fs.createWriteStream('./storage/' + filename))
    }
}) */




router.get('/archives', async(request, response) => {
    response.render('archives.ejs')
})

router.get('/archive', async(request, response) => {
    response.render('archive.ejs');
})

router.get('/archive/:id', async(request, response) => {
    console.log('here in get')
    let id = request.query.id
    console.log(id)
    await getArchiveById(id.toString()).then(
        result => {
            response.json(result);        
        },
        error => {
            response.send(`error: ${error}`);
        }
    )
    
})

router.get('/all-archives', async(request, response) => {
    var connection = request.db;
    var archives = await getArchives(connection).then(
        result => {
            console.log(result);
            response.json({archives: result})
        },
        error => {
            response.send({message: `error: ${error}`})
        }
    );
})

async function getArchiveById(id){
    console.log('here');
    return new Promise(function(resolve, reject){
        Archive.findById(id, function(err, doc) {
            if (err)
                throw err;
            console.log(doc);
            resolve(doc);
        })
    })
}

async function saveArchive(json){
    return await collection.insertOne(json, function(err, res) {
        if (err)
        throw err;
    });
}

async function getArchives(connection){
    return new Promise(function(resolve, reject){
        connection.db(dbName).collection.find({}).toArray(function(err, res){
            if (err)
                throw err;
            console.log(res);
            resolve(res);
        })
    })
}

router.get('/', async(request, response) => {
    response.render('index.ejs');
})


module.exports = router;