'use-strict';

//var $ = require('./public/vendor/jquery/dist/jquery.min.js');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require ('multer');
const upload = multer({ dest: 'tmp/uploads'});
var fs = require('fs');

const getMonth = require('./node_modules/node-cal/lib/month.js');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = "Stephanie's Calendar";

//app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
  const cal = getMonth.MakeMonth(2, 2016);
  res.render('index', {
    date: new Date(),
    calendar: cal
  });

});

app.get('/contact', (req, res) => {
  res.render('contact', {
  });
});

app.post('/contact', (req, res) => {
  //debugger;
  console.log(req.body);
  const name = req.body.name;
  res.send(`<h1>Thank you for contacting us ${name}</h1>`);
});

app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

app.post('/sendphoto', upload.single('image'), (req, res) => {
  //temporary location of the file
  var tmp_path = req.file.path;
  const fullName = req.file.originalname;
  const splitRes = fullName.split(".");
  //assign the file type to the new file name
  const newFileName = req.file.filename + '.' + splitRes[1];
  console.log(newFileName);

  //seting new path for new names
  var target_path = './tmp/renamed/' + newFileName;

  //move the file from the temporary location to the intended location
  fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
        });
    });
});//end of app.post

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

//accept two params and give a random number bewteen 1 and 5
app.get('/random/:min/:max', (req, res) => {

  const min = req.params.min;
  const max = req.params.max;
  const randomNumb = Math.floor( Math.random() * (max - min)) + min;

  res.send(randomNumb.toString());

});

app.get('/cal/:month/:year', (req, res) => {
    console.log('This is cal route');
    const month = req.params.month;
    const year = req.params.year;
    const calendar = getMonth.MakeMonth(month, year);
    console.log(month, year);
    res.send('<pre>' + calendar + '</pre>');

});

app.all('*', (req, res) => {

  res.status(403)
     .send( 'Access Denied');

});

app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
