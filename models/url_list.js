const mongoose = require('mongoose')
const schema = mongoose.Schema
const urlListSchema = new schema({
  inputURL: {
    type: STRING,
    required: true
  },
  outputURL: {
    type: STRING,
    required: true
  }
})
module.exports = mongoose.model(('URLlist', urlListSchema))