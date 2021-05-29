var express = require('express')
var request = require('request')
require('dotenv').config()
var app = express()
const mongoose = require('mongoose')

const { Schema } = require('mongoose')
const sensorSchema = new Schema({
  temperature: Number,
  humidity: Number,
  registrationDate: Date,
})

const SensorModel = mongoose.model('sensor', sensorSchema)

app.get('/', function (req, res) {
  res.send('WebSense DB')
})

var dataPusher = setInterval(function () {
  request.get(`http://[${process.env.sensorIP}]/`, function (err, res, body) {
    if (err) {
      console.log(err)
      return
    }
    var obj = JSON.parse(body)
    console.log(obj)
    let sensorDoc = new SensorModel({
      temperature: obj.temp,
      humidity: obj.hum,
      registrationDate: new Date.UTC(),
    })

    sensorDoc.save()
  })
}, 5000)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose
  .connect(
    `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.fuyyc.mongodb.net/${process.env.defaultDB}?retryWrites=true&w=majority`
  )
  .then((res) => {
    console.log(`server is listening at port ${process.env.PORT}`)
    app.listen(process.env.PORT)
  })
  .catch((err) => {
    throw err
  })
