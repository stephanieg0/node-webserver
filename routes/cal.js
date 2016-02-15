'use strict';

const express = require('express');
const app = express.Router();

//dependency modules
const getMonth = require('../node_modules/node-cal/lib/month.js');

app.get('/cal/:month/:year', (req, res) => {
    console.log('This is cal route');
    const month = req.params.month;
    const year = req.params.year;
    const calendar = getMonth.MakeMonth(month, year);
    console.log(month, year);
    res.send('<pre>' + calendar + '</pre>');
});

module.exports = app;
