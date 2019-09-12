const fs = require('fs')
const concat = require('concat-stream')
const pump = require('pump')

async function routes(fastify, options) {
    const database = fastify.mongo.db('db')
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
          await saveArchive({title: filename, description: 'nice', expire: new Date("<2020-12-22T08:00:00Z>")})
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

    async function saveArchive(json){
        return await collection.insertOne(json, function(err, res) {
          if (err)
            throw err;
          console.log('one document inserted')
          console.log(res);
        });
    }

    fastify.get('/', async(request, reply) => {
        reply.view('/index.ejs');
    })
}

module.exports = routes;