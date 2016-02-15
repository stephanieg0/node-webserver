'use strict';

const express = require('express');
const app = express.Router();

app.get('/hello', (req, res) => {
  const name = req.query.name;
  const msg = `<h1> Hello ${name} </h1> <h2> Goodbye ${name} </h2>`;

  //specify html format
  res.writeHead(200, {
      'Content-type': 'text/html'
  });

   //chunk response by character
  msg.split('').forEach((char, index) => {

      setTimeout(() => {

      res.write(char);
      }, 1000 * index);
    });

  //wait for all characters to be sent
  setTimeout(() => {

    res.end();
  }, msg.length * 1000 + 2000);
});

module.exports = app;
