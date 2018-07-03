module.exports = function(server){
// app.js

  // [LOAD PACKAGES]
  const express = require('express');
  const path = require('path');
  const app	    = express();
  const bodyParser = require('body-parser');
  const mongoose = require('mongoose');

  // DEFINE MODEL
  const Survey = require("./models/survey");


  // [SET SESSION]

  var session = require('express-session');
  app.use(session({
    secret: "835389341072-kr7rep1n0c3jmntkl1qvaeli4r3klf8s",
    resave: false,
    saveUninitialized: true
  }))

  // [CONFIGURE APP TO USER BODYPARSER]
  app.set('view engine','pug');
  app.set('views',path.join(__dirname,'../html'));
  app.use(express.static(path.join(__dirname,'../html')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());


  // [ CONFIGURE mongoose ]
  // CONNECT TO MONGODB SERVER
  const db = mongoose.connection;
  db.on('error',console.error);
  db.once('open',function(){
      console.log("connected to mongod server");
  });

  mongoose.connect("mongodb://localhost:27017/survey");


  // [SET ROUTER]
  const route = require('./routes')(app,Survey);


  return app;

}

