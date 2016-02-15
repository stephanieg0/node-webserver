'use strict';

//dependencies
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/routes');

const PORT = process.env.PORT || 3000;
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_NAME = 'nodewebserver'

const MONGODB_AUTH = MONGODB_USER
  ? `${MONGODB_USER}:${MONGODB_PASS}@`
  : '';


const MONGODB_URL = `mongodb://${MONGODB_AUTH}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`;


console.log('mongodb_url>>>>', MONGODB_URL);
//mongolab url 'mongodb://ds035485.mongolab.com:35485/nodewebserver'
//localhost url 'mongodb://localhost:27017/node-webserver'


//setting up jade files in the view folder
app.set('view engine', 'jade');
app.locals.title = "Stephanie's Calendar";

//making public folder available
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//loading route modules
app.use(routes);

//mongoose connections
mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', () => {
  console.log('mongo open');
  //if (err) throw err;
  //db = database;

  app.listen(PORT, () => {
     console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});
/// route, controller, and view




