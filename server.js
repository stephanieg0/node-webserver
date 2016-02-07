'use-strict';

//var $ = require('./public/vendor/jquery/dist/jquery.min.js');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require ('multer');
const upload = multer({ dest: 'tmp/uploads'});
const fs = require('fs');
const imgur = require('imgur');
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');

const getMonth = require('./node_modules/node-cal/lib/month.js');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = "Stephanie's Calendar";

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const cal = getMonth.MakeMonth(2, 2016);
  res.render('index', {
    date: new Date(),
    calendar: cal
  });
});

app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

app.post('/api', (req, res) => {
  console.log(req.body);//from postman
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  res.send(obj);
  console.log(obj);
});

app.get('/api/weather', (req, res) => {
  const apiKey = '2485e7cf38367fdd4ae514375860d9d0';
  const url = `https://api.forecast.io/forecast/${apiKey}/37.8267,-122.423`;
  request.get(url, (error, response, body) => {
    if (error) throw error;

    res.header('Access-Control-Allow-Origin', '*');

    res.send(JSON.parse(body));
  });
});

app.get('/api/news', (req, res) => {
  const url = 'http://cnn.com';

  request.get(url, (error, response, html) => {
    if (error) throw error;
    //console.log(error);
    const news = [];
    const $ = cheerio.load(html);
    const $bannerText = $('.banner-text');
    news.push({
      title: $bannerText.text(),
      url: url + $bannerText.closest('a').attr('href')
    });

    const $cdHeadline = $('.cd__headline');
    _.range(1, 12).forEach(i => {
      const $headline = $cdHeadline.eq(i);

      news.push({
        title: $headline.text(),
        url: url + $headline.find('a').attr('href')
      });
    });

    res.send(news);

  });
});

//web scrapping reddit
app.get('/api/reddit', (req, res) => {
  const url = 'https://www.reddit.com/';

  request.get(url, (error, response, html) => {
    if (error) throw error;

    const $ = cheerio.load(html);
    const $titleObj = $('#siteTable a.title');
    //console.log($titleObj);
    for (var i = 0; i < $titleObj.length; i++){
      //console.log('$titleObj', $titleObj[i].attribs.href);

      //sawpping all links for my youtube link.
      $($titleObj[i]).attr('href', 'https://www.youtube.com/watch?v=5_sfnQDr1-o');
      //console.log($titleObj[i]);
    }

    res.send($.html());

    //console.log($.html());

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
