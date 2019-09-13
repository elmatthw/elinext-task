async function app_routing(fastify, options){
    fastify.register(require('./data'));

    fastify.post('/insert-into-database', async(request, reply) => {
        await routes.saveArchive(request.body);
        reply.send({message: "200"});
    })
}

module.exports = app_routing;