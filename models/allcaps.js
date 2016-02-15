// allcaps mongoose Schema object
'use strict'

const mongoose = require('mongoose');

module.exports = mongoose.model('allcaps',
   mongoose.Schema({}, {strict: false}));
   //and empty object will allow anything to be passed in a schema.
