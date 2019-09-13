const MongoClient = require('mongodb').MongoClient
const fastifyPlugin = require('fastify-plugin');

async function dbConnector(fastify, options){
    const url = options.url;
    delete options.url;

    const db = await MongoClient.connect(url, options);
    fastify.decorate('mongo', db);
}

module.exports = dbConnector;