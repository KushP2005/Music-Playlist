/*
iTunes Music Search API Server
*/

const express = require('express')
const https = require('https')
const PORT = process.env.PORT || 3000

const app = express()

//Middleware
app.use(express.static(__dirname + '/public'))

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/mytunes', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/mytunes.html', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/index.html', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/songs', (request, response) => {
  let songTitle = request.query.title
  if(!songTitle) {
    response.json({message: 'Please enter a song title'})
    return
  }

  const titleWithPlusSigns = songTitle.replace(/ /g, '+')
  
  const options = {
    "method": "GET",
    "hostname": "itunes.apple.com",
    "port": null,
    "path": `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=20`,
    "headers": {
      "useQueryString": true
    }
  }

  const req = https.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      response.contentType('application/json').json(JSON.parse(songData))
    })
  })

  req.end()
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`http://localhost:3000`)
  }
})
