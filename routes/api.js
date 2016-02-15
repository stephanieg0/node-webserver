//?*** API ***///
'use strict';

//dependencies
const express = require('express');
const app = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');


//Mongoose Schema Dependency modules
const News = require('../models/news');
const AllCaps = require('../models/allcaps');


////***** ALL CAPS *****////
app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

app.post('/api', (req, res) => {
  console.log('body>>>', req.body);//from postman
  const obj = _.mapValues(req.body, val => val.toUpperCase());

  //sending object data to database with mongodb
  //db.collection('appcaps').insertOne(obj, (err, result) => {

  //using mongoose schema
  const caps = new AllCaps(obj);
  caps.save((err, _caps) => {
    if (err) throw err;

    //console.log('res.ops.[0]>>>', res.ops[0]);
    //saving object after the data has been sent to database.
    res.send(_caps);
  });
});

///**** WEATHER *****////
app.get('/api/weather', (req, res) => {
  const apiKey = '2485e7cf38367fdd4ae514375860d9d0';
  const url = `https://api.forecast.io/forecast/${apiKey}/37.8267,-122.423`;
  request.get(url, (error, response, body) => {
    if (error) throw error;

    res.header('Access-Control-Allow-Origin', '*');

    res.send(JSON.parse(body));
  });
});


// //**** NEWS ****////
app.get('/api/news', (req, res) => {
  News.findOne().sort('_id').exec((err, doc) => {

    //making a collection for news. if doc is found then post, otherwise request new obj.
  //db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {

   //console.log('doc>>>>', doc);

   //if doc is found get timestamp to find latest news
   if (doc) {
    const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
    const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
    const lessThan15MinutesAgo = diff < 0;
    //if doc is less than 15 mins ago send, otherwise request.get new object.
    if (lessThan15MinutesAgo) {
      res.send(doc);
      return;
    }
   }
   //where news are coming from
    const url = 'http://cnn.com';

    //webscraping cnn's html with cheerio
    request.get(url, (error, response, html) => {
      if (error) throw error;
      //console.log(error);
      const news = [];
      //cheerio is to get jquery objects from html page.
      const $ = cheerio.load(html);
      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });//end news.push

      const $cdHeadline = $('.cd__headline');
      _.range(1, 12).forEach(i => {
          const $headline = $cdHeadline.eq(i);

          news.push({
            title: $headline.text(),
            url: url + $headline.find('a').attr('href')
          });//end new.push
        });//end foreach function

        const obj = new News({top: news})
        //inserting data into mongodb before sending new obj.
        //db.collection('news').insertOne({top: news}, (err, result) => {
        obj.save((err, _news) => {
        if (err) throw err;
          res.send(_news);
        });//end db.collection

      });//end request.get

  });//end db.collection
});//end app.get
//********


////**** WEB SCRAPPING REDDIT ****////
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


module.exports = app;
