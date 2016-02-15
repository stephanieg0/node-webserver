'use strict';
//dependencies
const express = require('express');
const app = express.Router();

//dependency routes
const api = require('./api');
const contact = require('./contact');
const hello = require('./hello');
const index = require('./index');
const random = require('./random');
const sendphoto = require('./sendphoto');
const cal = require('./cal');
const secret = require('./secret');


app.use(api);
app.use(contact);
app.use(hello);
app.use(index);
app.use(random);
app.use(sendphoto);
app.use(cal);
app.use(secret);

module.exports = app;
