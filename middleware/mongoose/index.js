const mongoose = require('mongoose');
require('dotenv').config();

const mongooseConnect = function() {
    mongoose.connect(process.env.db_url, {
        server: { 
             auto_reconnect: true 
            }, 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false})
  }

  mongoose.connection.on('error', function(){
      mongoose.disconnect();
  })

  mongoose.connection.on('disconnected', function(){
      setTimeout(mongooseConnect, 10240)
  })

  mongooseConnect()