////***** CONTACT ROUTE *****////
'use strict';

//Dependencies
const express = require('express');
const app = express.Router();

//Mongoose Schema Dependency modules
const Contact = require('../models/contact');

//Routes
app.get('/contact', (req, res) => {
  console.log('res>>> ', res);
  res.render('contact', {
  });
});

app.post('/contact', (req, res) => {

  //new Conatct is refering to a mongoose model/schema already created.
  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });
  //saving to database using mongoose
  obj.save((err, newObj) => {
    if (err) throw err;

    console.log(newObj);
    res.send(`<h1>Thank you for contacting us ${newObj.name}</h1>`);
  })

  //saving to database using mongodb and not mongoose.
  //db.collection('contact').insertOne(obj, (err, result) => {
     //if (err) throw err;

    //console.log(obj);
    //const name = req.body.name;
    //res.send(`<h1>Thank you for contacting us ${name}</h1>`);
  //});
});


//Exports
module.exports = app;
