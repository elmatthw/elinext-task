import { MongoClient } from 'mongodb';
const fastifyPlugin = require('fastify-plugin');

async function dbConnector(fastify, options){
    const url = options.url;
    delete options.url;

    const db = await MongoClient.connect(url, options);
    fastify.decorate('mongo', db);
}

module.exports = fastifyPlugin(dbConnector);