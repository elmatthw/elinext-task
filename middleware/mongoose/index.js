const mongoose = require('mongoose');
require('dotenv').config();

const mongooseConnect = function() {
    mongoose.connect(process.env.db_url, {
        server: { 
             auto_reconnect: true 
            }, 
        useUnifiedTopology: true,
        useNewUrlParser: true})
  }

 /*  mongoose.Promise = global.Promise; */

  mongoose.connection.on('error', function(){
      mongoose.disconnect();
  })

  mongoose.connection.on('disconnected', function(){
      setTimeout(mongooseConnect, 10240)
  })

  mongooseConnect()

  exports.checkState = function(req, res, next){
      if (mongoose.connect.readyState != 1) {
          mongooseConnect()
          next()
          /* var err = new Error("Database connection not established");
          err.status = 500;
          next(err) */
      }

      next()
  }