'use strict'
let express = require('express')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let gaussian = require('gaussian')

var distribution = gaussian(247, 0.3136)


require('dotenv').config()


let app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))


app.use('/', require('./routes/index'))





let PORT = process.env.PORT || 3001

app.listen(PORT, function(){
  console.log(PORT);
})
