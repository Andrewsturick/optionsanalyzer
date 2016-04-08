'use strict'
let express = require('express')
let router = express.Router()
let gaussian = require('gaussian')
let request = require('request')
let distribution = gaussian(237, 0.3136)


router.get('/', function(req, res){
  res.sendfile('index.html')

})

router.get('/2', function(req, res){
  request.get('https://rooftoptrading.firebaseio.com/market/TSLA/currentChains/2016-03-18/chain.json', cb)

  function cb(err, data){
    data = JSON.parse(data.body)
    var strikeArray = Object.keys(data)
    strikeArray.map(function(d,i){
      var parsed = d.replace('@', '.');
      strikeArray[i] = Number(parsed)
      if(parsed != d){
        data[Number(parsed)] = data[d]
        delete data[d]
      }
    })
    var d3data = []
    for(var key in data){
        if( data[key].call.delta > 0.03 && data[key].call.delta < 0.97){
          d3data.push(data[key])
        }
    }



    d3data.sort(function(a,b){return a.numberStrike - b.numberStrike})




    res.send(d3data)






  }

})


module.exports = router
