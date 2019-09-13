const fs = require('fs')
const concat = require('concat-stream')
const pump = require('pump')
var ObjectId = new require('mongodb').ObjectId

async function routes(fastify, options) {
    const database = fastify.mongo.db('elinext')
    const collection = database.collection('archives')
    fastify.register(require('fastify-multipart'))
    
    fastify.post('/save', async (request, reply) => {
      const mp = request.multipart(handler, function (err) {
        
        reply.code(200).send()
      })
        mp.on('field', function (key, value) {
          console.log('form-data', key, value)
        })
      
        async function handler (field, file, filename, encoding, mimetype) {
          pump(file, fs.createWriteStream('./storage/' + filename))
        }
    })


    fastify.post('/insert-into-database', async(request, reply) => {
        await saveArchive(request.body);
        reply.send({message: "200"});
    })

    fastify.get('/archives', async(request, reply) => {
        reply.view('/archives.ejs')
    })

    fastify.get('/archive', async(request, reply) => {
        reply.view('/archive.ejs');
    })

    fastify.get('/archive/:id', async(request, reply) => {
        let id = request.query.id
        await getArchiveById(id.toString()).then(
            result => {
                reply.send(result);        
            },
            error => {
                reply.send(`error: ${error}`);
            }
        )
        
    })

    fastify.get('/all-archives', async(request, reply) => {
        var archives = await getArchives().then(
            result => {
                console.log(result);
                reply.send({archives: result})
            },
            error => {
                reply.code(500).send({message: `error: ${error}`})
            }
        );
    })

    async function getArchiveById(id){
        return new Promise(function(resolve, reject){
            collection.findOne({_id: ObjectId(id)}, function(err, res){
                if (err)
                    throw err;
                resolve(res);
            })
        })
    }

    async function saveArchive(json){
        return await collection.insertOne(json, function(err, res) {
          if (err)
            throw err;
        });
    }

    async function getArchives(){
        return new Promise(function(resolve, reject){
            collection.find({}).toArray(function(err, res){
                if (err)
                    throw err;
                resolve(res);
            })
        })
    }

    fastify.get('/', async(request, reply) => {
        reply.view('/index.ejs');
    })
}

module.exports = routes;