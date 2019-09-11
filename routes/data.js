const fs = require('fs')
const concat = require('concat-stream')
const pump = require('pump')

async function routes(fastify, options) {
    const database = fastify.mongo.db('db')
    const collection = database.collection('archives')
    fastify.register(require('fastify-multipart'))
    fastify.addContentTypeParser('multipart/form-data', function (req, done) {
        formDataParser(req, function (err, body) {
          done(err, body)
        })
      })
    fastify.post('/save', async (request, reply) => {
        const mp = request.multipart(handler, function (err) {
            console.log('upload completed')
            reply.code(200).send()
          })
          mp.on('field', function (key, value) {
            console.log('form-data', key, value)
          })
        
          function handler (field, file, filename, encoding, mimetype) {
            pump(file, fs.createWriteStream('./storage/' + filename))
          }
    })

    fastify.get('/', async(request, reply) => {
        reply.view('/index.ejs');
    })
}

module.exports = routes;