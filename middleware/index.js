var express = require('express')
var request = require('request')
require('dotenv').config()
var app = express()
const mongoose = require('mongoose')

const { Schema } = require('mongoose')
const sensorSchema = new Schema({
  temperature: Number,
  registrationDate: Date,
})

import dataInspector from './data-inspector'

const SensorModel = mongoose.model('sensor', sensorSchema)

app.get('/', function (req, res) {
  res.send('WebSense DB')
})

var dataPusher = setInterval(async function () {
  await request.get(
    `http://[${process.env.SensorIP}]/`,
    // --------------------------------
    // change the ip address from line above if .env files are hidden
    // --------------------------------
    function (err, res, body) {
      if (err) {
        console.log(err)
        return
      }

      let [lightSensor, tempSensor] = dataInspector(body)

      let sensorDoc = new SensorModel({
        temperature: tempSensor,
        registrationDate: new Date.UTC(),
      })

      await sensorDoc.save()
    }
  )
}, 5000)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose
  .connect(process.env.dbConnectionString)
  .then((res) => {
    console.log(`server is listening at port ${process.env.PORT}`)
    app.listen(process.env.PORT)
  })
  .catch((err) => {
    throw err
  })
