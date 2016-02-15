//*** Index ** //
'use strict';
//dependencies
const express = require('express');
const app = express.Router();

//dependency modules
const getMonth = require('../node_modules/node-cal/lib/month.js');

//Routes
app.get('/', (req, res) => {
  const cal = getMonth.MakeMonth(2, 2016);
  res.render('index', {
    date: new Date(),
    calendar: cal
  });
});

module.exports = app;
