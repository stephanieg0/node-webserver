////***** SEND PHOTO ******////
'use strict';

//Dependencies
const express = require('express');
const app = express.Router();
const fs = require('fs');
const imgur = require('imgur');
const multer = require ('multer');
const upload = multer({ dest: 'tmp/uploads'});

//Routes
app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

app.post('/sendphoto', upload.single('image'), (req, res) => {
  //temporary location of the file
  //var tmp_path = req.file.path;
  var tmp_path = req.file.path;
  console.log('temp path', tmp_path);
  const fullName = req.file.originalname;

  //splitting the file type to append into new name
  const splitRes = fullName.split(".");

  //assign the file type to the new file name
  const newFileName = req.file.filename + '.' + splitRes[1];
  //console.log(newFileName);

  //seting new path for new names
  var target_path = './tmp/uploads/' + newFileName;

  //saving renamed file with correct name
  fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
        });
    });

  imgur.uploadFile(target_path)
    .then(function (json) {
        console.log(json.data.link);
        //deleting renamed file
        fs.unlink(target_path, function() {
          console.log(`Deleted renamed file ${target_path}`);
        });
    })
    .catch(function (err) {
        console.error(err.message);
    });

});//end of app.post

module.exports = app;
