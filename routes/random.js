'use strict';

const express = require('express');
const app = express.Router();

//accept two params and give a random number bewteen 1 and 5
app.get('/random/:min/:max', (req, res) => {

  const min = req.params.min;
  const max = req.params.max;
  const randomNumb = Math.floor( Math.random() * (max - min)) + min;

  res.send(randomNumb.toString());

});

module.exports = app;
