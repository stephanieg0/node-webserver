'use strict';

const express = require('express');
const app = express.Router();

app.all('/secret', (req, res) => {

  res.status(403)
     .send( 'Access Denied');

});

module.exports = app;
