const fastify = require('fastify')({
    logger: true
})
const path = require('path');
const resolve = require('path').resolve
const serveStatic = require('serve-static')

fastify.register(require('./routes/connector'), {
    url: 'mongodb://localhost:27017/'
})
fastify.register(require('./routes/data.js'))
fastify.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    },
    templates: path.join(__dirname, '/public/view/'),
    options: {
        filename: resolve(path.join(__dirname, '/public/view/partials'))
    }
  })
fastify.use(serveStatic(path.join(__dirname, '/public')))

const start = async() => {
    try {
        await fastify.listen(3000)
        console.log(`server listening on ${fastify.server.address().port}`)
    }
    catch(err) {
        console.log(err);
        //fastify.log.error(err)
        process.exit(1)
    }
}
start()