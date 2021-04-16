const express = require('express')
require('babel-polyfill')
const Cors = require('cors')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables
const keys = require('./config/keys')


app.use(express.static('dist'))
app.use(Cors())

const secret = ({ apikey: keys.ufcAPI })

const bodyParser = require('body-parser');
const { get } = require('https');
const { default: axios } = require('axios')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})



app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

app.get(`/fighters/image/:name`, async (request, response) => {
  console.log("inside bruh")
  axios.get(`https://www.ufc.com/athlete/${request.params.name}`)
  .then( data => {
    // console.log(data.data)
    return response.json(data.data)

  })
  .catch(function (error) {
    response.send(null);
});
});
// create route to get single book by its isbn
app.get('/rankings', (request, response) => {
  console.log("inside inside")
  // make api call using fetch
  fetch(`http://api.sportradar.us/ufc/trial/v2/en/rankings.json?api_key=${secret.apikey}`)
  .then(response => {
    if(!response.ok) {
      throw new Error("This is an error")
    } else {
      return response
    }

  })
  .then((response) => {
      return response.text();
  }).then((body) => {
      let results = JSON.parse(body)
      console.log(results)   // logs to server
      response.send(results) // sends to frontend
    })
    .catch(function (error) {
      response.send(error.response);
  });
});

app.get('/fighters/:fighterId', (request, response) => {
  fetch(`http://api.sportradar.us/ufc/trial/v2/en/competitors/${request.params.fighterId}/profile.json?api_key=${secret.apikey}`)
  .then((response) => {
      return response.text();
  }).then((body) => {
      let results = JSON.parse(body)
      console.log(results)
      response.send(results)
    })
    .catch(function (error) {
      console.log(error.response);
  });
});



// create a search route
app.get('/search', (request, response) => {
  fetch(`http://openlibrary.org/search.json?q=${request.query.string}`)
  .then((response) => {
      return response.text();
  }).then((body) => {
      let results = JSON.parse(body)
      console.log(results)
      response.send(results)
    });
});
