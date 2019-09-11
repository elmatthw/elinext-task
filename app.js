const fastify = require('fastify')({
    logger: true
})
const path = require('path');

fastify.register(require('./routes/connector'), {
    url: 'mongodb://localhost:27017/elinext'
})
fastify.register(require('./routes/data.js'))
fastify.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    },
    templates: path.join(__dirname, '/public/view/'),
    options: {}
  })
//fastify.use(['/css', '/js/*'], fastify.static(path.join(__dirname, '/public')))

const start = async() => {
    try {
        await fastify.listen(3000)
    }
    catch(err) {
        console.log(err);
        //fastify.log.error(err)
        process.exit(1)
    }
}
start()