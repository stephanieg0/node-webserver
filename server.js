//My mini Router

'use-strict';

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/hello', (req, res)=>{

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

  res.send(getRandomInit(randomNumb).toString());

});

app.get('/cal', (req, res) => {
  const month = require('node-cal/month.js');
});

app.all('*', (req, res) => {

  res.status(403)
     .send( 'Access Denied');

});

app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
