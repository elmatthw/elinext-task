async function routes(fastify, options) {
    const database = fastify.mongo.db('db')
    const collection = database.collection('archives')

    fastify.get('/', async (request, response) => {
        response.send({hello: 'world'});
    })
}