const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlListSchema = new Schema({
  inputURL: {
    type: String,
    required: true
  },
  outputURL: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('URLlist', urlListSchema)