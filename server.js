var express = require('express')
var cors = require('cors')
const axios = require('axios');

var app = express()

app.use(cors())

app.get('/ey/Ey1qPL9mqeL/46e53beb65gii.mpd', async function (req, res, next) {
  var { data } = await axios.get(`https://aniboom.one/embed/lk8qW14XmoO?episode=1&translation=30`, {
    headers: {
      'referer' : 'https://animego.org/'
    }
  });

  var xxx = [...data.matchAll(/<div id="video" data-parameters="(.*)"><\/div>/gmi)][0][1]
  let decoded = xxx.replace(/&quot;/g, '"').replace(/\\\\/g, '')
  var data = JSON.parse(decoded)
  console.log(data)

  var hls = JSON.parse(data.hls)
  var dash = JSON.parse(data.dash)
  var { data } = await axios.get(dash.src, {
    headers: {
      'referer' : 'https://aniboom.one/'
    }
  });
    // console.log(data)
  res.send(data)
})

app.get('*.m4s', async function (req, res, next) {
  // console.log(req.originalUrl)

  const response = await axios.get(`https://sophia.yagami-light.com/${req.originalUrl}`, {
    headers: {
      'referer' : 'https://aniboom.one/'
    },
    responseType: 'stream'
  });
  res.setHeader('Content-Type', 'video/mp4');
  response.data.pipe(res);
})


// app.get('*.m4s', async function (req, res, next) {
//   // console.log(req.originalUrl)

//   // const response = await axios.get(`https://sophia.yagami-light.com/${req.originalUrl}`, {
//   //   headers: {
//   //     'referer' : 'https://aniboom.one/'
//   //   },
//   //   responseType: 'stream'
//   // });
//   res.setHeader('Referer', 'https://aniboom.one/');
//   res.redirect(302, `https://sophia.yagami-light.com${req.originalUrl}`)

// })


app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 80')
})