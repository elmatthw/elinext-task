const fastify = require('fastify')({
    logger: true
})

fastify.register(require('./routes/connector'), {
    url: 'mongodb://localhost:270127/'
})
fastify.register((require('./routes/data')))


const start = async() => {
    try {
        await fastify.listen(3000)
        fastify.log.info(`server is listening on ${address}`)
    }
    catch(err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()